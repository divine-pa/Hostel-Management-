import { Link } from "react-router-dom"

function LandingPage() {
    return (
        <div className="page-container">
            <div className="content-wrapper text-center">
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    {/* Hero Section */}
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>
                            Hostel Management System
                        </h1>
                        <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: '0' }}>
                            Welcome! Please select your login portal to continue.
                        </p>
                    </div>

                    {/* Login Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <Link to="/studentlogin" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
                            Student Login
                        </Link>
                        <Link to="/adminlogin" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>
                            Admin Login
                        </Link>
                    </div>

                    {/* Footer Info */}
                    <p style={{
                        marginTop: 'var(--spacing-xl)',
                        marginBottom: '0',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Need help? Contact the hostel administration office.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LandingPage