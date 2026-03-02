// ==================================================
// ADMINLAYOUT.JSX — The "wrapper" for ALL admin pages
// ==================================================
// Think of this as the FRAME around every admin page.
// It provides:
//   1. The navy SIDEBAR on the left (with navigation links)
//   2. Data fetching from the server (so child pages don't have to)
//   3. A toast notification system (those green popup messages)
//
// HOW IT WORKS:
// - This component loads ONCE when the admin visits /admin
// - It fetches dashboard data from the backend using getAdminDashboard()
// - It passes that data DOWN to whichever child page is showing
//   (Dashboard, Rooms, Students, Reports, or Settings)
// - It uses React Router's <Outlet> to render the current child page

import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { getAdminDashboard, allocationGraph } from "../services/auth";
import "./admin.css";

export default function AdminLayout() {
    // navigate = tool to move between pages programmatically
    const navigate = useNavigate();

    // location = tells us what URL the user is currently on
    const location = useLocation();

    // ===== STATE VARIABLES =====
    // These hold data that the component needs to work with

    // dashboardData: ALL the data we get from the server (admin info + hall info)
    const [dashboardData, setDashboardData] = useState(null);

    // loading: true while we're waiting for data from the server
    const [loading, setLoading] = useState(true);

    // error: holds an error message if something goes wrong
    const [error, setError] = useState(null);

    // hallData: just the hall-specific data (rooms, stats, etc.)
    const [hallData, setHallData] = useState(null);

    // filteredRooms: the list of rooms currently being displayed (changes when searching)
    const [filteredRooms, setFilteredRooms] = useState([]);

    // chartData: data for the allocation trend line chart
    const [chartData, setChartData] = useState([]);

    // toast: the message shown in the green popup notification (null = hidden)
    const [toast, setToast] = useState(null);

    // rooms: room data saved in browser storage so it works offline too
    // This reads from localStorage on first load (same as original admindashboard.jsx)
    const [rooms, setRooms] = useState(() => {
        const savedRoom = localStorage.getItem("hostel_rooms_data");
        return savedRoom ? JSON.parse(savedRoom) : [];
    });

    // ===== TOAST HELPER =====
    // Shows a green popup message for 3.5 seconds then hides it
    const triggerToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    // ===== FETCH DASHBOARD DATA FROM SERVER =====
    // This function calls the backend API to get all admin data
    // It's the same function from the original admindashboard.jsx
    const fetchDashboardData = async () => {
        try {
            // Step 1: Check if admin is logged in (look for their info in browser storage)
            const userString = localStorage.getItem("Admin");
            if (!userString) {
                // Not logged in? Send them to the login page
                navigate("/adminlogin");
                return;
            }

            // Step 2: Get admin's email from stored data
            const admin = JSON.parse(userString);

            // Step 3: Call the API to get dashboard data
            const data = await getAdminDashboard(admin.email);
            setDashboardData(data);

            // Step 4: If the response includes hall details, save them
            if (data.hall_details) {
                setHallData(data.hall_details);
                setFilteredRooms(data.hall_details.rooms || []);
                setRooms(data.hall_details.rooms || []);
            }

            // Step 5: Done loading
            setLoading(false);
        } catch (err) {
            console.error("Dashboard Error:", err);
            setError("Failed to load dashboard data.");
            setLoading(false);

            // If server says "unauthorized", send them to login
            if (err.response && err.response.status === 401) {
                navigate("/adminlogin");
            }
        }
    };

    // ===== LOAD DATA WHEN PAGE FIRST OPENS =====
    // useEffect with [] runs ONCE when the component first appears
    useEffect(() => {
        fetchDashboardData();
    }, [navigate]);

    // ===== SAVE ROOM DATA TO BROWSER STORAGE =====
    // Whenever rooms change, save them to localStorage
    // This way the data is available even if the server goes offline
    useEffect(() => {
        if (hallData && hallData.rooms && hallData.rooms.length > 0) {
            localStorage.setItem("hostel_rooms_data", JSON.stringify(rooms));
        }
    }, [rooms]);

    // ===== AUTO-REFRESH EVERY 10 SECONDS =====
    // This keeps the dashboard data fresh without the admin having to reload
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            fetchDashboardData();
        }, 10000); // 10000ms = 10 seconds

        // Cleanup: stop the timer when the component is removed
        return () => clearInterval(refreshInterval);
    }, []);

    // ===== FETCH CHART DATA + REFRESH EVERY 60 SECONDS =====
    // The allocation trend chart needs its own data from a separate API
    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const graphData = await allocationGraph();
                setChartData(graphData);
            } catch (graphError) {
                console.error("Graph data fetch error:", graphError);
            }
        };
        fetchGraphData(); // Fetch immediately
        const graphInterval = setInterval(fetchGraphData, 60000); // Then every 60 seconds
        return () => clearInterval(graphInterval);
    }, []);

    // ===== LOGOUT FUNCTION =====
    // Removes admin data from storage and sends them to login page
    const handleLogout = () => {
        localStorage.removeItem("Admin");
        navigate("/adminlogin");
    };

    // ===== LOADING & ERROR SCREENS =====
    // Show these while data is being fetched or if something broke
    if (loading) return <div className="admin-loading">Loading Dashboard...</div>;
    if (error) return <div className="admin-loading" style={{ color: "#DC2626" }}>{error}</div>;
    if (!dashboardData) return null;

    // ===== EXTRACT DATA FROM RESPONSE =====
    // Pull out the admin's name, email, role, and hall details
    const { name, email, role, hall_details } = dashboardData;

    // ===== NAVIGATION ITEMS =====
    // These are the links that appear in the sidebar
    const NAV = [
        { key: "dashboard", path: "/admin", label: "Dashboard", icon: "◈" },
        { key: "rooms", path: "/admin/rooms", label: "Rooms", icon: "⊞" },
        { key: "students", path: "/admin/students", label: "Students", icon: "◉" },
        { key: "reports", path: "/admin/reports", label: "Reports", icon: "▦" },
        { key: "settings", path: "/admin/settings", label: "Settings", icon: "⚙" },
    ];

    // Figure out which nav item is currently active based on the URL
    const currentPath = location.pathname;
    const getActiveKey = () => {
        if (currentPath === "/admin" || currentPath === "/admin/") return "dashboard";
        const match = NAV.find(n => n.path !== "/admin" && currentPath.startsWith(n.path));
        return match ? match.key : "dashboard";
    };

    // Get admin's initials for the avatar circle (e.g., "John Doe" → "JD")
    const adminInitials = name
        ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
        : "AD";

    // ===== RENDER THE LAYOUT =====
    return (
        <div className="admin-root">

            {/* ── Toast Notification (green popup at top-right) ── */}
            {toast && (
                <div className="admin-toast">
                    <span>✓</span> {toast}
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
                SIDEBAR — The navy blue panel on the left
               ══════════════════════════════════════════════════════ */}
            <div className="admin-sidebar">
                {/* Decorative background patterns */}
                <div className="admin-sidebar-grid" />
                <div className="admin-sidebar-glow" />

                {/* Logo at the top of sidebar */}
                <div className="admin-sidebar-logo">
                    <div className="admin-logo-wrap">
                        <div className="admin-logo-icon">🏠</div>
                        <div>
                            <div className="admin-logo-text">HostelMS</div>
                            <div className="admin-logo-sub">Admin Portal</div>
                        </div>
                    </div>
                </div>

                {/* Navigation links */}
                <nav className="admin-nav">
                    {NAV.map(item => (
                        <button
                            key={item.key}
                            className={`admin-nav-item ${getActiveKey() === item.key ? "active" : ""}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Admin info and Sign Out button at bottom of sidebar */}
                <div className="admin-sidebar-footer">
                    <div className="admin-user-row">
                        <div className="admin-user-avatar">{adminInitials}</div>
                        <div>
                            <div className="admin-user-name">{name || "Admin"}</div>
                            <div className="admin-user-role">{role || "Hall Admin"}</div>
                        </div>
                    </div>
                    <button className="admin-signout-btn" onClick={handleLogout}>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                MAIN CONTENT AREA — Shows the current page
               ══════════════════════════════════════════════════════ */}
            <div className="admin-main">
                {/*
                  <Outlet> is a special React Router component.
                  It renders whichever child route is currently active.
                  
                  The "context" prop passes all our data DOWN to child pages.
                  Child pages can access this data using useOutletContext().
                  
                  This way, we fetch data ONCE here, and share it everywhere.
                */}
                <Outlet context={{
                    dashboardData,
                    hallData,
                    hall_details,
                    filteredRooms,
                    setFilteredRooms,
                    rooms,
                    setRooms,
                    chartData,
                    triggerToast,
                    fetchDashboardData,
                    name,
                    email,
                    role,
                }} />
            </div>
        </div>
    );
}
