import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
    <div className="navbar-inner">
      <div className="logo">EduLearn</div>
  
      <div className="nav-right">
        <ul className="nav-links">
          <li><Link to="/">Acasă</Link></li>
          <li>
            <Link
              to={
                JSON.parse(localStorage.getItem('user'))?.role === 'professor'
                  ? '/professor-dashboard'
                  : '/courses'
              }
              className="nav-button-link"
            >
              Cursuri
            </Link>
          </li>
          <li><Link to="/contact">Contact</Link></li>
          {user ? (
            <li>
              <Link
                to="/login"
                className="nav-button-link"
                onClick={() => {
                  localStorage.clear();
                }}
              >
                Logout
              </Link>
            </li>
          ) : (
            <li><Link to="/login">Autentificare</Link></li>
          )}
        </ul>
  
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
              setSearchQuery('');
            }
          }}
          className="search-form"
        >
          <input
            type="text"
            placeholder="Caută curs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">🔍</button>
        </form>
      </div>
    </div>
  </nav>
  
  


  );
}

export default Navbar;
