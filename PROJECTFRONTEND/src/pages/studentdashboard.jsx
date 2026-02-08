import { getStudentDashboard } from "../services/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookRoom } from "../services/auth";

function StudentDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const userString = localStorage.getItem('user');
                if (!userString) {
                    navigate('/studentlogin')
                    return
                }
                const user = JSON.parse(userString);

                const matricparm = user.matriculation_number || user.matric_number
                const data = await getStudentDashboard(matricparm);
                setDashboardData(data);
                setLoading(false);
            } catch (error) {
                console.error("Dashboard Error:", error);
                setError("Failed to load dashboard data.");
                setLoading(false);
                if (error.response && error.response.status === 401) {
                    navigate('/studentlogin')
                }
            }
        };
        loadData();
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/studentlogin');
    };

    // Loading & Error States
    if (loading) return <div className="loading-container">Loading Dashboard...</div>;
    if (error) return <div className="loading-container text-error">{error}</div>;
    if (!dashboardData) return null;

    // Destructure for cleaner code
    const { profile, available_halls } = dashboardData;
    const { room_details } = profile;


    const handleBooking = async (hall_id, hallName) => {
        if (!window.confirm(`Are you sure you want to book ${hallName}`)) {
            return
        }
        try {
            setLoading(true)
            const user = JSON.parse(localStorage.getItem("user"))
            const matricparm = user.matriculation_number || user.matric_number
            await bookRoom(matricparm, hall_id);

            alert("Room Booked Successfully")
            
            // REFRESH THE DASHBOARD

            const updateData = await getStudentDashboard(matricparm);
            setDashboardData(updateData);
            
        }catch(error){
            console.error(error)
            alert(error.response?.data?.error || "Failed to book room")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg)' }}>
            <div className="content-wrapper">
                {/* Header Section */}
                <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <h1 style={{ marginBottom: '0' }}>Welcome, {profile.full_name}</h1>
                        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                            Logout
                        </button>
                    </div>

                    <div className="grid grid-2" style={{ fontSize: 'var(--font-size-sm)' }}>
                        <p><strong>Matric No:</strong> {profile.matriculation_number}</p>
                        <p><strong>Department:</strong> {profile.department}</p>
                        <p><strong>Level:</strong> {profile.level}</p>
                        <p>
                            <strong>Payment Status: </strong>
                            <span className={profile.payment_status === 'Verified' ? 'badge badge-success' : 'badge badge-error'}>
                                {profile.payment_status}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="card">
                    {/* SCENARIO A: Has a Room */}
                    {room_details ? (
                        <div className="text-center">
                            <div style={{
                                borderLeft: '4px solid var(--color-success)',
                                paddingLeft: 'var(--spacing-lg)',
                                marginBottom: 'var(--spacing-lg)'
                            }}>
                                <h2 style={{ color: 'var(--color-success)' }}>Allocated Room</h2>
                                <p style={{ fontSize: 'var(--font-size-lg)' }}>You have been assigned to:</p>
                            </div>

                            <div style={{
                                padding: 'var(--spacing-xl)',
                                background: '#f0fdf4',
                                borderRadius: 'var(--radius-lg)',
                                display: 'inline-block',
                                minWidth: '300px'
                            }}>
                                <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', marginBottom: 'var(--spacing-sm)' }}>
                                    {room_details.hall_name}
                                </p>
                                <p style={{
                                    fontSize: 'var(--font-size-4xl)',
                                    fontWeight: '700',
                                    color: 'var(--color-primary)',
                                    marginBottom: '0'
                                }}>
                                    {room_details.room_number}
                                </p>
                            </div>

                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-lg)' }}>
                                Please present this ticket at the porter's lodge.
                            </p>
                        </div>
                    )
                        /* SCENARIO B: Payment Not Verified */
                        : profile.payment_status !== 'Verified' ? (
                            <div className="text-center" style={{ padding: 'var(--spacing-xl)' }}>
                                <h2 className="text-error">Action Required</h2>
                                <p>Your school fees payment has not been verified yet.</p>
                                <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                    Please contact the bursary or wait for verification.
                                </p>
                            </div>
                        )
                            /* SCENARIO C: Verified but No Room (Show Halls) */
                            : (
                                <div>
                                    <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-lg)' }}>
                                        Select a Hall
                                    </h2>
                                    {available_halls.length === 0 ? (
                                        <p className="text-error">No halls are currently available for your gender.</p>
                                    ) : (
                                        <div className="grid grid-2">
                                            {available_halls.map((hall) => (
                                                <div
                                                    key={hall.hall_id}
                                                    style={{
                                                        border: '2px solid var(--color-border)',
                                                        borderRadius: 'var(--radius-lg)',
                                                        padding: 'var(--spacing-lg)',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        transition: 'all var(--transition-base)',
                                                        cursor: 'pointer'
                                                    }}

                                                    
            
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.boxShadow = 'none';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                    }}
                                                > 
                                                    <div>
                                                        <h3 className="font-bold" style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xs)' }}>
                                                            {hall.hall_name}
                                                        </h3>
                                                        <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginBottom: '0' }}>
                                                            {hall.available_rooms} rooms left
                                                        </p>
                                                    </div>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => handleBooking(hall.hall_id, hall.hall_name)}
                                                    >
                                                        Select
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard