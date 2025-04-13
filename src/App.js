import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
    fetchCategories();
  }, [offset]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://api.boycottisraeli.biz/v1/companies`);
      setCompanies(prev => [...prev, ...res.data.data]);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://api.boycottisraeli.biz/v1/categories');
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCompaniesByCategory = async (slug) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://api.boycottisraeli.biz/v1/categories/${slug}/companies`);
      setSearchResults(res.data.data);
      setSelectedCategory(slug);
    } catch (error) {
      console.error("Error fetching companies by category:", error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const res = await axios.get(`https://api.boycottisraeli.biz/v1/search/${encodeURIComponent(search)}`);
      const filteredByName = res.data.data.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
      setSearchResults(filteredByName);
      setSelectedCategory('');
    } catch (error) {
      console.error("Search failed:", error.message);
      setSearchResults([]);
    }
  };

  const loadMore = () => setOffset(prev => prev + 4);

  const checkBoycotted = (type) => type === 'supports-israel' ? '🚫Boycotted' : '✅Not Boycotted';

  const renderCompanyCard = (company) => (
    <div key={company.slug} className="company-card">
      <img
        src={company.logo?.url}
        alt={`${company.name} logo`}
        className="company-logo"
      />
      <h3 className="company-name">{company.name}</h3>
      <p className="company-description">{company.description}</p>
      <p className="company-boycotted">{checkBoycotted(company.type)}</p>
      {company.website && (
        <a href={company.website} target="_blank" rel="noreferrer" className="company-link">
          Visit Website
        </a>
      )}
     
    </div>
  );

  return (
    <div className="app-container">
       <header className="header">
        <div className="header-container">
          <div className="logo-container">
            <img src="/logo.png" alt="Logo" className="logo" />
          </div>
          <div className="title-container">
            <h1 className="header-title">Block the Occupation</h1>
          </div>
        </div>
        <p className="header-subtitle">
             Discover and avoid companies that support oppression
        </p>
      </header>


      <section className="content">
        <div className="sidebar">
          <h2> Categories</h2>
          <div className="categories-list">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                className={`category-btn ${selectedCategory === cat.slug ? 'selected' : ''}`}
                onClick={() => fetchCompaniesByCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="main-content">
          <div className="search-bar">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company name"
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>

          {searchResults.length > 0 && (
            <>
              <h2 className="section-title">🔍 Results</h2>
              <div className="cards-grid">
                {searchResults.map(renderCompanyCard)}
              </div>
            </>
          )}

          {!searchResults.length && (
            <>
              <h2 className="section-title"> All Companies</h2>
              <div className="cards-grid">
                {companies.map(renderCompanyCard)}
              </div>
              {loading ? (
                <div className="loading-indicator">Loading...</div>
              ) : (
                <button onClick={loadMore} className="load-more-button">
                  Load More
                </button>
              )}
            </>
          )}
        </div>
      </section>
      <footer className="footer">
        <p>Powered by <a href="https://boycottisraeli.biz" target="_blank" rel="noreferrer" className="footer-link">Boycott API</a></p>
      </footer>
    </div>
  );
}