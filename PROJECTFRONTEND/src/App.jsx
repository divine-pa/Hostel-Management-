import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { NavLink } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landingpage'
import AdminLogin from './pages/adminLogin'
import StudentLogin from './pages/studentLoginn'
import StudentDashboard from './pages/studentdashboard'
import AdminDashboard from './pages/admindashboard'

function App() {
  

  return (
    <>
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path ="/landingpage" element={<LandingPage />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>

    </>
  )
  
}

export default App
