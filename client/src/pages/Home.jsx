import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px', marginTop: '40px' }}>
        <h1 style={{ fontSize: '3rem', color: '#2563eb' }}>SecurePass</h1>
        <p style={{ fontSize: '1.2rem', color: '#555' }}>
          Digital Visitor Management System
        </p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/register" style={{ marginRight: '15px', padding: '10px 20px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Start Free Trial
          </Link>
          <Link to="/login" style={{ padding: '10px 20px', background: '#eee', color: '#333', textDecoration: 'none', borderRadius: '5px' }}>
            Login
          </Link>
        </div>
      </header>

      <section style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '40px' }}>
        <h2>Features</h2>
        <ul>
          <li style={{ marginBottom: '10px' }}>
            <strong>Pre-Registration:</strong> Visitors can register online before arriving.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>QR Code Passes:</strong> Generate QR codes for easy check-in at the front desk.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Security Scanning:</strong> Security personnel can scan passes instantly using their webcam.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Admin Analytics:</strong> View detailed logs and visitor statistics.
          </li>
        </ul>
      </section>

      <footer style={{ textAlign: 'center', marginTop: '60px', padding: '20px', borderTop: '1px solid #ccc' }}>
        <p>© 2026 SecurePass - Built for Assignment 9</p>
      </footer>
    </div>
  );
};

export default Home;
