import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'

import Contact from './pages/Contact'
import About from './pages/About'
import Fallback from './pages/Fallback'
import Header from './components/Header'
import Footer from './components/Footer'
import Register from './pages/Register'
import Login from './pages/Login'
import UserBookings from './pages/UserBookings'
import Service from './pages/Service'
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
const App = () => {
  return (
    <>
    <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
         <Route path='/our-services' element={<Service/>}/>
          <Route path='/contact' element={<Contact/>}/>
           <Route path='/about-us' element={<About/>}/>
           <Route path='/register' element={<Register/>}/>
           <Route path='/login' element={<Login/>}/>
           <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route path="/reset-password" element={<ResetPassword />} />
            <Route path='*' element={<Fallback/>}/>  
            <Route path="/my-bookings" element={<UserBookings />} />

      </Routes>
      <Footer/>
      </>
    
  )
}

export default App
