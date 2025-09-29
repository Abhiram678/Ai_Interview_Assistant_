from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from models.database import db, init_db
from models.candidate import Candidate
from models.interview import Interview
from models.question import Question
from models.answer import Answer
from services.resume_service import ResumeService
from services.ai_service import AIService
from services.interview_service import InterviewService
import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///interview_assistant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize services
resume_service = ResumeService()
ai_service = AIService()
interview_service = InterviewService()

# Initialize database
with app.app_context():
    init_db()

@app.route('/api/upload-resume', methods=['POST'])
def upload_resume():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save file temporarily
        filename = file.filename
        file_path = f"temp_{filename}"
        file.save(file_path)
        
        # Extract data from resume
        extracted_data = resume_service.extract_resume_data(file_path)
        
        # Clean up temp file
        os.remove(file_path)
        
        return jsonify({
            'success': True,
            'data': extracted_data
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/start-interview', methods=['POST'])
def start_interview():
    try:
        data = request.json
        candidate_data = data.get('candidate')
        
        # Create or update candidate
        candidate = Candidate.query.filter_by(email=candidate_data['email']).first()
        if not candidate:
            candidate = Candidate(
                name=candidate_data['name'],
                email=candidate_data['email'],
                phone=candidate_data['phone']
            )
            db.session.add(candidate)
            db.session.commit()
        
        # Create new interview
        interview = Interview(
            candidate_id=candidate.id,
            status='in_progress',
            started_at=datetime.utcnow()
        )
        db.session.add(interview)
        db.session.commit()
        
        # Generate first question
        first_question = ai_service.generate_question(1, 'easy')
        
        # Save question to database
        question = Question(
            interview_id=interview.id,
            question_text=first_question,
            difficulty='easy',
            question_number=1
        )
        db.session.add(question)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'interview_id': interview.id,
            'question': {
                'id': question.id,
                'text': first_question,
                'difficulty': 'easy',
                'number': 1,
                'time_limit': 20
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/submit-answer', methods=['POST'])
def submit_answer():
    try:
        data = request.json
        question_id = data.get('question_id')
        answer_text = data.get('answer')
        time_taken = data.get('time_taken', 0)
        
        # Get question
        question = Question.query.get(question_id)
        if not question:
            return jsonify({'error': 'Question not found'}), 404
        
        # Score the answer
        score = ai_service.score_answer(question.question_text, answer_text, question.difficulty)
        
        # Save answer
        answer = Answer(
            question_id=question_id,
            answer_text=answer_text,
            score=score,
            time_taken=time_taken
        )
        db.session.add(answer)
        db.session.commit()
        
        # Check if interview is complete
        interview = question.interview
        total_questions = Question.query.filter_by(interview_id=interview.id).count()
        
        if total_questions >= 6:
            # Interview complete
            interview.status = 'completed'
            interview.completed_at = datetime.utcnow()
            
            # Prepare interview data for AI summary
            candidate = Candidate.query.get(interview.candidate_id)
            questions_answers = []
            
            for q in interview.questions:
                answer = Answer.query.filter_by(question_id=q.id).first()
                questions_answers.append({
                    'question': q.question_text,
                    'answer': answer.answer_text if answer else '',
                    'score': answer.score if answer else 0,
                    'difficulty': q.difficulty
                })
            
            interview_data = {
                'candidate_name': candidate.name,
                'final_score': interview.calculate_final_score(),
                'questions_answers': questions_answers
            }
            
            # Generate final summary using Groq AI
            summary = ai_service.generate_summary(interview_data)
            interview.summary = summary
            
            db.session.commit()
            
            return jsonify({
                'success': True,
                'interview_complete': True,
                'summary': summary,
                'final_score': interview.calculate_final_score()
            })
        else:
            # Generate next question
            next_question_number = total_questions + 1
            if next_question_number <= 2:
                difficulty = 'easy'
                time_limit = 20
            elif next_question_number <= 4:
                difficulty = 'medium'
                time_limit = 60
            else:
                difficulty = 'hard'
                time_limit = 120
            
            next_question_text = ai_service.generate_question(next_question_number, difficulty)
            
            # Save next question
            next_question = Question(
                interview_id=interview.id,
                question_text=next_question_text,
                difficulty=difficulty,
                question_number=next_question_number
            )
            db.session.add(next_question)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'interview_complete': False,
                'next_question': {
                    'id': next_question.id,
                    'text': next_question_text,
                    'difficulty': difficulty,
                    'number': next_question_number,
                    'time_limit': time_limit
                }
            })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/candidates', methods=['GET'])
def get_candidates():
    try:
        candidates = Candidate.query.all()
        candidate_list = []
        
        for candidate in candidates:
            latest_interview = Interview.query.filter_by(
                candidate_id=candidate.id
            ).order_by(Interview.started_at.desc()).first()
            
            if latest_interview:
                candidate_list.append({
                    'id': candidate.id,
                    'name': candidate.name,
                    'email': candidate.email,
                    'phone': candidate.phone,
                    'final_score': latest_interview.calculate_final_score(),
                    'status': latest_interview.status,
                    'completed_at': latest_interview.completed_at.isoformat() if latest_interview.completed_at else None
                })
        
        # Sort by score (highest first)
        candidate_list.sort(key=lambda x: x['final_score'], reverse=True)
        
        return jsonify({
            'success': True,
            'candidates': candidate_list
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/candidate/<int:candidate_id>', methods=['GET'])
def get_candidate_details(candidate_id):
    try:
        candidate = Candidate.query.get(candidate_id)
        if not candidate:
            return jsonify({'error': 'Candidate not found'}), 404
        
        interview = Interview.query.filter_by(
            candidate_id=candidate_id
        ).order_by(Interview.started_at.desc()).first()
        
        if not interview:
            return jsonify({'error': 'No interview found'}), 404
        
        questions = Question.query.filter_by(interview_id=interview.id).order_by(Question.question_number).all()
        
        interview_data = {
            'id': interview.id,
            'status': interview.status,
            'started_at': interview.started_at.isoformat(),
            'completed_at': interview.completed_at.isoformat() if interview.completed_at else None,
            'summary': interview.summary,
            'final_score': interview.calculate_final_score(),
            'questions': []
        }
        
        for question in questions:
            answer = Answer.query.filter_by(question_id=question.id).first()
            interview_data['questions'].append({
                'id': question.id,
                'text': question.question_text,
                'difficulty': question.difficulty,
                'number': question.question_number,
                'answer': answer.answer_text if answer else None,
                'score': answer.score if answer else None,
                'time_taken': answer.time_taken if answer else None
            })
        
        return jsonify({
            'success': True,
            'candidate': {
                'id': candidate.id,
                'name': candidate.name,
                'email': candidate.email,
                'phone': candidate.phone
            },
            'interview': interview_data
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/check-unfinished-interview', methods=['GET'])
def check_unfinished_interview():
    try:
        # Check for any in-progress interviews
        unfinished_interview = Interview.query.filter_by(status='in_progress').first()
        
        if unfinished_interview:
            candidate = Candidate.query.get(unfinished_interview.candidate_id)
            return jsonify({
                'has_unfinished': True,
                'candidate': {
                    'id': candidate.id,
                    'name': candidate.name,
                    'email': candidate.email
                },
                'interview_id': unfinished_interview.id,
                'started_at': unfinished_interview.started_at.isoformat()
            })
        
        return jsonify({
            'has_unfinished': False
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/resume-interview', methods=['POST'])
def resume_interview():
    try:
        data = request.json
        interview_id = data.get('interview_id')
        
        interview = Interview.query.get(interview_id)
        if not interview:
            return jsonify({'error': 'Interview not found'}), 404
        
        # Get the last answered question
        last_answered = db.session.query(Answer).join(Question).filter(
            Question.interview_id == interview_id
        ).order_by(Answer.id.desc()).first()
        
        if last_answered:
            # Get next question
            next_question = Question.query.filter(
                Question.interview_id == interview_id,
                Question.question_number > last_answered.question.question_number
            ).order_by(Question.question_number).first()
        else:
            # Get first question
            next_question = Question.query.filter_by(
                interview_id=interview_id
            ).order_by(Question.question_number).first()
        
        if not next_question:
            return jsonify({'error': 'No questions found'}), 404
        
        # Determine time limit
        if next_question.difficulty == 'easy':
            time_limit = 20
        elif next_question.difficulty == 'medium':
            time_limit = 60
        else:
            time_limit = 120
        
        return jsonify({
            'success': True,
            'question': {
                'id': next_question.id,
                'text': next_question.question_text,
                'difficulty': next_question.difficulty,
                'number': next_question.question_number,
                'time_limit': time_limit
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# WebSocket events
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('connected', {'data': 'Connected to server'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('sync_data')
def handle_sync(data):
    # Broadcast to all connected clients
    emit('data_updated', data, broadcast=True)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    socketio.run(app, debug=False, host='0.0.0.0', port=port, allow_unsafe_werkzeug=True)
