import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import CandidateList from '../components/CandidateList';
import CandidateTable from '../components/CandidateTable';
import CandidateDetails from '../components/CandidateDetails';
import SearchBar from '../components/SearchBar';
import './InterviewerPage.css';

const InterviewerPage = () => {
  const { 
    candidates, 
    loading, 
    error, 
    fetchCandidates, 
    getCandidateDetails,
    clearError 
  } = useApp();

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score'); // score, name, date
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, cards

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleCandidateSelect = async (candidate) => {
    setSelectedCandidate(candidate);
    setLoadingDetails(true);
    
    try {
      const details = await getCandidateDetails(candidate.id);
      if (details) {
        setCandidateDetails(details);
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBackToList = () => {
    setSelectedCandidate(null);
    setCandidateDetails(null);
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'score':
        aValue = a.final_score || 0;
        bValue = b.final_score || 0;
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'date':
        aValue = new Date(a.completed_at || 0);
        bValue = new Date(b.completed_at || 0);
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="interviewer-page">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Interview Dashboard</h1>
        <p>Manage and review candidate interviews</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedCandidate ? (
          <motion.div
            key="candidate-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="dashboard-controls">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search candidates..."
              />
              
              <div className="view-controls">
                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                  >
                    Table
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                    onClick={() => setViewMode('cards')}
                  >
                    Cards
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'table' ? (
              <CandidateTable
                candidates={sortedCandidates}
                onViewDetails={handleCandidateSelect}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                loading={loading}
                error={error}
              />
            ) : (
              <CandidateList
                candidates={sortedCandidates}
                onCandidateSelect={handleCandidateSelect}
                loading={loading}
                error={error}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="candidate-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CandidateDetails
              candidate={selectedCandidate}
              interview={candidateDetails?.interview}
              onBack={handleBackToList}
              loading={loadingDetails}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewerPage;
