import React, { useState, useEffect } from 'react';
import { companyService } from '../services/companyService';
import useApi from '../hooks/useApi';

const CompanyList = () => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: companies, loading, error, execute: fetchCompanies } = useApi(
    () => companyService.getAllCompanies(page, 10),
    { content: [], totalElements: 0 },
    true
  );

  const handleSearch = async () => {
    try {
      const result = await companyService.searchCompanies(searchTerm);
      // Handle search results
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyService.deleteCompany(id);
        fetchCompanies(); // Refresh the list
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  if (loading) return <div className="loading">Loading companies...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="company-list">
      <h2>Companies</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="companies">
        {companies.content.map((company) => (
          <div key={company.id} className="company-card">
            <h3>{company.companyName}</h3>
            <p>Industry: {company.industry}</p>
            <p>Employees: {company.numberOfEmployees}</p>
            <div className="actions">
              <button onClick={() => {/* Edit functionality */}}>Edit</button>
              <button onClick={() => handleDelete(company.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button 
          disabled={page === 0} 
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button 
          disabled={(page + 1) * 10 >= companies.totalElements}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompanyList;