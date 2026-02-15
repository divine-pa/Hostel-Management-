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
import { bookRoom } from "../services/auth";

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


    // ===== HANDLE ROOM BOOKING =====
    // This function runs when a student clicks "Select" on a hall
    const handleBooking = async (hall_id, hallName) => {
        // Step 1: Ask for confirmation (to prevent accidental clicks)
        if (!window.confirm(`Are you sure you want to book ${hallName}`)) {
            return  // If they click "Cancel", stop here
        }

        try {
            // Step 2: Show loading while booking
            setLoading(true)

            // Step 3: Get the student's matric number
            const user = JSON.parse(localStorage.getItem("user"))
            const matricparm = user.matriculation_number || user.matric_number

            // Step 4: Send the booking request to the server
            await bookRoom(matricparm, hall_id);

            // Step 5: Show success message
            alert("Room Booked Successfully")

            // Step 6: REFRESH THE DASHBOARD to show the new room
            const updateData = await getStudentDashboard(matricparm);
            setDashboardData(updateData);

        } catch (error) {
            // If booking failed, show error message
            console.error(error)
            alert(error.response?.data?.error || "Failed to book room")
        }
        finally {
            // Step 7: Stop showing loading (whether it succeeded or failed)
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

                            /* SCENARIO C: Payment verified but NO room yet (Show available halls) */
                            : (
                                <div>
                                    {/* Header: "Select a Hall" */}
                                    <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-lg)' }}>
                                        Select a Hall
                                    </h2>

                                    {/* Check if there are any halls available */}
                                    {available_halls.length === 0 ? (
                                        // No halls available
                                        <p className="text-error">No halls are currently available for your gender.</p>
                                    ) : (
                                        // Show the list of available halls
                                        <div className="grid grid-2">
                                            {/* Loop through each available hall */}
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

                                                    // HOVER EFFECT: When mouse hovers over, add shadow
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.boxShadow = 'none';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                    }}
                                                >
                                                    {/* Hall information */}
                                                    <div>
                                                        {/* Hall name */}
                                                        <h3 className="font-bold" style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xs)' }}>
                                                            {hall.hall_name}
                                                        </h3>

                                                        {/* How many rooms are left */}
                                                        <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginBottom: '0' }}>
                                                            {hall.available_rooms} rooms left
                                                        </p>
                                                    </div>

                                                    {/* SELECT BUTTON */}
                                                    {/* When clicked, book this hall */}
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

// Export this component so it can be used in App.jsx
export default StudentDashboard