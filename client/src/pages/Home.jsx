import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, QrCode, Users, BarChart3, ArrowRight, Lock, Smartphone, Bell } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Animated background blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* Navbar */}
      <nav className="home-nav">
        <div className="nav-logo">
          <Shield size={28} />
          <span>SecurePass</span>
        </div>
        <div className="nav-links">
          <Link to="/visitor-register" className="nav-link">Register as Visitor</Link>
          <Link to="/login" className="nav-btn-outline">Staff Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">🔒 Trusted by organizations everywhere</div>
        <h1 className="hero-title">
          Digital Visitor
          <span className="gradient-text"> Management</span>
          <br />System
        </h1>
        <p className="hero-subtitle">
          Replace paper registers with smart QR-code passes, real-time notifications, 
          and powerful analytics. Secure, fast, and completely digital.
        </p>
        <div className="hero-buttons">
          <Link to="/visitor-register" className="btn-hero-primary">
            Register as Visitor
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-hero-secondary">
            Staff Portal →
          </Link>
        </div>

        {/* Stats bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">4</span>
            <span className="stat-label">User Roles</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">QR</span>
            <span className="stat-label">Code Passes</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Real-time Tracking</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">A complete solution for managing visitors from registration to checkout</p>
        </div>

        <div className="features-grid">
          <div className="feature-card feature-card-highlight">
            <div className="feature-icon icon-blue">
              <QrCode size={28} />
            </div>
            <h3>QR Code Passes</h3>
            <p>Generate unique QR codes for each approved visitor. Download as a PDF badge with all visit details.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-green">
              <Smartphone size={28} />
            </div>
            <h3>Instant Check-in</h3>
            <p>Security staff scan QR codes with their webcam. Entry and exit times are logged automatically.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-purple">
              <Bell size={28} />
            </div>
            <h3>Real-time Alerts</h3>
            <p>Host employees receive instant notifications when a visitor registers. Approve or reject in one click.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-amber">
              <BarChart3 size={28} />
            </div>
            <h3>Analytics Dashboard</h3>
            <p>Traffic charts, visitor tables with search and filtering, and CSV export for generating reports.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-cyan">
              <Lock size={28} />
            </div>
            <h3>Role-Based Access</h3>
            <p>Admin, Security, Employee, and Visitor roles — each with their own dashboard and permissions.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-rose">
              <Users size={28} />
            </div>
            <h3>Photo ID Upload</h3>
            <p>Visitors upload a photo during registration for identification. Supports JPG and PNG formats.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Four simple steps from registration to checkout</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Register</h3>
            <p>Visitor fills out the online form with their details, ID, and photo</p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Approve</h3>
            <p>Host employee gets a notification and approves the visit</p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Get Pass</h3>
            <p>Visitor receives a QR-code PDF pass via email</p>
          </div>
          <div className="step-card">
            <div className="step-number">04</div>
            <h3>Scan & Enter</h3>
            <p>Security scans the QR code — check-in and check-out logged automatically</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to go paperless?</h2>
          <p>Start managing your visitors digitally today</p>
          <div className="cta-buttons">
            <Link to="/visitor-register" className="btn-hero-primary">
              Register Now <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              Staff Login →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Shield size={20} />
            <span>SecurePass</span>
          </div>
          <p>© 2026 SecurePass — Assignment 9, MERN Stack</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
