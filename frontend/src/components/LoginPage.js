import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    accountNumber: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log('Login data submitted:', formData);
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
                />
              </div>
            </div>
          </div>
          <button className="login-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;