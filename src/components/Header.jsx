import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome,FaInfo,FaPhone,FaServicestack, FaSign } from 'react-icons/fa';
import './Header.css';
import { UseAuth } from '../context/AuthProvider';
import log from '../assets/carroxlogo.jpg';
import defaultAvatar from '../assets/default-avatar.jpg'; 
import axios from 'axios';

const Header = () => {
  const {isallowed,userdata ,logout}=UseAuth();
  const [menu, setmenu] =useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!isallowed) return;
      try {
        const accessToken = localStorage.getItem('access');
        const res = await axios.get('https://backend-carrox.onrender.com/profile/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setProfilePic(res.data.image || null);
      } catch (err) {
        setProfilePic(null);
      }
    };
    fetchProfile();
  }, [isallowed]);

  const handleProfilePicClick = () => {
    if (isallowed) setShowProfileModal(true);
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const accessToken = localStorage.getItem('access');
      await axios.post('https://backend-carrox.onrender.com/profile/update/', formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfilePic(URL.createObjectURL(file));
      setShowProfileModal(false);
      setUploading(false);
    } catch (err) {
      setUploading(false);
      alert('Failed to upload profile picture.');
    }
  };

  return (
    <div className='Navbar'>
      <div className='title'>
        <img src={log} alt="logo" />
        <h1>CarRoxS</h1>
      </div>
      <nav className={menu ? "mobile" : ""}>
        <Link to="/" onClick={() => setmenu(false)}>{menu?(<FaHome style={{fontSize:"15px"}}/>):(<></>)}<span></span> <span></span>HOME</Link>
        <Link to="/our-services" onClick={() => setmenu(false)}>{menu?(<FaServicestack style={{fontSize:"15px"}}/>):(<></>)}<span></span> <span></span>SERVICES</Link>
        <Link to="/contact" onClick={() => setmenu(false)}>{menu?(<FaPhone style={{fontSize:"15px"}}/>):(<></>)}<span></span> <span></span>CONTACT </Link>
        <Link to="/about-us" onClick={() => setmenu(false)}>{menu?(<FaInfo style={{fontSize:"15px"}}/>):(<></>)}<span></span> <span></span>ABOUT </Link>
        {!isallowed?(<> <Link to="/register" onClick={() => setmenu(false)}>{menu?(<FaSign style={{fontSize:"15px"}}/>):(<></>)}<span></span> <span></span>REGISTER </Link>
         <Link to="/login" onClick={() =>{ setmenu(false)
         }
                                
        }>{menu?(<FaSign style={{fontSize:"15px"}}/>):(<></>)}<span></span> <span></span>LOGIN </Link> </>):(
       <>
       <Link to="/my-bookings" onClick={() => setmenu(false)}>
          MY BOOKINGS
        </Link>
        <span className="username" style={{ color: "#fff", marginRight: "10px",fontSize:"20px", display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={profilePic || defaultAvatar}
            alt="Profile"
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #00BFA6', cursor: 'pointer', marginRight: 6 }}
            onClick={handleProfilePicClick}
          />
          {userdata?.username}
        </span>
        <button  onClick={() => {setmenu(false);
          logout()}
        }>{menu?(<FaSign style={{fontSize:"15px"}}/>):(<></>)}<span></span> <span></span>LOGOUT </button> </>
         )}
        
      </nav>
      <div id= "menu" onClick={()=>setmenu(!menu)}>
        <div id ="bar"></div>
        <div id ="bar"></div>
        <div id ="bar"></div>
      </div>
      {/* Profile Picture Modal */}
      {showProfileModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
          <div style={{ background: '#fff', color: '#222', borderRadius: 14, padding: 32, minWidth: 320, textAlign: 'center' }}>
            <h2>Update Profile Picture</h2>
            <img
              src={profilePic || defaultAvatar}
              alt="Profile Preview"
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #00BFA6', marginBottom: 16 }}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleProfilePicChange}
            />
            <button
              className="hovers"
              style={{ margin: '12px 0', padding: '8px 18px', borderRadius: 8, background: '#00BFA6', color: '#fff' }}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Choose Image'}
            </button>
            <div style={{ marginTop: 18 }}>
              <button className="hovers" style={{ background: '#ccc', color: '#222', borderRadius: 8, marginRight: 10 }} onClick={() => setShowProfileModal(false)} disabled={uploading}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
