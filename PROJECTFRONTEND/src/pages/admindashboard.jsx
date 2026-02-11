// ==================================================
// ADMINDASHBOARD.JSX - Administrator's control panel
// ==================================================
// This is where hostel admins see everything about their hall after logging in
// Think of it like a manager's control room that shows:
// - Hall statistics (total rooms, occupancy, etc.)
// - Room details with assigned students
// - Search functionality to find specific rooms or students

import { getAdminDashboard } from "../services/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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



    // ===== LOAD DATA WHEN PAGE OPENS =====
    // useEffect runs automatically when the page loads
    useEffect(() => {
        // Function to load the dashboard data
        const loadData = async () => {
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

                // Step 6: Stop showing "loading"
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

        // Call the loadData function
        loadData()
    }, [navigate])  // Run this when the page loads

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
                            </div>
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
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                                                {/* Room number */}
                                                <h4 style={{ fontSize: 'var(--font-size-xl)', margin: 0 }}>
                                                    Room {room.room_number}
                                                </h4>

                                                {/* Status badge (green if available, red if full) */}
                                                <span className={room.room_status === 'Available' ? 'badge badge-success' : 'badge badge-error'}>
                                                    {room.room_status}
                                                </span>
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
