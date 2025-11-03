import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        {/* Left Section — Logo / App Info */}
        <div className="footer-section">
          <h2 className="footer-logo">🎟️ BookItNow</h2>
          <p className="footer-desc">
            Your one-stop destination for Movies & Events — book tickets, watch
            trailers, and enjoy entertainment anytime!
          </p>
        </div>

        {/* Middle Section — Navigation */}
        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/my-bookings">My Bookings</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/settings">Settings</a></li>
            <li><a href="/movies">Movies</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/help">Help</a></li>
          </ul>
        </div>

        {/* Right Section — Contact & Social */}
        <div className="footer-section">
          <h5>Contact Us</h5>
          <p><FaEnvelope /> support@BookItNow.com</p>
          <p><FaPhoneAlt /> +91 9392455328</p>
          <p><FaMapMarkerAlt /> Hyderabad, India</p>

          <div className="social-icons">
              <FaGithub />
            
            
              <FaLinkedinIn />
            
              <FaInstagram />
            
              <FaFacebookF />
           
              <FaTwitter />
            
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BookItNow. All rights reserved.</p>
        <p>
          Designed & Developed by <span className="footer-author">Sony & Team</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
