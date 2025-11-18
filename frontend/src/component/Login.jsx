import React, { useState } from 'react';
import './style.css';
import axios from 'axios'

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''

  })
  const handleSubmit= (event) =>{
    event.preventDefault()
    axios.post('http://localhost:3000/auth/adminlogin', values)
    .then(result => console.log(result))
    .catch(err => console.log(err))

  }
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
            <input type='email' name='email' autoComplete='off' placeholder='Enter Email' onChange={(e)=> setValues({...values, email:e.target.value})} className='form-control rounded-0'/>
          </div>
          <div className='mb-3'>
            <label htmlFor='password'><strong>Password:</strong></label>
            <input type='password' name='password' autoComplete='off' placeholder='Enter Password' onChange={(e)=> setValues({...values, password:e.target.value})}  className='form-control rounded-0'/>
          </div>
          <button className='btn btn-success w-100 rounded-0'>Log in</button>
          <div className='mb-1'>
            <input type='checkbox' name='tick' id='tick' className='me-2'/>
            <label htmlFor='password'>You are Agree with terms & conditions</label>

          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;
