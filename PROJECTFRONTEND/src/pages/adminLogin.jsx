import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginadmin } from "../services/auth"

function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handlesubmit = async (e) => {
        e.preventDefault()
        try {
            await loginadmin(email, password)
            navigate("/admindashboard")
        } catch (error) {
            alert("login failed , check your email or password")
        }
    }

    return (
        <div className="page-container">
            <div style={{ width: '100%', maxWidth: '450px' }}>
                <div className="card">
                    {/* Header */}
                    <div className="card-header">
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
                        <h2 className="text-center" style={{ marginBottom: 'var(--spacing-sm)' }}>Admin Login</h2>
                        <p className="text-center text-secondary" style={{ marginBottom: '0' }}>
                            Login to your account
                        </p>
                        <p className="form-hint text-center">
                            Use your admin email and password
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handlesubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form-input"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Login
                        </button>
                    </form>

                    {/* Back Button */}
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

export default AdminLogin