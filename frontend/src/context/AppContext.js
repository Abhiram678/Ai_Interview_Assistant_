import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import io from 'socket.io-client';

const AppContext = createContext();

// Initial state
const initialState = {
  candidates: [],
  currentInterview: null,
  currentQuestion: null,
  interviewProgress: 0,
  isConnected: false,
  loading: false,
  error: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CANDIDATES: 'SET_CANDIDATES',
  SET_CURRENT_INTERVIEW: 'SET_CURRENT_INTERVIEW',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  UPDATE_INTERVIEW_PROGRESS: 'UPDATE_INTERVIEW_PROGRESS',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_CANDIDATES:
      return { ...state, candidates: action.payload };
    
    case actionTypes.SET_CURRENT_INTERVIEW:
      return { ...state, currentInterview: action.payload };
    
    case actionTypes.SET_CURRENT_QUESTION:
      return { ...state, currentQuestion: action.payload };
    
    case actionTypes.UPDATE_INTERVIEW_PROGRESS:
      return { ...state, interviewProgress: action.payload };
    
    case actionTypes.SET_CONNECTION_STATUS:
      return { ...state, isConnected: action.payload };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      dispatch({ type: actionTypes.SET_CONNECTION_STATUS, payload: true });
    });

    newSocket.on('disconnect', () => {
      dispatch({ type: actionTypes.SET_CONNECTION_STATUS, payload: false });
    });

    newSocket.on('data_updated', (data) => {
      // Handle real-time updates
      if (data.type === 'candidates_updated') {
        fetchCandidates();
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Actions
  const setLoading = (loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/candidates`);
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: actionTypes.SET_CANDIDATES, payload: data.candidates });
      } else {
        setError(data.error || 'Failed to fetch candidates');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async (candidateData) => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/start-interview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidate: candidateData }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: actionTypes.SET_CURRENT_INTERVIEW, payload: data.interview_id });
        dispatch({ type: actionTypes.SET_CURRENT_QUESTION, payload: data.question });
        return data;
      } else {
        setError(data.error || 'Failed to start interview');
        return null;
      }
    } catch (error) {
      setError('Network error: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (questionId, answer, timeTaken) => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/submit-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_id: questionId,
          answer: answer,
          time_taken: timeTaken
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (data.interview_complete) {
          dispatch({ type: actionTypes.SET_CURRENT_INTERVIEW, payload: null });
          dispatch({ type: actionTypes.SET_CURRENT_QUESTION, payload: null });
          // Refresh candidates list
          fetchCandidates();
        } else {
          dispatch({ type: actionTypes.SET_CURRENT_QUESTION, payload: data.next_question });
        }
        return data;
      } else {
        setError(data.error || 'Failed to submit answer');
        return null;
      }
    } catch (error) {
      setError('Network error: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resumeInterview = async (interviewId) => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/resume-interview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interview_id: interviewId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: actionTypes.SET_CURRENT_INTERVIEW, payload: interviewId });
        dispatch({ type: actionTypes.SET_CURRENT_QUESTION, payload: data.question });
        return data;
      } else {
        setError(data.error || 'Failed to resume interview');
        return null;
      }
    } catch (error) {
      setError('Network error: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getCandidateDetails = async (candidateId) => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/candidate/${candidateId}`);
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        setError(data.error || 'Failed to fetch candidate details');
        return null;
      }
    } catch (error) {
      setError('Network error: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Sync data between tabs
  const syncData = (type, data) => {
    if (socket && socket.connected) {
      socket.emit('sync_data', { type, data });
    }
  };

  const value = {
    ...state,
    socket,
    setLoading,
    setError,
    clearError,
    fetchCandidates,
    startInterview,
    submitAnswer,
    resumeInterview,
    getCandidateDetails,
    syncData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
