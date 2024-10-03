import React, { useState } from 'react';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    idNumber: '',
    accountNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({}); // To store validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Client-side validation
  const validateForm = () => {
    let newErrors = {};

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!passwordPattern.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters, include one number, one special character, and one capital letter.";
    }
    if (!formData.fullName || !formData.username || !formData.idNumber || !formData.accountNumber) {
      newErrors.form = "All fields must be filled out.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Send the form data to the backend API
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('User registered successfully');
        // Handle success (e.g., navigate to another page, show a success message)
      } else {
        console.log('Failed to register user');
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register Your Account</h2>
      <h3>Enter the following details</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-content">
          <div className="left-column">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="text"
              name="idNumber"
              placeholder="ID Number"
              value={formData.idNumber}
              onChange={handleChange}
            />
            <input
              type="text"
              name="accountNumber"
              placeholder="Account Number"
              value={formData.accountNumber}
              onChange={handleChange}
            />
          </div>
          <div className="spacer"></div>
          <div className="right-column">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <div className="password-requirements">
              <ul>
                <li>Minimum 8 characters</li>
                <li>At least one special character</li>
                <li>At least one number</li>
                <li>At least one capital letter</li>
              </ul>
            </div>
            {/* Display validation errors */}
            {errors.password && <p className="error">{errors.password}</p>}
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            {errors.form && <p className="error">{errors.form}</p>}
          </div>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
