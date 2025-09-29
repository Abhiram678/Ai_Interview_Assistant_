import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange, placeholder = "Search..." }) => {
  return (
    <motion.div 
      className="search-bar"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="search-input-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
      </div>
    </motion.div>
  );
};

export default SearchBar;
