import { getAdminDashboard } from "../services/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const userString = localStorage.getItem('Admin')
                if (!userString) {
                    navigate('/adminlogin')
                    return
                }
                const admin = JSON.parse(userString)

                const adminparm = admin.email
                const data = await getAdminDashboard(adminparm);
                setDashboardData(data);
                setLoading(false)

            } catch (error) {
                console.error("Dashboard Error:", error);
                setError("Failed to load dashboard data.");
                setLoading(false);
                if (error.response && error.response.status === 401) {
                    navigate('/adminlogin')
                }
            }

        };
        loadData()
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('Admin');
        navigate('/adminlogin');
    };

    if (loading) return <div className="loading-container">Loading Dashboard...</div>
    if (error) return <div className="loading-container text-error">{error}</div>
    if (!dashboardData) return null

    // Destructure for cleaner code
    const { name, email, role, hall_details } = dashboardData;

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg)' }}>
            <div className="content-wrapper">
                {/* Header Section */}
                <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <div>
                            <div className="badge" style={{ background: 'var(--color-secondary)', color: 'white', marginBottom: 'var(--spacing-sm)' }}>
                                ADMIN DASHBOARD
                            </div>
                            <h1 style={{ marginBottom: '0' }}>Admin Dashboard</h1>
                        </div>
                        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                            Logout
                        </button>
                    </div>

                    <div className="grid grid-3" style={{ fontSize: 'var(--font-size-sm)' }}>
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Role:</strong> {role}</p>
                    </div>
                </div>

                {/* Hall Information Section */}
                {hall_details && (
                    <div className="card">
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-lg)' }}>
                            Hall Information
                        </h2>

                        {/* Hall Overview */}
                        <div style={{
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, #1e40af 100%)',
                            color: 'white',
                            padding: 'var(--spacing-xl)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: 'var(--spacing-xl)'
                        }}>
                            <h3 style={{ fontSize: 'var(--font-size-2xl)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--spacing-lg)' }}>
                                {hall_details.hall_name}
                            </h3>
                            <div className="grid grid-3">
                                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', opacity: '0.9', marginBottom: 'var(--spacing-xs)' }}>Gender</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>{hall_details.gender}</p>
                                </div>
                                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', opacity: '0.9', marginBottom: 'var(--spacing-xs)' }}>Total Rooms</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>{hall_details.total_rooms}</p>
                                </div>
                                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', opacity: '0.9', marginBottom: 'var(--spacing-xs)' }}>Available Rooms</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>{hall_details.available_rooms}</p>
                                </div>
                                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', opacity: '0.9', marginBottom: 'var(--spacing-xs)' }}>Total Students</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>{hall_details.total_students_in_hall}</p>
                                </div>
                                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', opacity: '0.9', marginBottom: 'var(--spacing-xs)' }}>Occupancy Rate</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>{hall_details.occupancy_rate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Rooms Section */}
                        <div>
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Room Details</h3>
                            {hall_details.rooms && hall_details.rooms.length > 0 ? (
                                <div className="grid grid-2">
                                    {hall_details.rooms.map((room) => (
                                        <div
                                            key={room.room_id}
                                            style={{
                                                border: '2px solid var(--color-border)',
                                                borderRadius: 'var(--radius-lg)',
                                                padding: 'var(--spacing-lg)',
                                                transition: 'all var(--transition-base)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.boxShadow = 'none';
                                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                            }}
                                        >
                                            <h4 style={{
                                                fontSize: 'var(--font-size-xl)',
                                                marginBottom: 'var(--spacing-md)',
                                                paddingBottom: 'var(--spacing-sm)',
                                                borderBottom: '2px solid var(--color-border)'
                                            }}>
                                                Room {room.room_number}
                                            </h4>
                                            <div style={{ display: 'grid', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>
                                                <p><strong>Capacity:</strong> {room.capacity}</p>
                                                <p><strong>Current Occupants:</strong> {room.current_occupants}</p>
                                                <p>
                                                    <strong>Status:</strong>{' '}
                                                    <span className={room.room_status === 'Available' ? 'badge badge-success' : 'badge badge-error'}>
                                                        {room.room_status}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Students in this room */}
                                            {room.occupants_list && room.occupants_list.length > 0 && (
                                                <div style={{
                                                    background: 'var(--color-bg)',
                                                    padding: 'var(--spacing-md)',
                                                    borderRadius: 'var(--radius-md)',
                                                    marginTop: 'var(--spacing-md)'
                                                }}>
                                                    <h5 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-md)' }}>
                                                        Occupants:
                                                    </h5>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                                        {room.occupants_list.map((student) => (
                                                            <div
                                                                key={student.matric_number}
                                                                style={{
                                                                    background: 'white',
                                                                    padding: 'var(--spacing-md)',
                                                                    borderRadius: 'var(--radius-md)',
                                                                    borderLeft: '4px solid var(--color-primary)',
                                                                    fontSize: 'var(--font-size-sm)'
                                                                }}
                                                            >
                                                                <p style={{ fontWeight: '700', marginBottom: 'var(--spacing-xs)' }}>
                                                                    {student.full_name}
                                                                </p>
                                                                <p style={{ marginBottom: 'var(--spacing-xs)' }}>Matric: {student.matric_number}</p>
                                                                <p style={{ marginBottom: 'var(--spacing-xs)' }}>Level: {student.level}</p>
                                                                <p style={{ marginBottom: 'var(--spacing-xs)' }}>Dept: {student.department}</p>
                                                                <p style={{ marginBottom: '0' }}>Phone: {student.phone_number}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-secondary">No rooms available</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
