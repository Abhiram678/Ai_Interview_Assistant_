from models.database import db
from datetime import datetime

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    answer_text = db.Column(db.Text, nullable=False)
    score = db.Column(db.Float, nullable=False)
    time_taken = db.Column(db.Integer, nullable=False)  # in seconds
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'question_id': self.question_id,
            'answer_text': self.answer_text,
            'score': self.score,
            'time_taken': self.time_taken,
            'created_at': self.created_at.isoformat()
        }
