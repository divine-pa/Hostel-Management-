// ==================================================
// ADMINLOGIN.JSX - Admin login page
// ==================================================
// This is where hostel administrators enter their details to log in
// Think of this as the manager's entrance to the system

import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginadmin } from "../services/auth"

// ==================================================
// ADMIN LOGIN COMPONENT
// ==================================================
// This creates the login form for administrators
function AdminLogin() {
    // ===== STATE VARIABLES =====
    // These are like empty boxes that will store what the admin types

    // This box stores the email the admin types
    const [email, setEmail] = useState("")

    // This box stores the password the admin types
    const [password, setPassword] = useState("")

    // This is a tool to navigate (move) to different pages
    const navigate = useNavigate()

    // ===== HANDLE LOGIN SUBMISSION =====
    // This function runs when the admin clicks the "Login" button
    const handlesubmit = async (e) => {
        // Step 1: Stop the page from refreshing (normal form behavior)
        e.preventDefault()

        try {
            // Step 2: Try to login using the email and password
            await loginadmin(email, password)

            // Step 3: If login was successful, take them to their dashboard
            navigate("/admindashboard")

        } catch (error) {
            // Step 4: If login failed (wrong email or password), show error message
            alert("login failed , check your email or password")
        }
    }

    return (
        // Main container for the page
        <div className="page-container">
            {/* Box to hold the login form */}
            <div style={{ width: '100%', maxWidth: '450px' }}>
                {/* Card (nice looking box) for the form */}
                <div className="card">
                    {/* ===== HEADER SECTION ===== */}
                    <div className="card-header">
                        {/* Special badge showing this is the admin portal */}
                        <div style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            background: 'var(--color-secondary)',
                            color: 'white',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: '600',
                            marginBottom: 'var(--spacing-md)'
                        }}>
                            ADMIN PORTAL
                        </div>

                        {/* Title: "Admin Login" */}
                        <h2 className="text-center" style={{ marginBottom: 'var(--spacing-sm)' }}>Admin Login</h2>

                        {/* Subtitle */}
                        <p className="text-center text-secondary" style={{ marginBottom: '0' }}>
                            Login to your account
                        </p>

                        {/* Helpful hint for admins */}
                        <p className="form-hint text-center">
                            Use your admin email and password
                        </p>
                    </div>

                    {/* ===== LOGIN FORM ===== */}
                    {/* When submitted, run the handlesubmit function */}
                    <form onSubmit={handlesubmit}>
                        {/* EMAIL INPUT */}
                        <div className="form-group">
                            {/* Label (text above the input box) */}
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>

                            {/* Input box where admin types their email */}
                            <input
                                type="email"  // Type "email" ensures they enter a valid email format
                                name="email"
                                id="email"
                                className="form-input"
                                placeholder="admin@example.com"  // Example text shown in empty box
                                value={email}  // What's currently in the box
                                onChange={(e) => setEmail(e.target.value)}  // Update the box when they type
                                required  // This field must be filled before submitting
                            />
                        </div>

                        {/* PASSWORD INPUT */}
                        <div className="form-group">
                            {/* Label for password */}
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>

                            {/* Input box where admin types their password */}
                            <input
                                type="password"  // Type "password" hides what they type (shows ••••)
                                name="password"
                                id="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}  // What's currently in the box
                                onChange={(e) => setPassword(e.target.value)}  // Update the box when they type
                                required  // This field must be filled
                            />
                        </div>

                        {/* LOGIN BUTTON */}
                        {/* When clicked, submit the form (which calls handlesubmit) */}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Login
                        </button>
                    </form>

                    {/* ===== BACK BUTTON ===== */}
                    {/* Link to go back to the home page */}
                    <div className="text-center" style={{ marginTop: 'var(--spacing-lg)' }}>
                        <Link to="/landingpage" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Export this component so it can be used in App.jsx
export default AdminLogin