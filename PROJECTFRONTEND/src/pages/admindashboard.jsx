import { getAdminDashboard } from "../services/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    //for search bar
    const [searchTerm, setSearchTerm] = useState("");
    const [hallData, setHallData] = useState(null); // The Master Data
    const [filteredRooms, setFilteredRooms] = useState([]); // The Display List



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

                // Initialize hallData and filteredRooms with the loaded data
                if (data.hall_details) {
                    setHallData(data.hall_details);
                    setFilteredRooms(data.hall_details.rooms || []);
                }

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


    const handlesearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setFilteredRooms(hallData.rooms);
            return;
        }

        const results = hallData.rooms.filter((room) => {
            const matchesRoomNumber = room.room_number.toLowerCase().includes(term);
            const matchesStudent = room.occupants_list.some((student) =>
                student.full_name.toLowerCase().includes(term) ||
                student.matric_number.toLowerCase().includes(term)
            );
            return matchesRoomNumber || matchesStudent;
        });

        setFilteredRooms(results);
    }

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

                        {/*room search bar */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search by Room Number, Student Name, or Matric No..."
                                value={searchTerm}
                                onChange={handlesearch} // Connect the function here
                                className="a"
                                style={{
                                    border: '2px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--spacing-md)',
                                    fontSize: 'var(--font-size-md)',
                                    color: 'var(--color-text)',
                                    background: 'var(--color-background)',
                                    transition: 'all var(--transition-base)',
                                    outline: 'none',
                                    width: '100%',
                                    maxWidth: '400px',
                                    margin: '0 auto',
                                    boxShadow: 'var(--shadow-sm)',
                                }}
                            />
                        </div>
                        {/* Rooms Section */}
                        <div>
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Room Details</h3>

                            {/* 1.room search */}
                            {filteredRooms && filteredRooms.length > 0 ? (
                                <div className="grid grid-1">
                                    {filteredRooms.map((room) => (
                                        <div
                                            key={room.room_id}
                                            style={{
                                                border: '2px solid var(--color-border)',
                                                borderRadius: 'var(--radius-lg)',
                                                padding: 'var(--spacing-lg)',
                                                transition: 'all var(--transition-base)',
                                                background: 'white'
                                            }}
                                            // ... keep your existing onMouseEnter/Leave logic ...
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.boxShadow = 'none';
                                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                                                <h4 style={{ fontSize: 'var(--font-size-xl)', margin: 0 }}>
                                                    Room {room.room_number}
                                                </h4>
                                                <span className={room.room_status === 'Available' ? 'badge badge-success' : 'badge badge-error'}>
                                                    {room.room_status}
                                                </span>
                                            </div>

                                            {/* 2. NEW: The Progress Bar */}
                                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                <div style={{
                                                    width: '100%',
                                                    height: '8px',
                                                    background: '#e5e7eb',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${(room.current_occupants / room.capacity) * 100}%`,
                                                        height: '100%',
                                                        background: room.current_occupants >= room.capacity ? '#ef4444' : '#3b82f6',
                                                        transition: 'width 0.5s ease'
                                                    }}></div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginTop: '4px', color: '#6b7280' }}>
                                                    <span>Occupancy</span>
                                                    <span>{room.current_occupants} / {room.capacity}</span>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-secondary">No rooms match your search.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
