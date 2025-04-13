import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(null);
  const [popupTitle, setPopupTitle] = useState("");

  useEffect(() => {
    fetchCompanies();
    fetchCategories();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.boycottisraeli.biz/v1/companies`
      );
      setCompanies(res.data.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `https://api.boycottisraeli.biz/v1/categories`
      );
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCompaniesByCategory = async (slug) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.boycottisraeli.biz/v1/categories/${slug}/companies`
      );
      setSearchResults(res.data.data);
      setSelectedCategory(slug);
      setHasSearched(false);
    } catch (error) {
      console.error("Error fetching companies by category:", error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setHasSearched(true);
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.boycottisraeli.biz/v1/search/${encodeURIComponent(search)}`
      );
      const filteredByName = res.data.data.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
      setSearchResults(filteredByName);
      setSelectedCategory("");
    } catch (error) {
      console.error("Search failed:", error.message);
      setSearchResults([]);
    }
    setLoading(false);
  };

  const openAlternativesPopup = (company) => {
    setPopupTitle(company.name);
    setShowAlternatives(company.alternatives);
  };

  const closePopup = () => {
    setShowAlternatives(null);
    setPopupTitle("");
  };

  const renderCompanyCard = (company) => (
    <div key={company.slug} className="company-card">
      <img
        src={company.logo?.url}
        alt={`${company.name} logo`}
        className="company-logo"
      />
      <h3 className="company-name">{company.name}</h3>
      <p className="company-description">{company.description}</p>

      <p
        className={`company-boycotted ${
          company.type === "supports-israel" || "israeli"
            ? "boycotted-red"
            : "boycotted-green"
        }`}
      >
        {company.type === "supports-israel" || "israeli"
          ? "🚫 Boycotted"
          : "✅ Not Boycotted"}
      </p>
      {company.website && (
        <a
          href={company.website}
          target="_blank"
          rel="noreferrer"
          className="company-link"
        >
          Visit Website
        </a>
      )}
      {company.alternatives?.length > 0 && (
        <button
          className="alternatives-button"
          onClick={() => openAlternativesPopup(company)}
        >
          💡 Show Alternatives
        </button>
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
          &nbsp;&nbsp;&nbsp;&nbsp;Discover and avoid companies that support
          oppression
        </p>
      </header>

      <section className="content">
        <div className="sidebar">
          <h2>Categories</h2>
          <div className="categories-list">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                className={`category-btn ${
                  selectedCategory === cat.slug ? "selected" : ""
                }`}
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

          {hasSearched && searchResults.length === 0 && !loading && (
            <div className="no-results-message">
              ❌ Company or product not found.
            </div>
          )}

          {searchResults.length > 0 && (
            <>
              <h2 className="section-title"> Results</h2>
              <div className="cards-grid">
                {searchResults.map(renderCompanyCard)}
              </div>
            </>
          )}

          {!search && !hasSearched && (
            <>
              <h2 className="section-title">All Companies</h2>
              {loading ? (
                <div className="loading-indicator">Loading...</div>
              ) : (
                <div className="cards-grid">
                  {companies.map(renderCompanyCard)}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {showAlternatives && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button className="close-btn" onClick={closePopup}>
              ✖
            </button>
            <h2> Alternatives for {popupTitle}</h2>
            <div className="alternatives-list">
              {showAlternatives.map((alt) => (
                <div key={alt.id} className="alternative-card">
                  <img
                    src={alt.logo?.url}
                    alt={alt.name}
                    className="alt-logo"
                  />
                  <h4>{alt.name}</h4>
                  <p>{alt.description}</p>
                  {alt.website && (
                    <a
                      className="company-link"
                      href={alt.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>
          Powered by{" "}
          <a
            href="https://boycottisraeli.biz"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            Boycott API
          </a>
        </p>
      </footer>
    </div>
  );
}
