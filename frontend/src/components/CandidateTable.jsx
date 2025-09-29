import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  Eye,
  ChevronUp,
  ChevronDown,
  Filter,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './CandidateTable.css';

const CandidateTable = ({ candidates, onViewDetails, sortBy, sortOrder, onSort }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterScore, setFilterScore] = useState('all');
  const getScoreColor = (score) => {
    if (score >= 7) return '#10b981'; // Green
    if (score >= 5) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 7) return 'EXCELLENT';
    if (score >= 5) return 'GOOD';
    return 'NEEDS IMPROVEMENT';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not completed';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      onSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'desc');
    }
  };

  // Filter candidates based on status and score
  const filteredCandidates = candidates.filter(candidate => {
    const statusMatch = filterStatus === 'all' || candidate.status === filterStatus;
    const score = candidate.final_score || candidate.score || 0;
    let scoreMatch = true;
    
    if (filterScore === 'excellent') scoreMatch = score >= 7;
    else if (filterScore === 'good') scoreMatch = score >= 5 && score < 7;
    else if (filterScore === 'needs_improvement') scoreMatch = score < 5;
    
    return statusMatch && scoreMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterScore('all');
    setCurrentPage(1);
  };

  const SortButton = ({ field, children }) => (
    <button
      className="sort-button"
      onClick={() => handleSort(field)}
    >
      {children}
      <div className="sort-icons">
        <ChevronUp 
          size={12} 
          className={sortBy === field && sortOrder === 'asc' ? 'active' : ''} 
        />
        <ChevronDown 
          size={12} 
          className={sortBy === field && sortOrder === 'desc' ? 'active' : ''} 
        />
      </div>
    </button>
  );

  return (
    <div className="candidate-table-container">
      <div className="table-header">
        <h3>Candidates ({filteredCandidates.length})</h3>
        <div className="table-actions">
          <button 
            className={`filter-button ${showFilter ? 'active' : ''}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Filter Dropdown */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            className="filter-dropdown"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filter-content">
              <div className="filter-section">
                <label>Status:</label>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>
              
              <div className="filter-section">
                <label>Score:</label>
                <select 
                  value={filterScore} 
                  onChange={(e) => setFilterScore(e.target.value)}
                >
                  <option value="all">All Scores</option>
                  <option value="excellent">Excellent (7+)</option>
                  <option value="good">Good (5-6.9)</option>
                  <option value="needs_improvement">Needs Improvement (&lt;5)</option>
                </select>
              </div>
              
              <div className="filter-actions">
                <button className="clear-filters-btn" onClick={clearFilters}>
                  <X size={14} />
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="table-wrapper">
        <table className="candidate-table">
          <thead>
            <tr>
              <th>#</th>
              <th>
                <SortButton field="name">Candidate</SortButton>
              </th>
              <th>
                <SortButton field="score">Score</SortButton>
              </th>
              <th>
                <SortButton field="status">Interview Status</SortButton>
              </th>
              <th>
                <SortButton field="date">Completed At</SortButton>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCandidates.map((candidate, index) => (
              <motion.tr
                key={candidate.id}
                className="candidate-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ backgroundColor: '#f8fafc' }}
              >
                <td className="seq-cell">
                  <div className="seq-number">{startIndex + index + 1}</div>
                </td>
                <td className="candidate-info-cell">
                  <div className="candidate-basic-info">
                    <div className="candidate-avatar">
                      <User size={16} />
                    </div>
                    <div className="candidate-details">
                      <div className="candidate-name">{candidate.name}</div>
                      <div className="candidate-email">{candidate.email}</div>
                    </div>
                  </div>
                </td>
                
                <td className="score-cell">
                  <div className="score-display">
                    <div 
                      className="score-value"
                      style={{ color: getScoreColor(candidate.final_score || candidate.score) }}
                    >
                      {candidate.final_score || candidate.score || 0}/10
                    </div>
                    <div 
                      className="score-label"
                      style={{ color: getScoreColor(candidate.final_score || candidate.score) }}
                    >
                      {getScoreLabel(candidate.final_score || candidate.score || 0)}
                    </div>
                  </div>
                </td>
                
                <td className="status-cell">
                  <div className={`status-badge ${candidate.status}`}>
                    <Star size={12} />
                    <span>{candidate.status}</span>
                  </div>
                </td>
                
                <td className="date-cell">
                  <div className="date-info">
                    <Calendar size={14} />
                    <span>{formatDate(candidate.completed_at || candidate.interview_date)}</span>
                  </div>
                </td>
                
                <td className="actions-cell">
                  <button
                    className="view-details-btn"
                    onClick={() => onViewDetails(candidate)}
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {currentCandidates.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <User size={48} />
          </div>
          <h3>No candidates found</h3>
          <p>Start by conducting interviews to see candidates here.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length} candidates
          </div>
          
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="pagination-summary">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateTable;
