import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Importing the custom CSS file
import logo from './apds_logo.png'; // Import your logo (adjust path as necessary)

function CustomNavbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <Link to="/">
            <img
              src={logo}
              alt="Atlas Trust Logo"
              className="logo"
            />
          </Link>
          <span className="brand-name">Atlas Trust</span>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/payment">Payment Page</Link>
          <Link to="/viewpayment">Payment History</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
      <div className="navbar-right">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default CustomNavbar;
