import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentHistory.css';

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
        const response = await fetch('https://localhost:3001/user/viewPendingPayments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error fetching payments:', errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Filter payments to only show those belonging to "Nehal"
        const filteredPayments = data.filter(payment => payment.accountHolder === 'Nehal');
        
        setPayments(filteredPayments);
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
    <div className="payment-history-container">
      <h2>Your Payments</h2>
      {payments.length > 0 ? (
        <table className="history-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Account Holder</th>
              <th>Account Number</th>
              <th>Reference</th>
              <th>SWIFT Code</th>
              <th>Date of Payment</th>
              <th>Status</th> {/* New Status column */}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.amount}</td>
                <td>{payment.currency}</td>
                <td>{payment.provider}</td>
                <td>{payment.accountHolder}</td>
                <td>{payment.accountNumber}</td>
                <td>{payment.reference}</td>
                <td>{payment.swiftCode}</td>
                <td>{payment.date}</td>
                <td>{payment.status}</td> {/* Display status */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No payments found</div>
      )}
    </div>
  );
};

export default ViewPayments;
