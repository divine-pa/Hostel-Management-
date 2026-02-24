// ==================================================
// ADMINDASHBOARD.JSX - Administrator's control panel
// ==================================================
// This is where hostel admins see everything about their hall after logging in
// Think of it like a manager's control room that shows:
// - Hall statistics (total rooms, occupancy, etc.)
// - Room details with assigned students
// - Search functionality to find specific rooms or students

import { getAdminDashboard, toggleRoomMaintenance, allocationGraph } from "../services/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AllocationTrend from "./Charts";

// ==================================================
// ADMIN DASHBOARD COMPONENT
// ==================================================
function AdminDashboard() {
    // ===== STATE VARIABLES =====
    // These are like boxes that hold information while the page is running

    // dashboardData: Holds all the admin's hall information from the server
    const [dashboardData, setDashboardData] = useState(null);

    // loading: Shows whether we're currently fetching data (true = loading, false = done)
    const [loading, setLoading] = useState(true);

    // error: Holds any error messages if something goes wrong
    const [error, setError] = useState(null);

    // navigate: A tool to move between different pages
    const navigate = useNavigate();

    // ===== SEARCH FUNCTIONALITY VARIABLES =====
    // searchTerm: What the admin types in the search box
    const [searchTerm, setSearchTerm] = useState("");

    // hallData: The original, complete hall data (never changes)
    const [hallData, setHallData] = useState(null);

    // filteredRooms: The list of rooms to display (changes when searching)
    const [filteredRooms, setFilteredRooms] = useState([]);

    // togglingRoom: Tracks which room is currently being toggled (to show loading state)
    const [togglingRoom, setTogglingRoom] = useState(null);

    // chartData: Holds the allocation trend data for the chart
    const [chartData, setChartData] = useState([]);



    // ===== FUNCTION TO FETCH DASHBOARD DATA =====
    // This function loads the dashboard data from the server
    // We extracted it so we can call it both on initial load AND for auto-refresh
    const fetchDashboardData = async () => {
        try {
            // Step 1: Check if the admin is logged in
            const userString = localStorage.getItem('Admin')

            // If no login info found, send them to login page
            if (!userString) {
                navigate('/adminlogin')
                return
            }

            // Step 2: Get the admin's login info from storage
            const admin = JSON.parse(userString)

            // Step 3: Get the admin's email
            const adminparm = admin.email

            // Step 4: Fetch the dashboard data from the server
            const data = await getAdminDashboard(adminparm);
            setDashboardData(data);

            // Step 5: Initialize the search functionality
            // Save the hall data for searching
            if (data.hall_details) {
                setHallData(data.hall_details);  // Master data (never changes)
                setFilteredRooms(data.hall_details.rooms || []);  // Display list (changes when searching)
            }

            // Step 6: Stop showing "loading" (only on first load)
            setLoading(false)

        } catch (error) {
            // If something went wrong, show error message
            console.error("Dashboard Error:", error);
            setError("Failed to load dashboard data.");  // Set error message
            setLoading(false);  // Stop showing "loading"

            // If error is "unauthorized" (401), send them to login
            if (error.response && error.response.status === 401) {
                navigate('/adminlogin')
            }
        }
    };

    // ===== LOAD DATA WHEN PAGE OPENS =====
    // useEffect runs automatically when the page loads
    useEffect(() => {
        // Call the fetch function on initial load
        fetchDashboardData()
    }, [navigate])  // Run this when the page loads

    // ===== FETCH GRAPH DATA ON LOAD + REFRESH EVERY 60 SECONDS =====
    // Separate from the 10s room refresh — graph shows daily trends so 30s is enough
    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const graphData = await allocationGraph();
                setChartData(graphData);
            } catch (graphError) {
                console.error("Graph data fetch error:", graphError);
            }
        };
        fetchGraphData();  // Fetch immediately on load

        const graphInterval = setInterval(fetchGraphData, 60000);  // Then every 30 seconds
        return () => clearInterval(graphInterval);  // Cleanup on unmount
    }, [])  // Empty array = only sets up once

    // ===== AUTO-REFRESH EVERY 10 SECONDS =====
    // This makes the dashboard update automatically to show live changes
    useEffect(() => {
        // Set up an interval that calls fetchDashboardData every 10 seconds
        const refreshInterval = setInterval(() => {
            fetchDashboardData();
        }, 10000);  // 10000 milliseconds = 10 seconds

        // CLEANUP FUNCTION: This runs when the component is removed from the page
        // It's important to clear the interval to prevent memory leaks
        return () => {
            clearInterval(refreshInterval);
        };
    }, [])  // Empty array means this only sets up once when component mounts

    // ===== LOGOUT FUNCTION =====
    // This runs when the admin clicks the "Logout" button
    const handleLogout = () => {
        // Step 1: Remove their login info from browser storage
        localStorage.removeItem('Admin');

        // Step 2: Send them back to the login page
        navigate('/adminlogin');
    };

    // ===== LOADING & ERROR STATES =====
    // If still loading, show "Loading..." message
    if (loading) return <div className="loading-container">Loading Dashboard...</div>

    // If there's an error, show the error message
    if (error) return <div className="loading-container text-error">{error}</div>

    // If no data, don't show anything
    if (!dashboardData) return null

    // ===== EXTRACT DATA =====
    // Get the admin's name, email, role, and hall details from the dashboard data
    const { name, email, role, hall_details } = dashboardData;


    // ===== SEARCH FUNCTION =====
    // This runs whenever the admin types in the search box
    const handlesearch = (e) => {
        // Step 1: Get what they typed and convert to lowercase (for easier matching)
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);  // Save what they typed

        // Step 2: If search box is empty, show ALL rooms
        if (term === "") {
            setFilteredRooms(hallData.rooms);
            return;
        }

        // Step 3: Search through all rooms and find matches
        const results = hallData.rooms.filter((room) => {
            // Check if the room number matches the search term
            const matchesRoomNumber = room.room_number.toLowerCase().includes(term);

            // Check if any student in the room matches the search term
            const matchesStudent = room.occupants_list.some((student) =>
                // Check student name OR matric number
                student.full_name.toLowerCase().includes(term) ||
                student.matric_number.toLowerCase().includes(term)
            );

            // Return true if EITHER the room number OR a student matches
            return matchesRoomNumber || matchesStudent;
        });

        // Step 4: Update the display list with the search results
        setFilteredRooms(results);
    }

    // ===== TOGGLE MAINTENANCE FUNCTION =====
    // This runs when admin clicks the maintenance toggle button
    const handleToggleMaintenance = async (roomId) => {
        try {
            // Show loading state for this specific room
            setTogglingRoom(roomId);

            // Get the admin's email from localStorage for audit logging
            const userString = localStorage.getItem('Admin');
            const admin = JSON.parse(userString);
            const adminEmail = admin.email;

            // Call the service function to toggle maintenance status
            const response = await toggleRoomMaintenance(roomId, adminEmail);

            // Show success message
            alert(`${response.message}\nRoom: ${response.room_number}\nMaintenance: ${response.is_under_maintenance ? 'ON' : 'OFF'}`);

            // Refresh the dashboard to show updated status
            await fetchDashboardData();

        } catch (error) {
            // If something went wrong, show error
            console.error('Error toggling maintenance:', error);
            const errorMsg = error.response?.data?.error || 'Failed to toggle maintenance status';
            alert(`Error: ${errorMsg}`);
        } finally {
            // Remove loading state
            setTogglingRoom(null);
        }
    }

    return (
        // Main container for the entire dashboard
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg)' }}>
            {/* Centered content wrapper */}
            <div className="content-wrapper">

                {/* ===== HEADER SECTION ===== */}
                {/* This shows the admin's name and a logout button */}
                <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    {/* Header with admin info and logout button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <div>
                            {/* "ADMIN DASHBOARD" badge */}
                            <div className="badge" style={{ background: 'var(--color-secondary)', color: 'white', marginBottom: 'var(--spacing-sm)' }}>
                                ADMIN DASHBOARD
                            </div>

                            {/* Page title */}
                            <h1 style={{ marginBottom: '0' }}>Admin Dashboard</h1>
                        </div>

                        {/* Logout button */}
                        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                            Logout
                        </button>
                    </div>

                    {/* Admin's basic information in a grid */}
                    <div className="grid grid-3" style={{ fontSize: 'var(--font-size-sm)' }}>
                        {/* Admin's name */}
                        <p><strong>Name:</strong> {name}</p>

                        {/* Admin's email */}
                        <p><strong>Email:</strong> {email}</p>

                        {/* Admin's role */}
                        <p><strong>Role:</strong> {role}</p>
                    </div>
                </div>

                {/* ===== HALL INFORMATION SECTION ===== */}
                {/* Only show this if the admin has hall details */}
                {hall_details && (
                    <div className="card">
                        {/* Section title */}
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-lg)' }}>
                            Hall Information
                        </h2>

                        {/* ===== HALL OVERVIEW ===== */}
                        {/* This is a fancy box showing hall statistics */}
                        <div style={{
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, #1e40af 100%)',  // Blue gradient
                            color: 'white',
                            padding: 'var(--spacing-xl)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: 'var(--spacing-xl)'
                        }}>
                            {/* Hall name (big and bold) */}
                            <h3 style={{ fontSize: 'var(--font-size-2xl)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--spacing-lg)' }}>
                                {hall_details.hall_name}
                            </h3>

                            {/* Statistics in a grid */}
                            <div className="grid grid-3">
                                {/* GENDER */}
                                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', opacity: '0.9', marginBottom: 'var(--spacing-xs)' }}>Gender</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>{hall_details.gender}</p>
                                </div>

                                {/* TOTAL ROOMS */}
                                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', opacity: '0.9', marginBottom: 'var(--spacing-xs)' }}>Total Rooms</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>{hall_details.total_rooms}</p>
                                </div>

                                {/* AVAILABLE ROOMS */}
                                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', opacity: '0.9', marginBottom: 'var(--spacing-xs)' }}>Available Rooms</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>{hall_details.available_rooms}</p>
                                </div>

                                {/* TOTAL STUDENTS */}
                                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', opacity: '0.9', marginBottom: 'var(--spacing-xs)' }}>Total Students</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>{hall_details.total_students_in_hall}</p>
                                </div>

                                {/* OCCUPANCY RATE (percentage of beds filled) */}
                                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', opacity: '0.9', marginBottom: 'var(--spacing-xs)' }}>Occupancy Rate</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>{hall_details.occupancy_rate}</p>
                                </div>


                                {/* TRUE AVAILABLE BEDS */}
                                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', opacity: '0.9', marginBottom: 'var(--spacing-xs)' }}>True Available Beds</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>{hall_details.true_available_beds}</p>
                                </div>

                                {/* ROOMS UNDER MAINTENANCE */}
                                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', opacity: '0.9', marginBottom: 'var(--spacing-xs)' }}>Rooms Under Maintenance</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>{hall_details.rooms_under_maintenance}</p>
                                </div>

                            </div>
                        </div>
                        <div>
                            <AllocationTrend data={chartData} />
                        </div>

                        {/* ===== SEARCH BAR ===== */}
                        {/* This lets admins search for specific rooms or students */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search by Room Number, Student Name, or Matric No..."
                                value={searchTerm}  // What's currently in the search box
                                onChange={handlesearch}  // Run search function when they type
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

                        {/* ===== ROOMS SECTION ===== */}
                        {/* This shows the list of rooms (filtered by search) */}
                        <div>
                            {/* Section title */}
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Room Details</h3>

                            {/* Check if there are rooms to display */}
                            {filteredRooms && filteredRooms.length > 0 ? (
                                // If there are rooms, show them in a list
                                <div className="grid grid-1">
                                    {/* Loop through each room */}
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

                                            // HOVER EFFECT: When mouse hovers over, add shadow and change border color
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.boxShadow = 'none';
                                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                            }}
                                        >
                                            {/* Room header: room number and status */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                                                {/* Room number */}
                                                <h4 style={{ fontSize: 'var(--font-size-xl)', margin: 0 }}>
                                                    Room {room.room_number}
                                                </h4>

                                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                                                    {/* Maintenance status badge (orange if under maintenance) */}
                                                    {room.is_under_maintenance && (
                                                        <span className="badge" style={{ background: '#f59e0b', color: 'white' }}>
                                                            🔧 Under Maintenance
                                                        </span>
                                                    )}

                                                    {/* Status badge (green if available, red if full) */}
                                                    <span className={room.room_status === 'Available' ? 'badge badge-success' : 'badge badge-error'}>
                                                        {room.room_status}
                                                    </span>

                                                    {/* Toggle Maintenance Button */}
                                                    <button
                                                        onClick={() => handleToggleMaintenance(room.room_id)}
                                                        disabled={togglingRoom === room.room_id}
                                                        className="btn btn-sm"
                                                        style={{
                                                            background: room.is_under_maintenance ? '#10b981' : '#f59e0b',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '6px 12px',
                                                            fontSize: 'var(--font-size-sm)',
                                                            cursor: togglingRoom === room.room_id ? 'not-allowed' : 'pointer',
                                                            opacity: togglingRoom === room.room_id ? 0.6 : 1,
                                                        }}
                                                    >
                                                        {togglingRoom === room.room_id
                                                            ? '⏳ Loading...'
                                                            : room.is_under_maintenance
                                                                ? '✓ End Maintenance'
                                                                : '🔧 Start Maintenance'
                                                        }
                                                    </button>
                                                </div>
                                            </div>

                                            {/* ===== PROGRESS BAR ===== */}
                                            {/* Visual bar showing how full the room is */}
                                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                {/* Background bar (gray) */}
                                                <div style={{
                                                    width: '100%',
                                                    height: '8px',
                                                    background: '#e5e7eb',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden'
                                                }}>
                                                    {/* Foreground bar (blue or red depending on occupancy) */}
                                                    {/* Width is a percentage: (students / capacity) × 100 */}
                                                    <div style={{
                                                        width: `${(room.current_occupants / room.capacity) * 100}%`,
                                                        height: '100%',
                                                        background: room.current_occupants >= room.capacity ? '#ef4444' : '#3b82f6',  // Red if full, blue if not
                                                        transition: 'width 0.5s ease'
                                                    }}></div>
                                                </div>

                                                {/* Text below bar showing exact numbers */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginTop: '4px', color: '#6b7280' }}>
                                                    <span>Occupancy</span>
                                                    <span>{room.current_occupants} / {room.capacity}</span>
                                                </div>
                                            </div>


                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // If no rooms match the search, show message
                                <p className="text-secondary">No rooms match your search.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Export this component so it can be used in App.jsx
export default AdminDashboard;
