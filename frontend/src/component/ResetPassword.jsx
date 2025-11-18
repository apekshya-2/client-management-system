// ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [valid, setValid] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const validate = async () => {
      if (!token || !email) {
        setValid(false);
        return;
      }
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/validate-token`, { token, email });
        setValid(res.data.valid);
      } catch (err) {
        setValid(false);
      }
    };
    validate();
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMsg('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirm) {
      setMsg('Passwords do not match.');
      return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
        token, email, newPassword
      });
      setMsg(res.data.message || 'Password reset success. You can login now.');
      // optional redirect to login
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error resetting password.');
    }
  };

  if (valid === null) return <div>Checking token...</div>;
  if (!valid) return <div>Invalid or expired link.</div>;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: 380 }}>
        <h4>Reset Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>New Password</label>
            <input className="form-control" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Confirm Password</label>
            <input className="form-control" type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
          </div>
          <button className="btn btn-primary w-100" type="submit">Reset Password</button>
        </form>
        {msg && <p className="mt-2">{msg}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
