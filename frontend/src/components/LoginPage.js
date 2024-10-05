import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    accountNumber: '',
    password: '',
  });

  const [errors, setErrors] = useState(''); // State to store error messages
  const [loading, setLoading] = useState(false); // To display loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };




  // Client-side validation for login form
  const validateForm = () => {
    const namePattern = /^[a-zA-Z0-9]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!namePattern.test(formData.username)) {
      setErrors('Username can only contain letters and numbers.');
      return false;
    }

    if (!passwordPattern.test(formData.password)) {
      setErrors('Password must be at least 8 characters, with one number, one letter, and one special character.');
      return false;
    }

    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; // Stop the submission if validation fails
    }
  

    setLoading(true); // Show loading indicator

    // Log the form data to ensure it's correct before sending
    console.log('FormData being sent:', formData);
  
    try {
      const response = await fetch('https://localhost:3001/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Ensure JSON.stringify is used here
        credentials: 'include', // Ensures cookies are sent with request if needed for CORS
      });
  
      const data = await response.json();

      setLoading(false); // Hide loading indicator
  
      if (response.ok) {
        console.log('Login successful:', data);
  
        // Store the token in local storage and redirect to dashboard
        localStorage.setItem('token', data.token);
        window.location.href = "/dashboard"; // Assuming you have a dashboard route
      } else {
        setErrors(data.message);
      }
    } catch (error) {
      setLoading(false); // Hide loading indicator
      console.error('Login error:', error);
      setErrors('Something went wrong. Please try again later.');
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-heading">Log into the System</h2>
        <h3 className="login-subheading">Enter the following details</h3>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-content">
            <div className="login-input-column">
              <div className="login-input-group">
                <input
                  className="login-input"
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="login-input-group">
                <input
                  className="login-input"
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  placeholder="Account Number"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="login-input-group">
                <input
                  className="login-input"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Display error messages */}
          {errors && <p className="error-message">{errors}</p>}
          
          {/* Show loading indicator */}
          {loading && <p className="loading-message">Logging in, please wait...</p>}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}


export default LoginPage;
