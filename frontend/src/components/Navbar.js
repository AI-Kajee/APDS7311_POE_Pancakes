import React, { useContext  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Navbar.css'; // Importing the custom CSS file
import logo from './apds_logo.png'; // Import your logo (adjust path as necessary)

function CustomNavbar() {
  const { isLoggedIn, userRole, logout } = useContext(AuthContext); // Access Auth context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

          {/* Conditionally render links based on user role */}
          {userRole === 'user' && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/payment">Payment Page</Link>
              <Link to="/viewpayment">Payment History</Link>
            </>
          )}

          {userRole === 'employee' && (
            <>
              <Link to="/empdashboard">Employee Dashboard</Link>
              <Link to="/paymentportal">Payment Portal</Link>
              <Link to="/paymenthistory">Payment History</Link>
            </>
          )}

          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
      <div className="navbar-right">
        {/* Conditionally render register/login based on whether the user is logged in */}
        {!isLoggedIn ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default CustomNavbar;
