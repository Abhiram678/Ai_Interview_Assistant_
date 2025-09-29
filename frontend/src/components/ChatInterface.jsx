import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import InterviewComplete from './InterviewComplete';
import './ChatInterface.css';

const ChatInterface = ({ 
  currentQuestion, 
  onInterviewComplete, 
  onStartInterview,
  loading, 
  error 
}) => {
  const { submitAnswer, currentInterview } = useApp();
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(currentQuestion);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [summary, setSummary] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [inputMode, setInputMode] = useState('text');
  
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  useEffect(() => {
    if (currentQuestion) {
      setCurrentQ(currentQuestion);
      setTimeRemaining(currentQuestion.time_limit);
      setInterviewStarted(true);
      setTextAnswer('');
      setTranscript('');
    }
  }, [currentQuestion]);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopRecording();
      };

      recognitionRef.current.onend = () => {
        stopRecording();
      };
    }
  }, []);

  useEffect(() => {
    if (interviewStarted && timeRemaining > 0 && !isAnswering) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [interviewStarted, timeRemaining, isAnswering]);

  const handleTimeUp = async () => {
    if (isAnswering) return;
    
    setIsAnswering(true);
    const timeTaken = currentQ.time_limit - timeRemaining;
    const answer = textAnswer || transcript || '';
    
    const result = await submitAnswer(currentQ.id, answer, timeTaken);
    
    if (result) {
      if (result.interview_complete) {
        setFinalScore(result.final_score);
        setSummary(result.summary);
        setInterviewComplete(true);
        onInterviewComplete(result.final_score, result.summary);
      } else {
        setCurrentQ(result.next_question);
        setTimeRemaining(result.next_question.time_limit);
        setAnswers(prev => [...prev, { question: currentQ, answer, timeTaken }]);
      }
    }
    
    setIsAnswering(false);
  };

  const startRecording = () => {
    if (!isSupported || !recognitionRef.current) return;
    
    setIsRecording(true);
    setRecordingTime(0);
    setTranscript('');
    
    recognitionRef.current.start();
    
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    
    setIsRecording(false);
  };

  const handleSubmit = async () => {
    if (isAnswering) return;
    
    const answer = textAnswer || transcript;
    if (!answer.trim()) return;
    
    setIsAnswering(true);
    const timeTaken = currentQ.time_limit - timeRemaining;
    
    const result = await submitAnswer(currentQ.id, answer, timeTaken);
    
    if (result) {
      if (result.interview_complete) {
        setFinalScore(result.final_score);
        setSummary(result.summary);
        setInterviewComplete(true);
        onInterviewComplete(result.final_score, result.summary);
      } else {
        setCurrentQ(result.next_question);
        setTimeRemaining(result.next_question.time_limit);
        setAnswers(prev => [...prev, { question: currentQ, answer, timeTaken }]);
      }
    }
    
    setIsAnswering(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#64748b';
    }
  };

  const handleStartInterview = () => {
    onStartInterview();
  };

  if (interviewComplete) {
    return (
      <InterviewComplete
        finalScore={finalScore}
        summary={summary}
        candidateName="Candidate"
        onStartOver={() => window.location.reload()}
      />
    );
  }

  if (!interviewStarted) {
    return (
      <motion.div 
        className="interview-start"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="start-content">
          <h2>Ready to Start Your Interview?</h2>
          <p>You'll be asked 6 questions covering React and Node.js concepts</p>
          <div className="interview-info">
            <div className="info-item">
              <span className="label">Questions:</span>
              <span className="value">6 total (2 Easy, 2 Medium, 2 Hard)</span>
            </div>
            <div className="info-item">
              <span className="label">Time Limits:</span>
              <span className="value">Easy: 20s, Medium: 60s, Hard: 120s</span>
            </div>
            <div className="info-item">
              <span className="label">Format:</span>
              <span className="value">Text and Voice input supported</span>
            </div>
          </div>
          <motion.button
            className="btn btn-primary start-button"
            onClick={handleStartInterview}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? <div className="spinner" /> : 'Start Interview'}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!currentQ) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading question...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="chat-interface"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Compact Header */}
      <div className="compact-header">
        <div className="progress-info">
          <span className="question-counter">Question {currentQ.number} of 6</span>
        </div>
        <div className="timer-compact">
          <div className="timer-circle">
            <svg className="timer-svg" viewBox="0 0 100 100">
              <circle
                className="timer-bg"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              <circle
                className="timer-progress"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={timeRemaining <= 10 ? '#ef4444' : '#10b981'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeRemaining / currentQ.time_limit)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="timer-text">
              <span className="time-value">{formatTime(timeRemaining)}</span>
              <span className="time-label">remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="main-content-card">
        {/* Question Section */}
        <div className="question-section">
          <div className="question-text">
            <h3>{currentQ.text}</h3>
            <div className="difficulty-badge-small" style={{ backgroundColor: getDifficultyColor(currentQ.difficulty) }}>
              {currentQ.difficulty.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Answer Section */}
        <div className="answer-section">
          <div className="answer-header">
            <h4>Your Answer</h4>
            <div className="input-mode-toggle">
              <button
                className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
                onClick={() => setInputMode('text')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7V4h16v3M9 20h6M12 4v16" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Text
              </button>
              <button
                className={`mode-btn ${inputMode === 'voice' ? 'active' : ''}`}
                onClick={() => setInputMode('voice')}
                disabled={!isSupported}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Voice
              </button>
            </div>
          </div>

          {inputMode === 'text' ? (
            <div className="text-input-container">
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="answer-textarea"
                rows={6}
                disabled={isAnswering || timeRemaining === 0}
              />
            </div>
          ) : (
            <div className="voice-input-container">
              <div className="voice-controls">
                <button
                  className={`voice-btn ${isRecording ? 'recording' : ''}`}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isAnswering || timeRemaining === 0 || !isSupported}
                >
                  {isRecording ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
                {isRecording && (
                  <div className="recording-status">
                    <span className="recording-time">{formatTime(recordingTime)}</span>
                    <div className="pulse-dot" />
                  </div>
                )}
              </div>
              <div className="transcript-area">
                {transcript ? (
                  <p>{transcript}</p>
                ) : (
                  <p className="placeholder">
                    {isSupported ? "Click the microphone to start recording" : "Voice input not supported"}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="submit-section">
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={isAnswering || timeRemaining === 0 || (!textAnswer.trim() && !transcript.trim())}
            >
              {isAnswering ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  Submit Answer
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          className="error-message"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatInterface;
