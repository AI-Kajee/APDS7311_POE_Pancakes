import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';
import { jwtDecode } from 'jwt-decode';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = process.env.REACT_APP_GEMINI_API_URL;

const PaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ZAR');
  const [provider, setProvider] = useState('SWIFT');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [reference, setReference] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const getConversionFromGemini = async (amount, fromCurrency, toCurrency) => {
    const prompt = `Convert ${amount} ${fromCurrency} to ${toCurrency}. Please provide only the numerical result without any currency symbols or additional text.`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get conversion from Gemini');
      }

      const data = await response.json();
      const result = data.candidates[0].content.parts[0].text;
      const numericResult = parseFloat(result.replace(/[^\d.-]/g, ''));

      if (isNaN(numericResult)) {
        throw new Error('Failed to parse conversion result');
      }

      return numericResult.toFixed(2);
    } catch (error) {
      console.error('Conversion error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const validateToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }
  
      try {
        const decodedToken = jwtDecode(token);
        // Verify the role from the token (e.g., only users should access the payment page)
        if (decodedToken.userRole !== 'user') {
          navigate('/empdashboard');
        } else {
          // If the token is valid and role is correct, proceed
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    };
  
    validateToken();
  }, [navigate]);

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

  const handleConvert = async () => {
    if (currency !== 'ZAR') {
      setIsConverting(true);
      try {
        const convertedAmount = await getConversionFromGemini(amount, 'ZAR', currency);
        setAmount(convertedAmount);
      } catch (error) {
        console.error('Error during currency conversion:', error);
        setSubmitError('Currency conversion failed. Please try again.');
      } finally {
        setIsConverting(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setSubmitError('Session expired. Please log in again.');
      navigate('/login');
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
      const response = await fetch('https://localhost:3001/user/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        console.log('Payment details saved successfully');
        navigate('/viewpayment');
      } else {
        if (response.status === 401 || data.message === 'token invalid') {
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
            <div className="convert-container">
              <input
                type="number"
                id="amount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <button
                type="button"
                className="convert-button"
                onClick={handleConvert}
                disabled={isConverting}
              >
                Convert
              </button>
            </div>
            {errors.amount && <p className="error">{errors.amount}</p>}
            {isConverting && <p className="converting">Converting...</p>}

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

        <button type="submit" className="submit-button">Submit Payment</button>
      </form>
    </div>
  );
};

export default PaymentPage;
