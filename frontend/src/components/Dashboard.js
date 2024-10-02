import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Welcome Bob</h1>
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
