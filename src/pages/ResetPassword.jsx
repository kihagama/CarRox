import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await axios.post('https://backend-carrox.onrender.com/api/password_reset/confirm/', {
        token,
        uid,
        password
      });
      setSubmitted(true);
    } catch (err) {
      setError('Failed to reset password. The link may be invalid or expired.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: 'rgba(255,255,255,0.07)', color: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.13)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Reset Password</h2>
      {submitted ? (
        <p style={{ color: '#00BFA6', textAlign: 'center' }}>
          Your password has been reset. You can now log in with your new password.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 16, fontSize: 16 }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 16, fontSize: 16 }}
          />
          <button className="hovers" type="submit" style={{ width: '100%', padding: 10, borderRadius: 6, background: '#00BFA6', color: '#fff', fontWeight: 600 }}>
            Reset Password
          </button>
          {error && <p style={{ color: 'orange', marginTop: 12 }}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ResetPassword; 