import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage'; // Import the Register Page
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PaymentPage from './components/PaymentPage';
import ViewPayment from './components/ViewPayment';
import './App.css';



function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />  {/* Include the Navbar at the top */}
        <Routes>
          <Route path="/" element={<HomePage />} />  {/* Home Page Route */}
          <Route path="/register" element={<RegisterPage />} />  {/* Register Page Route */}
          <Route path="/login" element={<LoginPage />} /> {/* Login Page Route */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Login Page Route */}
          <Route path="/payment" element={<PaymentPage />} /> {/* Login Page Route */}
          <Route path="/viewpayment" element={<ViewPayment />} /> {/* Login Page Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
