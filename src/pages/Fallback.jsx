import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import './Hover.css'

const Fallback = () => {
  return (
    <div style={styles.container}>
      
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={styles.title}
      >
        404 - Page Not Found
      </motion.h1>
      <p style={styles.message}>
        The page you requested could not be found. You can return to the home page.
      </p>
      <Link to="/" style={styles.link}>
        <button className='hovers'>Go to Home</button>
      </Link>
      
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0b1d3a', 
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    padding: '20px'
  },
  title: {
    fontSize: '3rem',
    marginBottom: '10px'
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '30px'
  },
 
  link: {
    textDecoration: 'none'
  }
};

export default Fallback;