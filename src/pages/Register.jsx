import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hover.css'
import { toast } from 'react-toastify';
const Register = () => {
    const navigate=useNavigate()
    const [loading,setloading]=useState(false)
    const [formdata,setformdata]=useState({
        username:"",
        password:"",
        first_name:"",
        last_name:"",
        email:""

    })
const  handlesubmit= async(e)=>{
    e.preventDefault();
    try{
         setloading(true)
   const res=     await axios.post(import.meta.env.VITE_REGISTER,formdata)
        toast.success(res.data.message)
       navigate("/login")

    }catch(error){
        toast.error(error.response?.data?.message || "Registration failed")
        console.log(error)
    }finally{
        setloading(false)
    }
}
    
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>
      <form style={styles.form} onSubmit={handlesubmit}>
        <input type="text" placeholder="Username" style={styles.input} value={formdata.username} onChange={(e)=>setformdata((prev)=>({...prev,username:e.target.value}))}  required/>
        <input type="email" placeholder="Email" style={styles.input} value={formdata.email} onChange={(e=>setformdata((prev)=>({...prev,email:e.target.value})))} equired />
        <input type="text" placeholder="First Name" style={styles.input} value={formdata.first_name} onChange={(e)=>setformdata((prev)=>({...prev,first_name:e.target.value}))} required/>
        <input type="text" placeholder="Last Name" style={styles.input} value={formdata.last_name} onChange={(e)=>setformdata((prev)=>({...prev,last_name:e.target.value}))} required />
        <input type="password" placeholder="Password" style={styles.input} value={formdata.password} onChange={(e)=>setformdata((prev)=>({...prev,password:e.target.value}))} required/>
        <button type="submit"  className="hovers" disabled={loading}>{loading?"submitting":"Sign Up"}</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0b1d3a', // dark blue
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
    backgroundColor: '#102c57', // slightly lighter dark blue
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

export default Register;
