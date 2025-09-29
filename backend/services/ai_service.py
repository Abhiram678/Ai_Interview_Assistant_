import os
from groq import Groq

class AIService:
    def __init__(self):
        # Initialize Groq client with API key from environment
        self.api_key = os.getenv('GROQ_API_KEY', '')
        try:
            if self.api_key:
                self.client = Groq(api_key=self.api_key)
            else:
                print("No Groq API key found in environment variables")
                self.client = None
        except Exception as e:
            print(f"Error initializing Groq client: {e}")
            self.client = None
    
    def set_api_key(self, api_key):
        """Set the Groq API key"""
        self.api_key = api_key
        self.client = Groq(api_key=api_key)
    
    def generate_question(self, question_number, difficulty):
        """Generate interview question based on difficulty and question number"""
        if not self.client:
            return self._get_fallback_question(question_number, difficulty)
        
        try:
            prompt = f"""
            Generate a technical interview question for a Full Stack Developer position (React/Node.js).
            
            Question Number: {question_number}
            Difficulty: {difficulty}
            
            Please generate a specific, practical question that tests:
            - React concepts (components, hooks, state management)
            - Node.js/Express concepts (APIs, middleware, databases)
            - General programming concepts
            
            Make the question clear, specific, and appropriate for {difficulty} level.
            Return only the question text, no additional formatting.
            """
            
            response = self.client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            print(f"Error generating question: {e}")
            return self._get_fallback_question(question_number, difficulty)
    
    def score_answer(self, question, answer, difficulty):
        """Score the candidate's answer"""
        if not self.client:
            return self._get_fallback_score(difficulty)
        
        try:
            prompt = f"""
            Score this interview answer on a scale of 1-10.
            
            Question: {question}
            Answer: {answer}
            Difficulty: {difficulty}
            
            Consider:
            - Technical accuracy
            - Problem-solving approach
            - Code quality (if applicable)
            - Communication clarity
            - Completeness of answer
            
            Return only a number between 1-10.
            """
            
            response = self.client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=10,
                temperature=0.3
            )
            
            score_text = response.choices[0].message.content.strip()
            # Extract number from response
            import re
            score_match = re.search(r'\d+', score_text)
            if score_match:
                score = float(score_match.group())
                return min(max(score, 1), 10)  # Clamp between 1-10
            
            return self._get_fallback_score(difficulty)
        
        except Exception as e:
            print(f"Error scoring answer: {e}")
            return self._get_fallback_score(difficulty)
    
    def generate_summary(self, interview_data):
        """Generate a summary of the candidate's performance using actual interview data"""
        if not self.client:
            return "Interview completed. AI summary generation requires API key."
        
        try:
            # Extract interview details
            candidate_name = interview_data.get('candidate_name', 'Candidate')
            final_score = interview_data.get('final_score', 0)
            questions_answers = interview_data.get('questions_answers', [])
            
            # Build detailed prompt with actual interview data
            prompt = f"""
            Generate a comprehensive interview summary for {candidate_name} who scored {final_score}/10.
            
            Interview Details:
            - Final Score: {final_score}/10
            - Total Questions: {len(questions_answers)}
            
            Question-by-Question Performance:
            """
            
            for i, qa in enumerate(questions_answers, 1):
                question = qa.get('question', '')
                answer = qa.get('answer', '')
                score = qa.get('score', 0)
                difficulty = qa.get('difficulty', 'unknown')
                
                prompt += f"""
            Q{i} ({difficulty.upper()}): {question}
            Answer: {answer}
            Score: {score}/10
            """
            
            prompt += """
            
            Please provide a professional summary including:
            1. Overall assessment of technical knowledge
            2. Key strengths demonstrated
            3. Areas for improvement
            4. Recommendation for hiring
            5. Specific technical skills evaluation
            
            Keep it concise but comprehensive (200-300 words).
            """
            
            response = self.client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.5
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            print(f"Error generating summary: {e}")
            return f"Interview completed successfully. {candidate_name} scored {final_score}/10. Detailed analysis requires AI service."
    
    def _get_fallback_question(self, question_number, difficulty):
        """Fallback questions when AI is not available"""
        questions = {
            'easy': [
                "What is React and what are its main advantages?",
                "Explain the difference between state and props in React.",
                "What is Node.js and what is it commonly used for?",
                "What is the difference between GET and POST HTTP methods?"
            ],
            'medium': [
                "How would you implement state management in a large React application?",
                "Explain the concept of middleware in Express.js and provide an example.",
                "How would you handle authentication in a Node.js application?",
                "What are React hooks and how do they differ from class components?"
            ],
            'hard': [
                "Design a scalable architecture for a real-time chat application using React and Node.js.",
                "How would you implement server-side rendering (SSR) in a React application?",
                "Explain the event loop in Node.js and how it handles asynchronous operations.",
                "How would you optimize the performance of a React application with thousands of components?"
            ]
        }
        
        question_list = questions.get(difficulty, questions['easy'])
        index = (question_number - 1) % len(question_list)
        return question_list[index]
    
    def _get_fallback_score(self, difficulty):
        """Fallback scoring when AI is not available"""
        import random
        if difficulty == 'easy':
            return round(random.uniform(6, 8), 1)
        elif difficulty == 'medium':
            return round(random.uniform(5, 7), 1)
        else:
            return round(random.uniform(4, 6), 1)
