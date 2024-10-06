import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    else {

      fetch('http://localhost:3001/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Pass the token if required for auth
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status === 401) {
          navigate('/login');
          throw new Error('Unauthorized'); // Redirect if not authorized
        }
        return response.json(); // Parse JSON response
      })
      .then((data) => {
        // Update state with full name
        setFullName(data.fullName);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <div className="welcome-section">
      <h1>Welcome {fullName}</h1> {/* Use fullName from state */}
      </div>

      <div className="info-section">
        <div className="info-card">
          <h2 className="dashboard-subtitle">What are we?</h2>
          <p>We are an international bank, more details to come later.</p>
        </div>
        <div className="info-card">
          <h2 className="dashboard-subtitle">Enter the Payment Gateway</h2>
          <p>Click here to complete any international payments</p>
          <button>Payment Gateway</button>
        </div>
        <div className="info-card">
          <h2 className="dashboard-subtitle">Logout?</h2>
          <p>Come back soon, we value your company</p>
          <button>Logout</button>
        </div>
      </div>

      <footer>
        <p>support@gmail.com</p>
        <p>Privacy Policy</p>
      </footer>
    </div>
  );
}

export default Dashboard;
