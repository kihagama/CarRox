// Course.jsx

import React, { useEffect, useState } from 'react';
import internimage from '../assets/pexels-cottonbro-6804068.jpg';
import './Hover.css';
import axios from 'axios';
import { UseAuth } from '../context/AuthProvider';
import { toast } from 'react-toastify';

const Service = () => {
  const { isallowed, userdata } = UseAuth();
  const [showCarWashModal, setShowCarWashModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [carWashForm, setCarWashForm] = useState({
    customer_name: '', phone: '', email: '', car_details: '', booking_date: ''
  });
  const [hireForm, setHireForm] = useState({
    customer_name: '', phone: '', email: '', car: null, start_date: '', end_date: ''
  });
  const [Data, setData] = useState([]);
  const [loading, setloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const BASE_URL = import.meta.env.VITE_URL;       // `/cars/`
  const HIRE_URL = import.meta.env.VITE_HIRE_URL;  // `/hire/`
  const CARWASH_URL = import.meta.env.VITE_CARWASH_URL; // `/book-wash/`

  const fetchData = async (filters = {}) => {
    try {
      setloading(true);
      const response = await axios.get(BASE_URL, { params: filters });
      setData(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (hireForm.start_date && hireForm.end_date && selectedCar) {
      const start = new Date(hireForm.start_date);
      const end = new Date(hireForm.end_date);
      const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
      setTotalPrice(days > 0 ? days * Number(selectedCar.price_per_day) : 0);
    } else {
      setTotalPrice(0);
    }
  }, [hireForm.start_date, hireForm.end_date, selectedCar]);

  const handleSearch = () => {
    fetchData(searchTerm.trim() ? { title: searchTerm } : {});
  };

  const openCarWashModal = () => {
    if (!isallowed) {
      toast.info('Please log in to book a car wash.');
      return;
    }
    setCarWashForm({
      customer_name: userdata?.username || '',
      phone: '', email: '', car_details: '', booking_date: ''
    });
    setShowCarWashModal(true);
  };

  const openHireModal = (carId) => {
    if (!isallowed) {
      toast.info('Please log in to hire a car.');
      return;
    }
    const carObj = Data.find((c) => c.id === carId);
    setSelectedCar(carObj);
    setHireForm({
      customer_name: userdata?.username || '',
      phone: '', email: '', car: carId, start_date: '', end_date: ''
    });
    setTotalPrice(0);
    setShowHireModal(true);
  };

  const handleSubmit = async (type) => {
    try {
      const payload = type === "CarWash" ? carWashForm : hireForm;
      const url = type === "CarWash" ? CARWASH_URL : HIRE_URL;

      

      await axios.post(url, payload);
      toast.success(`${type === "CarWash" ? "Car Wash" : "Car Hire"} Submitted Successfully!`);
      if (type === "CarWash") setShowCarWashModal(false);
      else setShowHireModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again.");
    }
  };

  const backdropStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  };

  const modalStyle = {
    backgroundColor: '#fff', color: '#000', borderRadius: '12px', padding: '30px', maxWidth: '400px', width: '90%'
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Available Cars for Hire</h1>

      <div style={styles.sectionGroup}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <input
            className='search'
            style={{ ...styles.input, maxWidth: '300px' }}
            type="text"
            placeholder='Search car'
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              if (value.trim() === '') fetchData();
            }}
          />
          <button className='hovers' onClick={handleSearch}>Search</button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : Data.length === 0 ? (
          <h3 style={{ textAlign: 'center' }}>No Cars Available</h3>
        ) : (
          <div style={styles.servicesGrid}>
            {Data.map((car) => (
              <div
                style={{ ...styles.card, background: 'rgba(255,255,255,0.07)', color: '#fff' }}
                key={car.id}
              >
                <img
                  src={car.image || 'https://via.placeholder.com/600x300?text=No+Image'}
                  alt={car.title}
                  style={styles.cardImage}
                />
                <h3>{car.title}</h3>
                <p>{car.description}</p>
                 <p><strong>Price per day:</strong> UGX {Number(car.price_per_day).toLocaleString()}</p>

                <button className="hovers" onClick={() => openHireModal(car.id)}>Hire Now</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.sectionGroup}>
        <h2 style={styles.sectionTitle}>Book a Car Wash</h2>
        <div style={styles.internCard}>
          <img src={internimage} alt="Car Wash" style={styles.cardImage} />
          <h3>Professional Car Wash</h3>
          <p>Get your car sparkling clean!</p>
          <button className='hovers' onClick={openCarWashModal}>Book Now</button>
        </div>
      </div>

      {showCarWashModal && (
        <div style={backdropStyle} onClick={() => setShowCarWashModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Book a Car Wash</h2>
            <form onSubmit={e => { e.preventDefault(); handleSubmit('CarWash'); }}>
              <input value={carWashForm.customer_name} readOnly style={styles.input} />
              <input placeholder="Contact" style={styles.input} required
                onChange={(e) => setCarWashForm({ ...carWashForm, phone: e.target.value })}
              />
              <input placeholder="Email" type="email" style={styles.input} required
                onChange={(e) => setCarWashForm({ ...carWashForm, email: e.target.value })}
              />
              <input placeholder="Car Details" style={styles.input} required
                onChange={(e) => setCarWashForm({ ...carWashForm, car_details: e.target.value })}
              />
              <input placeholder="Booking Date" type="date" style={styles.input} required
                onChange={(e) => setCarWashForm({ ...carWashForm, booking_date: e.target.value })}
              />
              <button className='hovers' type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {showHireModal && (
        <div style={backdropStyle} onClick={() => setShowHireModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Hire a Car</h2>
            <form onSubmit={e => { e.preventDefault(); handleSubmit('HireCar'); }}>
              <input value={hireForm.customer_name} readOnly style={styles.input} />
              <input placeholder="Contact" style={styles.input} required
                onChange={(e) => setHireForm({ ...hireForm, phone: e.target.value })}
              />
              <input placeholder="Email" type="email" style={styles.input} required
                onChange={(e) => setHireForm({ ...hireForm, email: e.target.value })}
              />
              <label>Start Date:</label>
              <input type="date" style={styles.input} required
                onChange={(e) => setHireForm({ ...hireForm, start_date: e.target.value })}
              />
              <label>End Date:</label>
              <input type="date" style={styles.input} required
                onChange={(e) => setHireForm({ ...hireForm, end_date: e.target.value })}
              />
              <div style={{ margin: '10px 0', fontWeight: 'bold' }}>
                Total Price: UGX {totalPrice.toLocaleString()}
              </div>
              <button className='hovers' type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0b1d3a',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    padding: '60px 20px',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '30px',
  },
  sectionGroup: {
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#00BFA6',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  cardImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
    margin:"10px"
  },
  internCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    maxWidth: '700px',
    margin: '0 auto',
  },
};

export default Service;
