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
    if (loading) return <div>loading......</div>
    if (error) return <div> {error}</div>
    if (!dashboardData) return null

    //destructure for cleaner code - profile contains admin info and hall_details
    const { name, email, role, hall_details } = dashboardData;

    return (
        <div className="admin-dashboard">
            {/* Header Section */}
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="admin-info">
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Role:</strong> {role}</p>
                </div>
            </header>

            {/* Hall Information Section */}
            {hall_details && (
                <div className="hall-section">
                    <h2>Hall Information</h2>
                    <div className="hall-overview">
                        <h3>{hall_details.hall_name}</h3>
                        <p><strong>Gender:</strong> {hall_details.gender}</p>
                        <p><strong>Total Rooms:</strong> {hall_details.total_rooms}</p>
                        <p><strong>Available Rooms:</strong> {hall_details.available_rooms}</p>
                        <p><strong>Total Students:</strong> {hall_details.total_students_in_hall}</p>
                        <p><strong>Occupancy Rate:</strong> {hall_details.occupancy_rate}</p>
                    </div>

                    {/* Rooms Section */}
                    <div className="rooms-section">
                        <h3>Room Details</h3>
                        {hall_details.rooms && hall_details.rooms.length > 0 ? (
                            <div className="rooms-grid">
                                {hall_details.rooms.map((room) => (
                                    <div key={room.room_id} className="room-card">
                                        <h4>Room {room.room_number}</h4>
                                        <p><strong>Capacity:</strong> {room.capacity}</p>
                                        <p><strong>Current Occupants:</strong> {room.current_occupants}</p>
                                        <p><strong>Status:</strong> {room.room_status}</p>

                                        {/* Students in this room */}
                                        {room.occupants_list && room.occupants_list.length > 0 && (
                                            <div className="occupants-list">
                                                <h5>Occupants:</h5>
                                                <ul>
                                                    {room.occupants_list.map((student) => (
                                                        <li key={student.matric_number}>
                                                            <p><strong>{student.full_name}</strong></p>
                                                            <p>Matric: {student.matric_number}</p>
                                                            <p>Level: {student.level}</p>
                                                            <p>Dept: {student.department}</p>
                                                            <p>Phone: {student.phone_number}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No rooms available</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
