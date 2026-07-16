import React from 'react';
import './SearchBox.css';

const SearchBox = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="search-box">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <i className="search-icon">🔍</i>
    </div>
  );
};

export default SearchBox;