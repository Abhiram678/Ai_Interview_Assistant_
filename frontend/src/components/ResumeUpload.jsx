import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import './ResumeUpload.css';

const ResumeUpload = ({ onUploadComplete, loading, error }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PDF or DOCX file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onUploadComplete(response.data.data);
      } else {
        setUploadError(response.data.error || 'Failed to process resume');
      }
    } catch (err) {
      setUploadError('Network error: ' + err.message);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  return (
    <motion.div 
      className="resume-upload"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="upload-header">
        <h2>Upload Your Resume</h2>
        <p>Upload your resume to get started with the interview process</p>
      </div>

      <motion.div
        {...getRootProps()}
        className={`upload-area ${isDragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <input {...getInputProps()} />
        
        <div className="upload-content">
          {uploading ? (
            <motion.div
              className="uploading-state"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="spinner" />
            </motion.div>
          ) : (
            <motion.div
              className="upload-icon"
              animate={{ y: isDragActive ? -5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Upload size={48} />
            </motion.div>
          )}
          
          <div className="upload-text">
            {uploading ? (
              <p>Processing your resume...</p>
            ) : isDragActive ? (
              <p>Drop your resume here</p>
            ) : (
              <>
                <p>Drag & drop your resume here</p>
                <span>or click to browse</span>
              </>
            )}
          </div>
          
          <div className="file-types">
            <FileText size={16} />
            <span>PDF, DOCX (max 10MB)</span>
          </div>
        </div>
      </motion.div>

      {(error || uploadError) && (
        <motion.div
          className="error-message"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle size={20} />
          <span>{error || uploadError}</span>
        </motion.div>
      )}

      <div className="upload-tips">
        <h4>Tips for better results:</h4>
        <ul>
          <li>Ensure your resume is clear and readable</li>
          <li>Include your full name, email, and phone number</li>
          <li>Use standard resume formats</li>
          <li>Check that all text is selectable (not scanned images)</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ResumeUpload;
