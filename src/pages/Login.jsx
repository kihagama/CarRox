import React, { useState } from 'react';
import { UseAuth } from '../context/AuthProvider';
import './Hover.css'
import { Link, useNavigate } from 'react-router-dom';
const Login = () => {
    const {login,loading}=UseAuth()
const [formdata,setformdata]=useState({
    username:"",
    password:""
})
const handlesubmit=(e)=>{
    e.preventDefault()
    login(formdata)
}
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      <form style={styles.form} onSubmit={handlesubmit}  >
        <input type="text" placeholder="Username" style={styles.input} value={formdata.username} onChange={(e)=>setformdata((prev)=>({...prev,username:e.target.value}))} required />
        <input type="password" placeholder="Password" style={styles.input} value={formdata.password} onChange={(e)=>setformdata((prev)=>({...prev,password:e.target.value}))} required/>
        <button type="submit" className="hovers" disabled={loading}>{loading?"submitting":"Login"}</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16 }}>
        <Link to="/forgot-password" style={{ color: '#00BFA6', textDecoration: 'underline', cursor: 'pointer' }}>
          Forgot Password?
        </Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0b1d3a', 
    color: '#fff',
    minHeight: '100vh',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    
    
    
  },
  heading: {
    marginBottom: '20px',
    fontSize: '2rem',
    color: '#ffffff',
  },
  form: {
    backgroundColor: '#102c57', 
    padding: '30px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    width: '250px',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
  },
 
};

export default Login;
