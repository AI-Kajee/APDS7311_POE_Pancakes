import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const PaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ZAR');
  const [provider, setProvider] = useState('SWIFT');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [reference, setReference] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const validateTokenAndFetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        await fetchPaymentDetails(token);
      } catch (error) {
        if (error.message === 'token invalid') {
          console.log('Invalid token, redirecting to login');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error('Error during data fetch:', error);
          setSubmitError('Failed to load payment details. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    validateTokenAndFetchData();
  }, [navigate]);

  const fetchPaymentDetails = async (token) => {
    const response = await fetch('https://localhost:3001/user/pay', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch payment details');
    }

    setAmount(data.amount || '');
    setCurrency(data.currency || 'ZAR');
    setProvider(data.provider || 'SWIFT');
    setAccountHolder(data.accountHolder || '');
    setAccountNumber(data.accountNumber || '');
    setReference(data.reference || '');
    setSwiftCode(data.swiftCode || '');
    
    return data;
  };

  const validateForm = () => {
    let newErrors = {};
    if (!amount) newErrors.amount = "Amount is required.";
    if (!accountHolder) newErrors.accountHolder = "Account holder name is required.";
    if (!accountNumber) newErrors.accountNumber = "Account number is required.";
    if (!reference) newErrors.reference = "Reference is required.";
    if (!swiftCode) newErrors.swiftCode = "SWIFT code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

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
      const token = localStorage.getItem('token');
      if (!token) {
        setSubmitError('Session expired. Please log in again.');
        navigate('/login');
        return;
      }

      console.log('Sending payment data:', paymentData);

      const response = await fetch('https://localhost:3001/user/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        console.log('Payment details saved successfully');
        navigate('/dashboard');
      } else {
        if (data.message === 'token invalid') {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setSubmitError(data.message || 'Failed to process payment. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during payment submission:', error);
      setSubmitError('An error occurred. Please try again later.');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="payment-container">
      <h2>Payment Page</h2>
      {submitError && <div className="error-message">{submitError}</div>}
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