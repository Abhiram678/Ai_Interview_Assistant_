# AI-Powered Interview Assistant

A comprehensive React application with Python Flask backend that provides an AI-powered interview experience for candidates and a dashboard for interviewers.

## Features

### For Candidates (Interviewee Tab)
- **Resume Upload**: Upload PDF or DOCX resumes with automatic field extraction
- **Profile Completion**: Chatbot collects missing information (name, email, phone)
- **AI-Powered Interview**: 6 questions (2 Easy → 2 Medium → 2 Hard) with timers
- **Dual Input Methods**: Text typing and voice recording for answers
- **Real-time Feedback**: Visual timers, progress tracking, and auto-submission
- **Welcome Back Modal**: Resume unfinished interviews after page refresh

### For Interviewers (Interviewer Tab)
- **Candidate Dashboard**: View all candidates with scores and status
- **Detailed Analytics**: Individual candidate performance and AI summaries
- **Search & Sort**: Filter candidates by name, email, or sort by score/date
- **Real-time Sync**: Live updates between interviewer and interviewee tabs

### Technical Features
- **AI Integration**: Groq API for question generation and answer scoring
- **Data Persistence**: SQLite database with full CRUD operations
- **Real-time Communication**: WebSocket for tab synchronization
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Framer Motion for enhanced user experience

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Framer Motion** - Animations and transitions
- **Axios** - HTTP client
- **Socket.io-client** - Real-time communication
- **React Dropzone** - File upload handling
- **Lucide React** - Icons

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-SocketIO** - WebSocket support
- **PyPDF2** - PDF text extraction
- **python-docx** - DOCX text extraction
- **Groq** - AI API for questions and scoring

### Database
- **SQLite** - Local database storage

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up the database:
```bash
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

5. Start the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Configuration

### Groq API Setup
1. Get your API key from [Groq Console](https://console.groq.com/)
2. Set the API key in the backend:
```python
# In backend/services/ai_service.py
ai_service.set_api_key("your-groq-api-key-here")
```

## Usage

### Starting an Interview
1. Open the application in your browser
2. Switch to the "Interviewee" tab
3. Upload your resume (PDF or DOCX)
4. Complete any missing profile information
5. Start the interview and answer 6 questions
6. View your final score and AI summary

### Managing Candidates
1. Switch to the "Interviewer" tab
2. View all candidates with their scores
3. Search or sort candidates as needed
4. Click on any candidate to view detailed interview results

## Project Structure

```
ai_assistant_2/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── models/                # Database models
│   │   ├── database.py
│   │   ├── candidate.py
│   │   ├── interview.py
│   │   ├── question.py
│   │   └── answer.py
│   ├── services/              # Business logic
│   │   ├── resume_service.py
│   │   ├── ai_service.py
│   │   └── interview_service.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Main pages
│   │   ├── context/          # State management
│   │   └── App.js
│   └── package.json
└── README.md
```

## API Endpoints

### Resume Processing
- `POST /api/upload-resume` - Upload and extract resume data
- `GET /api/extract-fields` - Get extracted fields from resume

### Interview Management
- `POST /api/start-interview` - Start new interview
- `POST /api/submit-answer` - Submit answer and get next question
- `GET /api/check-unfinished-interview` - Check for unfinished interviews
- `POST /api/resume-interview` - Resume unfinished interview

### Candidate Management
- `GET /api/candidates` - Get all candidates
- `GET /api/candidate/<id>` - Get candidate details

## Features in Detail

### Resume Processing
- Supports PDF and DOCX formats
- Extracts name, email, and phone number
- Validates file size and format
- Handles missing fields gracefully

### AI Question Generation
- Context-aware questions for React/Node.js roles
- Difficulty-based question selection
- Dynamic scoring based on answer quality
- Comprehensive performance summaries

### Real-time Features
- WebSocket communication between tabs
- Live progress updates
- Synchronized candidate data
- Instant score updates

### Data Persistence
- SQLite database for local storage
- Automatic data recovery on app restart
- Interview state preservation
- Candidate history tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.
