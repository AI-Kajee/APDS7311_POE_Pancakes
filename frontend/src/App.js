import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage'; // Import the Register Page
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PaymentPage from './components/PaymentPage';
import ViewPayment from './components/ViewPayment';
import PrivacyPolicy from './components/PrivacyPolicy';
import EmpDashboard from './components/EmpDashboard';
import './App.css';



function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />  {/* Include the Navbar at the top */}
        <Routes>
          <Route path="/" element={<HomePage />} />  {/* Home Page Route */}
          <Route path="/register" element={<RegisterPage />} />  
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/payment" element={<PaymentPage />} /> 
          <Route path="/viewpayment" element={<ViewPayment />} /> 
          <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        </Routes>

        <Routes>
        <Route path="/empdashboard" element={<EmpDashboard />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
