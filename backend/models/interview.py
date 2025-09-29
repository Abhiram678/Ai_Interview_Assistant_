from models.database import db
from datetime import datetime

class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'), nullable=False)
    status = db.Column(db.String(20), default='in_progress')  # in_progress, completed, paused
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    summary = db.Column(db.Text, nullable=True)
    
    # Relationship with questions
    questions = db.relationship('Question', backref='interview', lazy=True)
    
    def calculate_final_score(self):
        """Calculate the final score based on all answers"""
        total_score = 0
        total_questions = 0
        
        for question in self.questions:
            if question.answers:
                total_score += question.answers[0].score
                total_questions += 1
        
        return round(total_score / total_questions, 2) if total_questions > 0 else 0
    
    def to_dict(self):
        return {
            'id': self.id,
            'candidate_id': self.candidate_id,
            'status': self.status,
            'started_at': self.started_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'summary': self.summary,
            'final_score': self.calculate_final_score()
        }
