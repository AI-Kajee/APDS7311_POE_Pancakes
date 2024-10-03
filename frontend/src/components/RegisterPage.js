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

  const [errors, setErrors] = useState({});
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    specialChar: false,
    number: false,
    capital: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update password criteria when user types a password
    if (name === 'password') {
      const length = value.length >= 8;
      const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const number = /\d/.test(value);
      const capital = /[A-Z]/.test(value);

      setPasswordCriteria({ length, specialChar, number, capital });
    }
  };

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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('User registered successfully');
      } else {
        console.log('Failed to register user');
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
                <li className={passwordCriteria.length ? 'valid' : 'invalid'}>
                  Minimum 8 characters
                </li>
                <li className={passwordCriteria.specialChar ? 'valid' : 'invalid'}>
                  At least one special character
                </li>
                <li className={passwordCriteria.number ? 'valid' : 'invalid'}>
                  At least one number
                </li>
                <li className={passwordCriteria.capital ? 'valid' : 'invalid'}>
                  At least one capital letter
                </li>
              </ul>
            </div>
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
