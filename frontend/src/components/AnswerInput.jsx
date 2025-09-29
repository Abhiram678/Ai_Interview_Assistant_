import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Type, Send, Square } from 'lucide-react';
import './AnswerInput.css';

const AnswerInput = ({ onSubmit, disabled, loading }) => {
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'voice'
  const [textAnswer, setTextAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef(null);
  const recordingIntervalRef = useRef(null);

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

  const handleSubmit = () => {
    const answer = inputMode === 'text' ? textAnswer : transcript;
    if (answer.trim()) {
      onSubmit(answer.trim());
      setTextAnswer('');
      setTranscript('');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="answer-input"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="input-header">
        <h3>Your Answer</h3>
        <div className="input-mode-toggle">
          <motion.button
            className={`mode-button ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => setInputMode('text')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Type size={16} />
            Text
          </motion.button>
          
          <motion.button
            className={`mode-button ${inputMode === 'voice' ? 'active' : ''}`}
            onClick={() => setInputMode('voice')}
            disabled={!isSupported}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic size={16} />
            Voice
          </motion.button>
        </div>
      </div>

      <div className="input-content">
        <AnimatePresence mode="wait">
          {inputMode === 'text' ? (
            <motion.div
              key="text-input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="text-input-container"
            >
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="text-input"
                rows={4}
                disabled={disabled}
              />
            </motion.div>
          ) : (
            <motion.div
              key="voice-input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="voice-input-container"
            >
              <div className="voice-controls">
                <motion.button
                  className={`voice-button ${isRecording ? 'recording' : ''}`}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={disabled || !isSupported}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isRecording ? <Square size={24} /> : <Mic size={24} />}
                </motion.button>
                
                {isRecording && (
                  <motion.div
                    className="recording-indicator"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <div className="pulse-ring" />
                    <span>{formatTime(recordingTime)}</span>
                  </motion.div>
                )}
              </div>
              
              <div className="transcript-display">
                {transcript ? (
                  <p>{transcript}</p>
                ) : (
                  <p className="placeholder">
                    {isSupported 
                      ? "Click the microphone to start recording your answer"
                      : "Voice input not supported in this browser"
                    }
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="input-footer">
        <motion.button
          className="btn btn-primary submit-button"
          onClick={handleSubmit}
          disabled={disabled || loading || (!textAnswer.trim() && !transcript.trim())}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              Submit Answer
              <Send size={16} />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AnswerInput;
