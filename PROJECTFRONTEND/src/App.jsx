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
import ProtectedRoute from './component/protectedroute'

function App() {
  

  return (
    <>
      
      <Routes>
        {/*public routes*/}
        <Route path="/" element={<LandingPage />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path ="/landingpage" element={<LandingPage />} />

        {/*protected routes*/}
        <Route path="/studentdashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />

        <Route path="/admindashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>

    </>
  )
  
}

export default App
