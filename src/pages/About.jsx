import React, { useState, useEffect } from 'react';
import axios from 'axios';

const About = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_TEAM);
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch team data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      {/* Title & Intro */}
      <h1 style={styles.title}>
        About CarRox
      </h1>

      <p style={styles.intro}>
        CarRox is a premier car rental service based in Kampala, Uganda. We specialize in providing reliable, affordable, and high-quality car rental and car wash services to make your journey seamless and enjoyable.
      </p>

      {/* Core Values */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Who We Are</h2>
        <p>We are a dedicated team committed to delivering exceptional car rental experiences, offering a diverse fleet and professional car wash services to customers across Uganda.</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Our Vision</h2>
        <p>To be Uganda’s leading car rental provider, offering unparalleled convenience, quality, and customer satisfaction through our innovative services.</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Our Mission</h2>
        <p>To provide top-notch car rental and car wash solutions that are customer-focused, reliable, and tailored to meet the needs of every traveler.</p>
      </div>

      {/* Team Section */}
      <section style={styles.teamSection}>
        <h2 style={styles.sectionTitle}>
          Our Team
        </h2>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading team members...</p>
        ) : (
          <div style={styles.teamGrid}>
            {data.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No team members found.</p>
            ) : (
              data.map((member, index) => (
                <div
                  key={member.id || index}
                  style={styles.teamCard}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    style={styles.teamImage}
                  />
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Achievements Section */}
      <section style={styles.achievementsSection}>
        <h2 style={styles.sectionTitle}>
          Our Achievements
        </h2>
        <div style={styles.achievementGrid}>
          <div style={styles.achievementCard}>
            <h3>500+</h3>
            <p>Car Rentals Completed</p>
          </div>
          <div style={styles.achievementCard}>
            <h3>300+</h3>
            <p>Satisfied Customers</p>
          </div>
          <div style={styles.achievementCard}>
            <h3>5+</h3>
            <p>Years in Service</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: '60px 20px',
    backgroundColor: '#0b1d3a',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
  },
  title: {
    fontSize: '3rem',
    textAlign: 'center',
    marginBottom: '20px',
  },
  intro: {
    fontSize: '1.2rem',
    maxWidth: '800px',
    margin: '0 auto 40px',
    textAlign: 'center',
    lineHeight: '1.6',
  },
  card: {
    maxWidth: '800px',
    margin: '30px auto',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    backdropFilter: 'blur(5px)',
  },
  cardTitle: {
    fontSize: '1.6rem',
    marginBottom: '10px',
    color: '#00BFA6',
  },
  sectionTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    margin: '50px 0 30px',
    color: '#00BFA6',
  },
  teamSection: {
    padding: '20px 0',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  teamCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  avatar: {
    backgroundColor: '#00BFA6',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    margin: '0 auto 10px',
    fontSize: '24px',
    lineHeight: '60px',
    color: 'white',
  },
  achievementsSection: {
    padding: '60px 0',
  },
  achievementGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
  },
  achievementCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
  },
  teamImage: {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '50%',
    marginBottom: '10px',
  },
};

export default About;