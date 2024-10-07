import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './viewPayments.css';

const ViewPayments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }
      
        try {
          const response = await fetch('https://localhost:3001/user/viewPayments', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            const errorData = await response.text(); // Get the raw response for debugging
            console.error('Error fetching payments:', errorData); // Log the response text for debugging
            throw new Error(`HTTP error! status: ${response.status}`); // Simplified error message
          }
      
          const data = await response.json();
          setPayments(data); // Assume the server responds with a list of payments
        } catch (error) {
          console.error('Error fetching payments:', error);
          setError('Failed to load payment data. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      

    fetchPayments();
  }, [navigate]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="view-payments-container">
      <h2>Your Payments</h2>
      <div className="payment-list">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div key={payment._id} className="payment-item">
              <div className="payment-details">
                <label>Amount:</label> 
                <span>{payment.amount}</span>
              </div>
              <div className="payment-details">
                <label>Currency:</label> 
                <span>{payment.currency}</span>
              </div>
              <div className="payment-details">
                <label>Provider:</label> 
                <span>{payment.provider}</span>
              </div>
              <div className="payment-details">
                <label>Account Holder:</label> 
                <span>{payment.accountHolder}</span>
              </div>
              <div className="payment-details">
                <label>Account Number:</label> 
                <span>{payment.accountNumber}</span>
              </div>
              <div className="payment-details">
                <label>Reference:</label> 
                <span>{payment.reference}</span>
              </div>
              <div className="payment-details">
                <label>SWIFT Code:</label> 
                <span>{payment.swiftCode}</span>
              </div>
            </div>
          ))
        ) : (
          <div>No payments found</div>
        )}
      </div>
    </div>
  );
};

export default ViewPayments;
