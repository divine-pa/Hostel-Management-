// ==================================================
// STUDENTDASHBOARD.JSX - Student's personal dashboard
// ==================================================
// This is where students see their information after logging in
// Think of it like your personal profile page that shows:
// - Your details (name, matric number, etc.)
// - Your payment status
// - Your assigned room (if you have one)
// - Available halls to choose from (if you don't have a room yet)

import { getStudentDashboard } from "../services/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookRoom, getAvailableRooms } from "../services/auth";

// ==================================================
// STUDENT DASHBOARD COMPONENT
// ==================================================
function StudentDashboard() {
    // ===== STATE VARIABLES =====
    // These are like boxes that hold information while the page is running

    // dashboardData: Holds all the student's information from the server
    const [dashboardData, setDashboardData] = useState(null);

    // loading: Shows whether we're currently fetching data (true = loading, false = done)
    const [loading, setLoading] = useState(true);

    // error: Holds any error messages if something goes wrong
    const [error, setError] = useState(null);

    // selectedHall: Which hall the student clicked on (null = showing hall list)
    const [selectedHall, setSelectedHall] = useState(null);

    // rooms: Available rooms for the selected hall
    const [rooms, setRooms] = useState([]);

    // roomsLoading: Whether we're fetching rooms
    const [roomsLoading, setRoomsLoading] = useState(false);

    // selectedBlock: Which block tab is active (e.g. "A", "B", "C")
    const [selectedBlock, setSelectedBlock] = useState(null);

    // navigate: A tool to move between different pages
    const navigate = useNavigate();

    // ===== LOAD DATA WHEN PAGE OPENS =====
    // useEffect runs automatically when the page loads
    useEffect(() => {
        // Function to load the dashboard data
        const loadData = async () => {
            try {
                // Step 1: Check if the student is logged in
                const userString = localStorage.getItem('user');

                // If no login info found, send them to login page
                if (!userString) {
                    navigate('/studentlogin')
                    return
                }

                // Step 2: Get the student's login info from storage
                const user = JSON.parse(userString);

                // Step 3: Get the student's matric number (could be named differently)
                const matricparm = user.matriculation_number || user.matric_number

                // Step 4: Fetch the dashboard data from the server
                const data = await getStudentDashboard(matricparm);

                // Step 5: Store the data and stop showing "loading"
                setDashboardData(data);
                setLoading(false);

            } catch (error) {
                // If something went wrong, show error message
                console.error("Dashboard Error:", error);
                setError("Failed to load dashboard data.");  // Set error message
                setLoading(false);  // Stop showing "loading"

                // If error is "unauthorized" (401), send them to login
                if (error.response && error.response.status === 401) {
                    navigate('/studentlogin')
                }
            }
        };

        // Call the loadData function
        loadData();
    }, [navigate])  // Run this when the page loads

    // ===== LOGOUT FUNCTION =====
    // This runs when the student clicks the "Logout" button
    const handleLogout = () => {
        // Step 1: Remove their login info from browser storage
        localStorage.removeItem('user');

        // Step 2: Send them back to the login page
        navigate('/studentlogin');
    };

    // ===== LOADING & ERROR STATES =====
    // If still loading, show "Loading..." message
    if (loading) return <div className="loading-container">Loading Dashboard...</div>;

    // If there's an error, show the error message
    if (error) return <div className="loading-container text-error">{error}</div>;

    // If no data, don't show anything
    if (!dashboardData) return null;

    // ===== EXTRACT DATA =====
    // Get the profile and available halls from the dashboard data
    const { profile, available_halls } = dashboardData;
    const { room_details } = profile;


    // ===== HANDLE SELECTING A HALL =====
    // When a student clicks "Select" on a hall, fetch its available rooms
    const handleSelectHall = async (hall) => {
        try {
            setRoomsLoading(true)
            setSelectedHall(hall)
            const roomData = await getAvailableRooms(hall.hall_id)
            setRooms(roomData)
        } catch (error) {
            console.error("Error fetching rooms:", error)
            alert("Failed to load rooms. Please try again.")
            setSelectedHall(null)
        } finally {
            setRoomsLoading(false)
        }
    }

    // ===== HANDLE ROOM BOOKING =====
    // This function runs when a student clicks "Book" on a specific room
    const handleBooking = async (hall_id, room_id, roomNumber) => {
        // Step 1: Ask for confirmation
        if (!window.confirm(`Are you sure you want to book Room ${roomNumber} in ${selectedHall.hall_name}?`)) {
            return
        }

        try {
            // Step 2: Show loading while booking
            setLoading(true)

            // Step 3: Get the student's matric number
            const user = JSON.parse(localStorage.getItem("user"))
            const matricparm = user.matriculation_number || user.matric_number

            // Step 4: Send the booking request with the specific room
            await bookRoom(matricparm, hall_id, room_id);

            // Step 5: Show success message
            alert("Room Booked Successfully")

            // Step 6: Clear selection and refresh dashboard
            setSelectedHall(null)
            setRooms([])
            const updateData = await getStudentDashboard(matricparm);
            setDashboardData(updateData);

        } catch (error) {
            console.error(error)
            alert(error.response?.data?.error || "Failed to book room")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        // Main container for the entire dashboard
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg)' }}>
            {/* Centered content wrapper */}
            <div className="content-wrapper">
                {/* ===== HEADER SECTION ===== */}
                {/* This shows the student's name and a logout button */}
                <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    {/* Header with welcome message and logout button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        {/* Welcome message with student's name */}
                        <h1 style={{ marginBottom: '0' }}>Welcome, {profile.full_name}</h1>

                        {/* Logout button */}
                        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                            Logout
                        </button>
                    </div>

                    {/* Student's basic information in a grid */}
                    <div className="grid grid-2" style={{ fontSize: 'var(--font-size-sm)' }}>
                        {/* Matric number */}
                        <p><strong>Matric No:</strong> {profile.matriculation_number}</p>

                        {/* Department */}
                        <p><strong>Department:</strong> {profile.department}</p>

                        {/* Level (year) */}
                        <p><strong>Level:</strong> {profile.level}</p>

                        {/* Payment status with color badge */}
                        <p>
                            <strong>Payment Status: </strong>
                            {/* Green badge if verified, red if not */}
                            <span className={profile.payment_status === 'Verified' ? 'badge badge-success' : 'badge badge-error'}>
                                {profile.payment_status}
                            </span>
                        </p>
                    </div>
                </div>

                {/* ===== MAIN CONTENT SECTION ===== */}
                {/* This shows different things depending on the student's situation */}
                <div className="card">
                    {/* There are 3 possible scenarios: */}

                    {/* SCENARIO A: Student HAS a room already */}
                    {room_details ? (
                        // Show their room details
                        <div className="text-center">
                            {/* Header */}
                            <div style={{
                                borderLeft: '4px solid var(--color-success)',
                                paddingLeft: 'var(--spacing-lg)',
                                marginBottom: 'var(--spacing-lg)'
                            }}>
                                <h2 style={{ color: 'var(--color-success)' }}>Allocated Room</h2>
                                <p style={{ fontSize: 'var(--font-size-lg)' }}>You have been assigned to:</p>
                            </div>

                            {/* Display the hall and room number in a nice box */}
                            <div style={{
                                padding: 'var(--spacing-xl)',
                                background: '#f0fdf4',  // Light green background
                                borderRadius: 'var(--radius-lg)',
                                display: 'inline-block',
                                minWidth: '300px'
                            }}>
                                {/* Hall name */}
                                <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', marginBottom: 'var(--spacing-sm)' }}>
                                    {room_details.hall_name}
                                </p>

                                {/* Room number (big and bold) */}
                                <p style={{
                                    fontSize: 'var(--font-size-4xl)',
                                    fontWeight: '700',
                                    color: 'var(--color-primary)',
                                    marginBottom: '0'
                                }}>
                                    {room_details.room_number}
                                </p>
                            </div>

                            {/* Instructions */}
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-lg)' }}>
                                Please present this ticket at the porter's lodge.
                            </p>

                            {/* Button to view/print official receipt */}
                            <button
                                onClick={() => navigate('/reciept')}
                                className="btn btn-primary"
                                style={{ marginTop: 'var(--spacing-md)' }}
                            >
                                View Official Receipt
                            </button>
                        </div>
                    )

                        /* SCENARIO B: Payment NOT verified */
                        : profile.payment_status !== 'Verified' ? (
                            // Tell them to pay or wait for verification
                            <div className="text-center" style={{ padding: 'var(--spacing-xl)' }}>
                                <h2 className="text-error">Action Required</h2>
                                <p>Your school fees payment has not been verified yet.</p>
                                <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                    Please contact the bursary or wait for verification.
                                </p>
                            </div>
                        )

                            /* SCENARIO C: Payment verified but NO room yet */
                            : (
                                <div>
                                    {/* If no hall is selected yet, show the hall list */}
                                    {!selectedHall ? (
                                        <>
                                            {/* Header: "Select a Hall" */}
                                            <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-lg)' }}>
                                                Select a Hall
                                            </h2>

                                            {/* Check if there are any halls available */}
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
                                                                onClick={() => handleSelectHall(hall)}
                                                            >
                                                                Select
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        /* Hall is selected — show the room picker */
                                        <>
                                            {/* Header with back button */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => { setSelectedHall(null); setRooms([]); setSelectedBlock(null); }}
                                                >
                                                    ← Back to Halls
                                                </button>
                                                <h2 style={{ color: 'var(--color-primary)', marginBottom: '0' }}>
                                                    {selectedHall.hall_name} — Pick a Room
                                                </h2>
                                            </div>

                                            {roomsLoading ? (
                                                <div className="loading-container">Loading rooms...</div>
                                            ) : rooms.length === 0 ? (
                                                <p className="text-error">No available rooms in this hall right now.</p>
                                            ) : (() => {
                                                // Group rooms by block letter (first character of room_number)
                                                const blocks = {};
                                                rooms.forEach((room) => {
                                                    const blockLetter = room.room_number.charAt(0).toUpperCase();
                                                    if (!blocks[blockLetter]) blocks[blockLetter] = [];
                                                    blocks[blockLetter].push(room);
                                                });
                                                const blockKeys = Object.keys(blocks).sort();
                                                const activeBlock = selectedBlock && blocks[selectedBlock] ? selectedBlock : blockKeys[0];

                                                return (
                                                    <div>
                                                        {/* Block tabs */}
                                                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                                                            {blockKeys.map((block) => (
                                                                <button
                                                                    key={block}
                                                                    className={`btn ${activeBlock === block ? 'btn-primary' : 'btn-secondary'}`}
                                                                    onClick={() => setSelectedBlock(block)}
                                                                    style={{ minWidth: '80px' }}
                                                                >
                                                                    {block} Block
                                                                    <span style={{ fontSize: 'var(--font-size-xs)', marginLeft: '4px', opacity: 0.7 }}>
                                                                        ({blocks[block].length})
                                                                    </span>
                                                                </button>
                                                            ))}
                                                        </div>

                                                        {/* Rooms for the active block */}
                                                        <div className="grid grid-2" style={{ gap: 'var(--spacing-md)' }}>
                                                            {blocks[activeBlock].map((room) => (
                                                                <div
                                                                    key={room.room_id}
                                                                    style={{
                                                                        border: '2px solid var(--color-border)',
                                                                        borderRadius: 'var(--radius-lg)',
                                                                        padding: 'var(--spacing-lg)',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        transition: 'all var(--transition-base)',
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
                                                                    {/* Room info */}
                                                                    <div>
                                                                        <h3 className="font-bold" style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xs)' }}>
                                                                            Room {room.room_number}
                                                                        </h3>
                                                                        <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginBottom: '0' }}>
                                                                            {room.current_occupants}/{room.capacity} beds taken
                                                                        </p>
                                                                    </div>

                                                                    {/* Book button */}
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        onClick={() => handleBooking(selectedHall.hall_id, room.room_id, room.room_number)}
                                                                    >
                                                                        Book
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </>
                                    )}
                                </div>
                            )}
                </div>
            </div>
        </div>
    );
}

// Export this component so it can be used in App.jsx
export default StudentDashboard