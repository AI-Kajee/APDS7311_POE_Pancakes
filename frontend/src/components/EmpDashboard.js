import React, { useEffect, useState } from 'react';
import './EmpDashboard.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Dashboard() {
  const [fullName, setFullName] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.userRole);

        if (decodedToken.userRole === 'employee') {
          fetch('http://localhost:3001/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
            .then((response) => {
              if (response.status === 401) {
                navigate('/login');
                throw new Error('Unauthorized');
              }
              return response.json();
            })
            .then((data) => {
              setFullName(data.fullName);
            })
            .catch((error) => {
              console.error('Error fetching profile:', error);
            });
        } else {
          // If user role is 'employee', redirect to User Dashboard component or route
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear the token
    localStorage.removeItem('token');
    // Redirect to the login page
    navigate('/login');
  };

  const handleRedirectToViewPayments = () => {
    navigate('/viewpayment'); // Redirect to the viewPayments page
  };

  const handleRedirectToPayments = () => {
    navigate('/payment'); // Redirect to the viewPayments page
  };

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Welcome {fullName}</h1> {/* Use fullName from state */}
      </div>

      <div className="info-section">
        <div className="info-card">
          <h2 className="dashboard-subtitle">Approve Payments</h2>
          <p>Click here to approve or deny pending payments</p>
          <button onClick={handleRedirectToPayments}>Payment Portal</button> {/* Button to redirect to viewPayments */}
        </div>
        <div className="info-card">
          <h2 className="dashboard-subtitle">Payment History</h2>
          <p>View all approved/denied payments.</p>
          <button onClick={handleRedirectToViewPayments}>View Payments</button> {/* New button for redirecting to viewPayments */}
        </div>
        <div className="info-card">
          <h2 className="dashboard-subtitle">Logout?</h2>
          <p>Thank you for your service.</p>
          <button onClick={handleLogout}>Logout</button> {/* Add onClick to handleLogout */}
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
