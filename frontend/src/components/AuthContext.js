// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.userRole);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Invalid token:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token);
    setUserRole(decodedToken.userRole);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserRole('');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
