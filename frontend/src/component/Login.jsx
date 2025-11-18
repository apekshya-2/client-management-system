import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { Link,  } from 'react-router-dom';

const Login = () => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/auth/login`, values);
      console.log(res.data); // handle login response
      // navigate('/dashboard'); // redirect after login
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    }
  };

  return (
    <div
      className='d-flex justify-content-center align-items-center vh-100 loginPage'
      style={{
        backgroundImage: `linear-gradient(rgba(11,11,11,0.5), rgba(10,10,10,0.5)), url(${process.env.PUBLIC_URL + '/images/cmsjpg.jpg'})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      <div className='loginForm'>
        <h2>Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email'><strong>Email:</strong></label>
            <input
              type='email'
              name='email'
              autoComplete='off'
              placeholder='Enter Email'
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className='form-control rounded-0'
              required
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='password'><strong>Password:</strong></label>
            <input
              type='password'
              name='password'
              autoComplete='off'
              placeholder='Enter Password'
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              className='form-control rounded-0'
              required
            />
          </div>
          <div className='mb-1'>
            <input type='checkbox' name='tick' id='tick' className='me-2'/>
            <label htmlFor='tick'>You agree with terms & conditions</label>
          </div>
          <button className='btn btn-success w-100 rounded-0' type='submit'>Log in</button>
        </form>
        {error && <p className='text-danger mt-2'>{error}</p>}
        <div className='mt-2'>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
