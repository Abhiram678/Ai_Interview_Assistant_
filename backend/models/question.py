from models.database import db

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    interview_id = db.Column(db.Integer, db.ForeignKey('interview.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)  # easy, medium, hard
    question_number = db.Column(db.Integer, nullable=False)
    
    # Relationship with answers
    answers = db.relationship('Answer', backref='question', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'interview_id': self.interview_id,
            'question_text': self.question_text,
            'difficulty': self.difficulty,
            'question_number': self.question_number
        }
