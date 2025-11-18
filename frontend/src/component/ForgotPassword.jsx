// ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
//   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, { email });
      setStatus(res.data.message || 'If the email exists, a reset link was sent.');
      // optionally redirect to a "check your email" page
      // navigate('/check-email');
    } catch (err) {
      console.error(err);
      setStatus('Something went wrong.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: 380 }}>
        <h4>Forgot Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          </div>
          <button className="btn btn-primary w-100" type="submit">Send Reset Link</button>
        </form>
        {status && <p className="mt-2">{status}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
