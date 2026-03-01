// ==================================================
// APP.JSX - This is the main application file
// ==================================================
// Think of this as a traffic controller:
// - It decides which page to show based on the web address (URL)
// - It sets up all the different routes (like roads) in the app
// - It protects certain pages so only logged-in users can see them

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { NavLink } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'

// Import all the different pages in our app
import LandingPage from './pages/landingpage'
import AdminLogin from './pages/adminLogin'
import StudentLogin from './pages/studentLoginn'
import StudentDashboard from './pages/studentdashboard'
import AdminDashboard from './pages/admindashboard'
import ProtectedRoute from './component/protectedroute'
import ReceiptPage from './pages/reciept'
import DisplayStudent from './pages/displayStudent'
import Persistent from './pages/persistent'
import AdminReceipts from './pages/adminReceipts'
import LoginPage from './pages/login'

// ==================================================
// MAIN APP FUNCTION
// ==================================================
// This is the main component that runs the whole application
function App() {


  return (
    <>
      {/* Routes define which page to show based on the URL */}
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        {/* These pages can be accessed by anyone, even without logging in */}

        {/* When URL is "/", show the landing page */}
        <Route path="/" element={<LandingPage />} />

        <Route path='/LoginPage' element ={<LoginPage/>} />

        {/* When URL is "/adminlogin", show the admin login page */}
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* When URL is "/studentlogin", show the student login page */}
        <Route path="/studentlogin" element={<StudentLogin />} />

        {/* When URL is "/landingpage", also show the landing page */}
        <Route path="/landingpage" element={<LandingPage />} />

        {/* When URL is "/displaystudent", also show the display student page */}
        <Route path="/displaystudent" element={<DisplayStudent />} />

        {/* When URL is "/persistent", also show the persistent page */}
        <Route path="/persistent" element={<Persistent />} />

        {/* When URL is "/reciept", show the receipt page */}
        <Route path="/reciept" element={<ProtectedRoute><ReceiptPage /></ProtectedRoute>} />

        {/* ===== PROTECTED ROUTES ===== */}
        {/* These pages can ONLY be accessed after logging in */}
        {/* If you try to visit without logging in, you'll be kicked back to login */}

        {/* Student Dashboard - wrapped in ProtectedRoute for security */}
        <Route path="/studentdashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />

        {/* Admin Dashboard - wrapped in ProtectedRoute for security */}
        <Route path="/admindashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

        {/* Admin Receipts - view/download student receipts */}
        <Route path="/admin/receipts" element={<ProtectedRoute><AdminReceipts /></ProtectedRoute>} />
      </Routes>

    </>
  )

}

// Export this component so it can be used in other files
export default App
