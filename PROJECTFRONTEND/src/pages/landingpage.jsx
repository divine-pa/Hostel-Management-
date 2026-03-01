// ==================================================
// LANDINGPAGE.JSX - The first page visitors see
// ==================================================
// This is like the front door of your website:
// - It welcomes visitors
// - It gives them options to login as student or admin
// - It's the starting point of the application

import { Link } from "react-router-dom"

// ==================================================
// LANDING PAGE COMPONENT
// ==================================================
// This creates the welcome page with login options
function LandingPage() {
    return (
        // Main container for the entire page
        <div className="page-container">
            {/* Content wrapper to center everything */}
            <div className="content-wrapper text-center">
                {/* Card (a nice box) to hold all our content */}
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>

                    {/* ===== HERO SECTION ===== */}
                    {/* This is the big welcome message at the top */}
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        {/* Main title of the application */}
                        <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>
                            Hostel Management System
                        </h1>

                        {/* Welcome message for visitors */}
                        <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: '0' }}>
                            Welcome! Please select your login portal to continue.
                        </p>
                    </div>

                    {/* ===== LOGIN OPTIONS ===== */}
                    {/* Two big buttons - one for students, one for admins */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>

                        {/* STUDENT LOGIN BUTTON */}
                        {/* When clicked, takes you to the student login page */}
                        <Link to="/studentlogin" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
                            Student Login
                        </Link>

                        {/* ADMIN LOGIN BUTTON */}
                        {/* When clicked, takes you to the admin login page */}
                        <Link to="/adminlogin" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>
                            Admin Login
                        </Link>
                    </div>

                    {/* ===== FOOTER INFO ===== */}
                    {/* Small text at the bottom with help information */}
                    <p style={{
                        marginTop: 'var(--spacing-xl)',
                        marginBottom: '0',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Need help? Contact the hostel administration office.
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Tailwind is Working!
</button>
                    </p>
                </div>
            </div>
        </div>
    )
}

// Export this component so it can be used in App.jsx
export default LandingPage