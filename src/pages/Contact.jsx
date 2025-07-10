import React, { useState } from 'react';
import './Hover.css';
import { UseAuth } from '../context/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
const Contact = () => {
  const {loading,setloading}=UseAuth()
  const [usersname, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div style={styles.page}>
      <h1
        style={styles.title}
      >
        Contact CarRox
      </h1>

      <p
        style={styles.subtitle}
      >
        Ready to rent a car or book a car wash? Get in touch with us!
      </p>

      {/* Contact Form */}
      <form
        style={styles.form}
        onSubmit={ async(e) => {
          e.preventDefault();
          try{
            setloading(true)
          const res=  await axios.post("http://127.0.0.1:8000/sendmails/",{usersname,message,email})
            toast.success(res.data.message)
            setName("")
            setEmail("")
            setMessage("")

          } catch(error){
            toast.error("Failed to Send Message")
            setName("")
            setEmail("")
            setMessage("")
            console.log(error)
          }finally{
            setloading(false)
          }
          
         
        }}
      >
        <input
          type="text"
          name="name"
          value={usersname}
          placeholder="Your Name"
          required
          style={styles.input}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Your Email"
          required
          style={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          name="message"
          rows="5"
          value={message}
          placeholder="Your Message"
          required
          style={styles.textarea}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button disabled={loading} type="submit" className="hovers">{loading?"submitting":"send message"}</button>
      </form>

      {/* Contact Info */}
      <div style={styles.info}>
        <p><strong>Address:</strong> Bombo Road, Kampala, Uganda</p>
        <p><strong>Email:</strong> info@carrox.ug</p>
        <p><strong>Phone:</strong> +256 700750061</p>
      </div>

      {/* Google Map */}
      <div style={styles.mapContainer}>
        <iframe
          title="CarRox Location"
          src="https://www.google.com/maps?q=CarRox+Car+Rental,+Kampala&output=embed"
          width="100%"
          height="350"
          style={{ border: 0, borderRadius: '12px' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '60px 20px',
    fontFamily: 'Arial, sans-serif',
    color: '#fff',
    backgroundColor: '#0b1d3a',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2.8rem',
    textAlign: 'center',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: '40px',
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
  },
  textarea: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    resize: 'vertical',
  },
  info: {
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  mapContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    borderRadius: '12px',
    overflow: 'hidden',
  },
};

export default Contact;