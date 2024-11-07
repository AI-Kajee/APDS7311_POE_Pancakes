import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage'; // Import the Register Page
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PaymentPage from './components/PaymentPage';
import ViewPayment from './components/ViewPayment';
import PrivacyPolicy from './components/PrivacyPolicy';
import EmpDashboard from './components/EmpDashboard';
import { AuthProvider } from './components/AuthContext';
import './App.css';



function App() {
  return (
    <AuthProvider> {/* Wrap in AuthProvider */}
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/viewpayment" element={<ViewPayment />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/empdashboard" element={<EmpDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
