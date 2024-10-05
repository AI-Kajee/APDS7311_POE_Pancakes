import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css'; // Ensure this path is correct

const PaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ZAR'); // Default currency
  const [provider, setProvider] = useState('SWIFT'); // Default provider
  const [accountHolder, setAccountHolder] = useState(''); // Account holder name
  //const [bank, setBank] = useState(''); // Bank name
  //const [branchName, setBranchName] = useState(''); // Branch name
  //const [branchCode, setBranchCode] = useState(''); // Branch code
  const [accountNumber, setAccountNumber] = useState(''); // Account number
  const [reference, setReference] = useState(''); // Reference
  const [swiftCode, setSwiftCode] = useState('');

  const navigate = useNavigate();

  // Check for JWT token and redirect to login if missing
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // If no token, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment submission logic here
    console.log({
      amount,
      currency,
      provider,
      accountHolder,
      accountNumber,
      reference,
      swiftCode,
    });
  };

  return (
    <div className="payment-container">
      <h2>Payment Page</h2>
      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="form-content">
          <div className="left-column">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <label htmlFor="currency">Currency:</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            >
              <option value="ZAR">ZAR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              {/* Add more currencies as needed */}
            </select>

            <label htmlFor="provider">Payment Provider:</label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              required
            >
              <option value="SWIFT">SWIFT</option>
              {/* Add more providers if needed */}
            </select>
            
            
          </div>
          <div className="spacer"></div>
          <div className="right-column">
            <label htmlFor="accountHolder">Enter Account Information below:</label>
            <label htmlFor="accountHolder">Account Holder Name:</label>
            <input
              type="text"
              id="accountHolder"
              placeholder="Enter account holder name"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              required
            />

            <label htmlFor="accountNumber">Account Number:</label>
            <input
              type="text"
              id="accountNumber"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
            
            <label htmlFor="reference">Reference:</label>
            <input
              type="text"
              id="reference"
              placeholder="Enter reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
            />
            
            <label htmlFor="swiftCode">SWIFT Code:</label>
            <input
              type="text"
              id="swiftCode"
              placeholder="Enter SWIFT code"
              value={swiftCode}
              onChange={(e) => setSwiftCode(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="payment-button">Pay Now</button>
      </form>
    </div>
  );
};

export default PaymentPage;
