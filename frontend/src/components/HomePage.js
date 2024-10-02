import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <h1>Atlas Trust</h1>
      <h3>Financial Confidence, Wherever You Go</h3>
      
      <div className="button-group">
        <div className="register-section">
          <p>Become a member today, click to register</p>
          <Link to="/register" className="btn btn-primary">Register</Link>
        </div>
        <div className="login-section">
          <p className="login-text">Already a member? Click to Login</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
