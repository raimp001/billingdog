import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppointmentList from './components/AppointmentList';
import PaymentForm from './components/PaymentForm';
import Patients from './pages/Patients';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/app.css';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{ flex: 1, padding: '10px' }}>
            <Routes>
              <Route path="/" element={<AppointmentList />} />
              <Route path="/appointments" element={<AppointmentList />} />
              <Route path="/payments" element={<PaymentForm />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Add routes for additional pages as needed */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;

