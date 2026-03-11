// ==================================================
// APP.JSX - Main application file with routing
// ==================================================
// This is the ENTRY POINT of the React app.
// It defines ALL the pages (routes) and which URLs go to which page.
//
// ROUTE STRUCTURE:
//   / or /landingpage  → Landing page (public, no login needed)
//   /LoginPage         → Login page selector
//   /adminlogin        → Admin login form
//   /studentlogin      → Student login form
//   /studentdashboard  → Student dashboard (protected - needs login)
//   /reciept           → Student receipt page (protected)
//
//   /admin             → Admin dashboard layout with sidebar
//   /admin/rooms       → Room management page
//   /admin/students    → Student records page
//   /admin/reports     → Reports & analytics page
//   /admin/settings    → System settings page
//
// PROTECTED ROUTES:
//   Some pages require login. They are wrapped in <ProtectedRoute>
//   which checks if the user is logged in before showing the page.
//
// BACKWARD COMPATIBILITY:
//   Old URLs like /admindashboard, /persistent, /admin/receipts
//   are redirected to their new locations using <Navigate>.

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { NavLink } from 'react-router-dom'
import { Routes, Route, Navigate } from 'react-router-dom'

// Import all pages
import LandingPage from './pages/landingpage'
import AdminLogin from './pages/adminLogin'
import StudentLogin from './pages/studentLoginn'
import StudentDashboard from './pages/studentdashboard'
import ProtectedRoute from './component/protectedroute'
import ReceiptPage from './pages/reciept'
import LoginPage from './pages/login'

// Admin pages (new sidebar layout)
import AdminLayout from './pages/AdminLayout'       // The sidebar wrapper
import AdminDashboard from './pages/admindashboard'  // Dashboard overview
import AdminRooms from './pages/AdminRooms'          // Room management
import AdminStudents from './pages/AdminStudents'    // Student records
import AdminReports from './pages/AdminReports'      // Reports & analytics
import AdminSettings from './pages/AdminSettings'    // System settings

function App() {
  return (
    <>
      <Routes>
        {/* ===== PUBLIC ROUTES (no login needed) ===== */}
        <Route path="/" element={<LandingPage />} />
        <Route path='/LoginPage' element={<LoginPage />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/landingpage" element={<LandingPage />} />

        {/* ===== STUDENT ROUTES (protected - needs student login) ===== */}
        <Route path="/reciept" element={<ProtectedRoute><ReceiptPage /></ProtectedRoute>} />
        <Route path="/studentdashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />

        {/* ===== ADMIN ROUTES (protected - needs admin login) =====
            These use NESTED ROUTES:
            - AdminLayout renders the SIDEBAR (always visible)
            - The child routes render INSIDE the sidebar's content area
            - "index" means the default page when visiting /admin */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="reports" element={<AdminReports />} />
         {/* <Route path="settings" element={<AdminSettings />} />*/}
        </Route>

        {/* ===== BACKWARD COMPATIBILITY REDIRECTS =====
            If someone uses an old URL, send them to the new one */}
        <Route path="/admindashboard" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/receipts" element={<Navigate to="/admin/reports" replace />} />
        <Route path="/persistent" element={<Navigate to="/admin/students" replace />} />
        <Route path="/displaystudent" element={<Navigate to="/admin/students" replace />} />
      </Routes>
    </>
  )
}

export default App
