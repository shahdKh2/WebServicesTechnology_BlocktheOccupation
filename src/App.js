import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
    fetchCategories();
  }, [offset]);

  // Fetch companies with dynamic offset
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://api.boycottisraeli.biz/v1/companies?offset=${offset}`);
      setCompanies(prevCompanies => [...prevCompanies, ...res.data.data]);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
    setLoading(false);
  };

  // Fetch categories
  const fetchCategories = async () => {
    const res = await axios.get('https://api.boycottisraeli.biz/v1/categories?limit=4&offset=2');
    setCategories(res.data.data);
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://api.boycottisraeli.biz/v1/search/${encodeURIComponent(search)}`);
      setSearchResults(res.data.data);
    } catch (error) {
      console.error("Search failed:", error.message);
      setSearchResults([]);
    }
  };
  

  // Load more companies
  const loadMore = () => {
    setOffset(prevOffset => prevOffset + 4);
  };

  // Check if company is boycotted
  const checkBoycotted = (type) => {
    return type === 'supports-israel' ? 'Boycotted' : 'Not Boycotted';
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="header-title">🛑 Block the Occupation</h1>
        <p className="header-subtitle">Discover and avoid companies that support oppression</p>
      </header>

      <section className="content">
        <div className="search-bar">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search boycott reason (e.g., food, beverage)"
            className="search-input"
          />
          <button
            onClick={handleSearch}
            className="search-button"
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="results">
            <h2 className="section-title">🔍 Search Results</h2>
            <div className="cards-grid">
              {searchResults.map((company) => (
                <div key={company.slug} className="company-card">
                  <img
                    src={company.logo?.url}
                    alt={`${company.name} logo`}
                    className="company-logo"
                  />
                  <h3 className="company-name">{company.name}</h3>
                  <p className="company-description">{company.description}</p>
                  <p className="company-boycotted">{checkBoycotted(company.type)}</p>
                  <a href={company.website} target="_blank" rel="noreferrer" className="company-link">Visit Website</a>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="section-title">🔥 All Companies</h2>
        <div className="cards-grid">
          {companies.map((company) => (
            <div key={company.slug} className="company-card">
              <img
                src={company.logo?.url}
                alt={`${company.name} logo`}
                className="company-logo"
              />
              <h3 className="company-name">{company.name}</h3>
              <p className="company-description">{company.description}</p>
              <p className="company-boycotted">{checkBoycotted(company.type)}</p>
              <a href={company.website} target="_blank" rel="noreferrer" className="company-link">Visit Website</a>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <button
            onClick={loadMore}
            className="load-more-button"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}

        <h2 className="section-title">📂 Categories</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.slug} className="category-card">
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-description">{cat.description || 'No description available'}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>Powered by <a href="https://boycottisraeli.biz" target="_blank" rel="noreferrer" className="footer-link">Boycott API</a></p>
      </footer>
    </div>
  );
}
