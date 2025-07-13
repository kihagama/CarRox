import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('https://backend-carrox.onrender.com/api/password_reset/', { email });
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send reset email. Please check your email address.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: 'rgba(255,255,255,0.07)', color: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.13)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Forgot Password</h2>
      {submitted ? (
        <p style={{ color: '#00BFA6', textAlign: 'center' }}>
          If the email exists, a password reset link has been sent.<br />Please check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 16, fontSize: 16 }}
          />
          <button className="hovers" type="submit" style={{ width: '100%', padding: 10, borderRadius: 6, background: '#00BFA6', color: '#fff', fontWeight: 600 }}>
            Send Reset Link
          </button>
          {error && <p style={{ color: 'orange', marginTop: 12 }}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ForgotPassword; 