import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaPhoneAlt, FaTwitter } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='sociallinks'>
        <a style={{ fontSize: "35px", color: "white" }} href="tel:+256700750061" target="_blank" rel="noopener noreferrer">
          <FaPhoneAlt />
        </a>
        <a style={{ fontSize: "35px", color: "green" }} href="https://wa.me/256700750061" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp />
        </a>
        <a
          style={{ fontSize: "35px", color: "blue" }}
          href="https://www.x.com/ismaelkihagama/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter />
        </a>
        <a
          style={{ fontSize: "35px", color: "red" }}
          href="https://www.instagram.com/lothbrokivarpe"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram />
        </a>
      </div>

      <div className='quicklinks'>
        <h2 style={{ color: "white" }}>Quick Links</h2>
        <Link to="/">HOME</Link>
        <Link to="/our-services">SERVICES</Link>
        <Link to="/contact">CONTACT-US</Link>
        <Link to="/about-us">ABOUT-US</Link>
      </div>

      <div className='quicklinkss'>
        <p>CarRox © {new Date().getFullYear()} — Driving Your Journey with Ease</p>
        <p>Providing exceptional car rental and car wash services across Uganda.</p>
        <p>At CarRox, we offer a diverse fleet and professional services to ensure a seamless travel experience for every customer.</p>
        <p>Email: info@carrox.ug | Tel: +256 700750061</p>
      </div>
    </div>
  );
};

export default Footer;