# 🧠 InterviewAI - AI-Powered Interview Assistant

<div align="center">

![InterviewAI Logo](https://img.shields.io/badge/InterviewAI-AI%20Powered-blue?style=for-the-badge&logo=brain&logoColor=white)

**Revolutionary AI-powered interview platform for modern hiring**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-green?style=for-the-badge&logo=netlify&logoColor=white)](https://golden-tiramisu-6c1984.netlify.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-orange?style=for-the-badge&logo=render&logoColor=white)](https://ai-interview-ij7y.onrender.com)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-LLM-00A67E?style=flat&logo=openai&logoColor=white)](https://groq.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org/)

</div>

---

## ✨ What is InterviewAI?

InterviewAI is a cutting-edge interview platform that combines artificial intelligence with modern web technologies to deliver a seamless interview experience. Whether you're a candidate looking to showcase your skills or an interviewer seeking efficient candidate evaluation, InterviewAI provides the tools you need.

### 🎯 Key Highlights

- **🤖 AI-Powered Questions**: Dynamic question generation for React/Node.js roles
- **📊 Real-time Analytics**: Live dashboard with candidate performance insights
- **🎤 Voice & Text Input**: Flexible answer submission methods
- **⏱️ Smart Timing**: Adaptive time limits based on question difficulty
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **🔄 Real-time Sync**: Live updates between interviewer and candidate views

---

## 🚀 Live Demo

### 🌐 **Frontend**: [Visit Live Demo](https://ai-interview-ij7y.onrender.com/)


---

## 🎨 Features

### 👤 **For Candidates**
- 📄 **Smart Resume Upload** - PDF/DOCX with automatic field extraction
- 🧠 **AI-Generated Questions** - 6 questions (2 Easy → 2 Medium → 2 Hard)
- 🎤 **Dual Input Methods** - Text typing and voice recording
- ⏰ **Visual Timers** - Real-time countdown with auto-submission
- 🔄 **Resume Capability** - Continue unfinished interviews

### 👥 **For Interviewers**
- 📊 **Candidate Dashboard** - View all candidates with scores and status
- 🔍 **Advanced Search** - Filter by name, email, score, or date
- 📈 **Detailed Analytics** - Individual performance and AI summaries
- 🔄 **Real-time Updates** - Live synchronization between tabs
- 📋 **Export Options** - Download candidate reports

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI framework
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **Socket.io** - Real-time communication
- **React Dropzone** - File upload handling

### **Backend**
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **Flask-SocketIO** - WebSocket support
- **PyPDF2** - PDF text extraction
- **python-docx** - DOCX processing

### **AI & Database**
- **Groq AI** - Question generation and scoring
- **SQLite** - Local database storage

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Groq API Key

### 1. Clone the Repository
```bash
git clone https://github.com/Abhiram678/Ai_Interview_Assistant_.git
cd Ai_Interview_Assistant_
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Environment Variables
```bash
# Backend
export GROQ_API_KEY="your-groq-api-key"

# Frontend
export REACT_APP_API_URL="http://localhost:5000"
```

---

## 📱 How It Works

### **Interview Flow**
1. **📄 Upload Resume** - Candidate uploads PDF/DOCX resume
2. **🤖 AI Processing** - System extracts candidate information
3. **✅ Confirmation** - Review and edit extracted details
4. **🎯 Interview Start** - AI generates first question
5. **⏱️ Timed Responses** - Answer with text or voice input
6. **📊 Real-time Scoring** - AI evaluates each answer
7. **📈 Final Report** - Comprehensive performance summary

### **Dashboard Features**
- **📊 Candidate Overview** - All candidates with scores
- **🔍 Advanced Filtering** - Search and sort capabilities
- **📋 Detailed Views** - Individual candidate performance
- **🔄 Live Updates** - Real-time synchronization

---

## 🎯 API Endpoints

### **Resume & Interview**
- `POST /api/upload-resume` - Upload and process resume
- `POST /api/start-interview` - Begin new interview
- `POST /api/submit-answer` - Submit answer and get next question
- `GET /api/check-unfinished-interview` - Check for incomplete interviews

### **Candidate Management**
- `GET /api/candidates` - Get all candidates
- `GET /api/candidate/<id>` - Get candidate details
- `POST /api/resume-interview` - Resume incomplete interview

---


## 🔧 Configuration

### **Groq AI Setup**
1. Get API key from [Groq Console](https://console.groq.com/)
2. Set environment variable: `GROQ_API_KEY=your-key-here`
3. AI will generate questions and score answers automatically

### **Deployment**
- **Frontend**: Deploy to Netlify, Vercel, or any static host
- **Backend**: Deploy to Render, Railway, or any Python host
- **Database**: SQLite (included) or upgrade to PostgreSQL

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Groq AI** for powerful language model capabilities
- **React Team** for the amazing frontend framework
- **Flask Team** for the lightweight Python web framework
- **Open Source Community** for the incredible tools and libraries

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Abhiram678/Ai_Interview_Assistant_/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Abhiram678/Ai_Interview_Assistant_/discussions)
- **Email**: [Contact Support](mailto:support@interviewai.com)

---

<div align="center">

**Made with ❤️ by [Abhiram](https://github.com/Abhiram678)**

[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=social&logo=github)](https://github.com/Abhiram678)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=social&logo=linkedin)](https://linkedin.com/in/abhiram)

**⭐ Star this repository if you found it helpful!**

</div>
