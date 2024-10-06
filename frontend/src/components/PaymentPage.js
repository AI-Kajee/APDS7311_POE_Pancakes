import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css'; // Ensure this path is correct

const PaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ZAR'); // Default currency
  const [provider, setProvider] = useState('SWIFT'); // Default provider
  const [accountHolder, setAccountHolder] = useState(''); // Account holder name
  const [accountNumber, setAccountNumber] = useState(''); // Account number
  const [reference, setReference] = useState(''); // Reference
  const [swiftCode, setSwiftCode] = useState('');

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Check for JWT token and redirect to login if missing
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // If no token, redirect to login
    }
  }, [navigate]);

  const validateForm = () => {
    let newErrors = {};
    if (!amount) {
      newErrors.amount = "Amount is required.";
    }
    if (!accountHolder) {
      newErrors.accountHolder = "Account holder name is required.";
    }
    if (!accountNumber) {
      newErrors.accountNumber = "Account number is required.";
    }
    if (!reference) {
      newErrors.reference = "Reference is required.";
    }
    if (!swiftCode) {
      newErrors.swiftCode = "SWIFT code is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const paymentData = {
      amount,
      currency,
      provider,
      accountHolder,
      accountNumber,
      reference,
      swiftCode,
    };

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://localhost:3001/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Payment details saved successfully');
        // Handle successful payment submission here
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        console.error('Failed to save payment details:', data.message);
      }
    } catch (error) {
      console.error('Error during payment submission:', error);
    }
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
            {errors.amount && <p className="error">{errors.amount}</p>}

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
            </select>

            <label htmlFor="provider">Payment Provider:</label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              required
            >
              <option value="SWIFT">SWIFT</option>
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
            {errors.accountHolder && <p className="error">{errors.accountHolder}</p>}

            <label htmlFor="accountNumber">Account Number:</label>
            <input
              type="text"
              id="accountNumber"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
            {errors.accountNumber && <p className="error">{errors.accountNumber}</p>}

            <label htmlFor="reference">Reference:</label>
            <input
              type="text"
              id="reference"
              placeholder="Enter reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
            />
            {errors.reference && <p className="error">{errors.reference}</p>}

            <label htmlFor="swiftCode">SWIFT Code:</label>
            <input
              type="text"
              id="swiftCode"
              placeholder="Enter SWIFT code"
              value={swiftCode}
              onChange={(e) => setSwiftCode(e.target.value)}
              required
            />
            {errors.swiftCode && <p className="error">{errors.swiftCode}</p>}
          </div>
        </div>
        <button type="submit" className="payment-button">Pay Now</button>
      </form>
    </div>
  );
};

export default PaymentPage;
