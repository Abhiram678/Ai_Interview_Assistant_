import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Upload, 
  Clock, 
  BarChart3, 
  Users, 
  MessageCircle, 
  CheckCircle,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react';
import './HomePage.css';

const HomePage = ({ onGetStarted }) => {
  const features = [
    {
      icon: Upload,
      title: "Smart Resume Upload",
      description: "Upload PDF or DOCX resumes with automatic field extraction and validation."
    },
    {
      icon: Brain,
      title: "AI-Powered Questions",
      description: "Dynamic question generation for React/Node.js roles with intelligent scoring."
    },
    {
      icon: Clock,
      title: "Timed Interviews",
      description: "Structured timing: Easy (20s), Medium (60s), Hard (120s) with auto-submission."
    },
    {
      icon: MessageCircle,
      title: "Voice & Text Input",
      description: "Flexible answer input with speech recognition and text typing support."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Live dashboard with candidate scores, summaries, and performance insights."
    },
    {
      icon: Users,
      title: "Dual Interface",
      description: "Synchronized views for candidates and interviewers with seamless updates."
    }
  ];

  const stats = [
    { number: "6", label: "Questions per Interview" },
    { number: "3", label: "Difficulty Levels" },
    { number: "100%", label: "AI-Powered" },
    { number: "24/7", label: "Available" }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-badge">
              <Zap size={16} />
              <span>AI-Powered Interview Platform</span>
            </div>
            
            <h1 className="hero-title">
              Revolutionize Your
              <span className="gradient-text"> Hiring Process</span>
            </h1>
            
            <p className="hero-description">
              Experience the future of technical interviews with our AI-powered platform. 
              Conduct structured interviews, get instant feedback, and make data-driven hiring decisions.
            </p>
            
            <div className="hero-actions">
              <motion.button
                className="btn btn-primary hero-btn"
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Interview
                <ArrowRight size={20} />
              </motion.button>
              
              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Dashboard
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-card">
              <div className="card-header">
                <div className="card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="card-title">Interview in Progress</div>
              </div>
              <div className="card-content">
                <div className="question-preview">
                  <div className="question-text">
                    "How would you implement state management in a large React application?"
                  </div>
                  <div className="difficulty-badge medium">Medium</div>
                </div>
                <div className="timer-preview">
                  <Clock size={16} />
                  <span>00:45</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <motion.div 
            className="features-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="features-title">
              Everything You Need for
              <span className="gradient-text"> Next-Level Interviews</span>
            </h2>
            <p className="features-description">
              Our comprehensive platform provides all the tools you need to conduct 
              professional, efficient, and insightful technical interviews.
            </p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="feature-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="feature-icon">
                    <Icon size={24} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="cta-title">Ready to Transform Your Hiring?</h2>
            <p className="cta-description">
              Join thousands of companies using AI-powered interviews to find the best talent.
            </p>
            <motion.button
              className="btn btn-primary cta-btn"
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
