from models.database import db
from models.interview import Interview
from models.question import Question
from models.answer import Answer

class InterviewService:
    def __init__(self):
        pass
    
    def get_interview_progress(self, interview_id):
        """Get the current progress of an interview"""
        try:
            interview = Interview.query.get(interview_id)
            if not interview:
                return None
            
            questions = Question.query.filter_by(interview_id=interview_id).order_by(Question.question_number).all()
            answered_questions = 0
            
            for question in questions:
                if question.answers:
                    answered_questions += 1
            
            return {
                'total_questions': len(questions),
                'answered_questions': answered_questions,
                'current_question': answered_questions + 1,
                'progress_percentage': (answered_questions / 6) * 100 if questions else 0
            }
        
        except Exception as e:
            print(f"Error getting interview progress: {e}")
            return None
    
    def pause_interview(self, interview_id):
        """Pause an ongoing interview"""
        try:
            interview = Interview.query.get(interview_id)
            if interview:
                interview.status = 'paused'
                db.session.commit()
                return True
            return False
        
        except Exception as e:
            print(f"Error pausing interview: {e}")
            return False
    
    def resume_interview(self, interview_id):
        """Resume a paused interview"""
        try:
            interview = Interview.query.get(interview_id)
            if interview:
                interview.status = 'in_progress'
                db.session.commit()
                return True
            return False
        
        except Exception as e:
            print(f"Error resuming interview: {e}")
            return False
