import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PizzaBuilder from './components/PizzaBuilder';
import AdminDashboard from './components/AdminDashboard';
import UserOrders from './components/UserOrders';
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> 

        {/* Route Definitions */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<PizzaBuilder />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/my-orders" element={<UserOrders />} />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;