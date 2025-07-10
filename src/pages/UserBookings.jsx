import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { UseAuth } from '../context/AuthProvider';
import washimage from '../assets/pexels-cottonbro-6804068.jpg';
import './Hover.css'; // Assuming the same Hover.css is used for button hover effects
import { toast } from 'react-toastify';

const UserBookings = () => {
  const { isallowed, logout } = UseAuth();
  const [bookings, setBookings] = useState({ car_hires: [], car_washes: [] });
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({ bookingType: '', bookingId: null, amount: '', fixedAmount: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ bookingType: '', bookingId: null });

  const openPaymentModal = (bookingType, id, totalAmount) => {
    setPaymentInfo({
      bookingType,
      bookingId: id,
      amount: totalAmount ? String(totalAmount) : '',
      fixedAmount: bookingType === 'carhire',
    });
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
    const { bookingType, bookingId, amount } = paymentInfo;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Invalid amount.');
      return;
    }
    if (bookingType === 'carwash' && Number(amount) < 100000) {
      toast.error('Minimum payment for car wash is UGX 100,000.');
      return;
    }
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      toast.info('Please log in first.');
      return;
    }
    try {
      await axios.post('http://localhost:8000/pay/', {
        booking_type: bookingType,
        booking_id: bookingId,
        amount: amount
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast.success('Payment successful! Booking confirmed.');
      setShowPaymentModal(false);
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error('Payment failed.');
    }
  };

  const fetchBookings = async () => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      toast.info('Please log in first.');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/my-bookings/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setBookings(response.data);
      console.log('Bookings:', response.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.info('Session expired. Please log in again.');
        logout();
      } else {
        toast.error('Error fetching bookings.');
      }
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (bookingType, id) => {
    setDeleteInfo({ bookingType, bookingId: id });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    const { bookingType, bookingId } = deleteInfo;
    setShowDeleteModal(false);
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      toast.info('Please log in first.');
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/delete-booking/${bookingType}/${bookingId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast.success('Booking deleted successfully.');
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete booking.');
    }
  };

  useEffect(() => {
    if (isallowed) fetchBookings();
  }, [isallowed]);

  if (!isallowed) return <p style={styles.message}>Please log in to view your bookings.</p>;

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { color: '#ccc', fontWeight: 'bold' };
      case 'confirmed':
        return { color: '#00BFA6', fontWeight: 'bold' };
      case 'cancelled':
      case 'canceled':
        return { color: '#e74c3c', fontWeight: 'bold' };
      default:
        return { color: '#fff' };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Bookings</h1>

      <div style={styles.sectionGroup}>
        <h2 style={styles.sectionTitle}>Your Car Hire Bookings</h2>
        {loading ? (
          <p style={styles.message}>Loading...</p>
        ) : bookings.car_hires.length === 0 ? (
          <h3 style={styles.message}>No car hire bookings found.</h3>
        ) : (
          <div style={styles.servicesGrid}>
            {bookings.car_hires.map((hire) => {
              const car = hire.car_details || hire.car || {};
              return (
                <div key={hire.id} style={styles.card}>
                  <img
                    src={
                      car.image
                        ? `${import.meta.env.VITE_BASE}${car.image}`
                        : 'https://via.placeholder.com/600x300?text=No+Image'
                    }
                    alt={car.title || 'Car Image'}
                    style={styles.cardImage}
                  />
                  <h3 style={styles.cardTitle}>{car.title || 'Unknown Car'}</h3>
                  <p><strong>Booking Start:</strong> {formatDate(hire.start_date)}</p>
                  <p><strong>Booking End:</strong> {formatDate(hire.end_date)}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span style={getStatusStyle(hire.status)}>{hire.status || 'N/A'}</span>
                  </p>
                  {hire.status?.toLowerCase() === 'pending' && (
                    <button
                      className="hovers"
                      style={{ ...styles.deleteButton, backgroundColor: '#00BFA6', marginBottom: 8 }}
                      onClick={() => {
                        // Calculate total price for car hire
                        const start = new Date(hire.start_date);
                        const end = new Date(hire.end_date);
                        const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
                        const pricePerDay = hire.car_details?.price_per_day || hire.car?.price_per_day || 0;
                        const total = days > 0 ? days * Number(pricePerDay) : 0;
                        openPaymentModal('carhire', hire.id, total);
                      }}
                    >
                      Pay
                    </button>
                  )}
                  <button
                    className="hovers"
                    style={styles.deleteButton}
                    onClick={() => requestDelete('carhire', hire.id)}
                  >
                    Delete Booking
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={styles.sectionGroup}>
        <h2 style={styles.sectionTitle}>Your Car Wash Bookings</h2>
        {loading ? (
          <p style={styles.message}>Loading...</p>
        ) : bookings.car_washes.length === 0 ? (
          <h3 style={styles.message}>No car wash bookings found.</h3>
        ) : (
          <div style={styles.servicesGrid}>
            {bookings.car_washes.map((wash) => (
              <div key={wash.id} style={styles.card}>
                <img
                  src={washimage}
                  alt={wash.car_details || 'Car Wash'}
                  style={styles.cardImage}
                />
                <h3 style={styles.cardTitle}>Your car :{wash.car_details || 'Service'}</h3>
                <p><strong>Booking Date:</strong> {formatDate(wash.booking_date)}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={getStatusStyle(wash.status)}>{wash.status || 'N/A'}</span>
                </p>
                {wash.status?.toLowerCase() === 'pending' && (
                  <button
                    className="hovers"
                    style={{ ...styles.deleteButton, backgroundColor: '#00BFA6', marginBottom: 8 }}
                    onClick={() => openPaymentModal('carwash', wash.id)}
                  >
                    Pay
                  </button>
                )}
                <button
                  className="hovers"
                  style={styles.deleteButton}
                  onClick={() => requestDelete('carwash', wash.id)}
                >
                  Delete Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#fff', color: '#000', borderRadius: 12, padding: 30, maxWidth: 400, width: '90%' }}>
            <h2>Payment</h2>
            <div style={{ marginBottom: 16 }}>
              <label>Amount to Pay:</label>
              <input
                type="number"
                value={paymentInfo.amount}
                readOnly={paymentInfo.fixedAmount}
                onChange={e => setPaymentInfo({ ...paymentInfo, amount: e.target.value })}
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16, marginTop: 8 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="hovers" style={{ padding: '8px 18px', borderRadius: 6, background: '#ccc', color: '#222' }} onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button className="hovers" style={{ padding: '8px 18px', borderRadius: 6, background: '#00BFA6', color: '#fff' }} onClick={handlePaymentConfirm}>Confirm Payment</button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#fff', color: '#000', borderRadius: 12, padding: 30, maxWidth: 400, width: '90%' }}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this booking?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="hovers" style={{ padding: '8px 18px', borderRadius: 6, background: '#ccc', color: '#222' }} onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="hovers" style={{ padding: '8px 18px', borderRadius: 6, background: '#e74c3c', color: '#fff' }} onClick={handleDeleteConfirm}>Delete</button>
            </div>
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
    maxWidth: '800px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease',
  },
  cardImage: {
    width: '80%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '1.4rem',
    margin: '0 0 10px',
    fontWeight: '600',
  },
  deleteButton: {
    width: '60%',
    padding: '10px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  message: {
    textAlign: 'center',
    color: '#fff',
    fontSize: '1.2rem',
  },
};

export default UserBookings;