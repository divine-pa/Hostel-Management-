// ==================================================
// ADMINROOMS.JSX — Room Management Page
// ==================================================
// This page lets the admin manage all rooms in their hall.
//
// FEATURES (all taken from the original admindashboard.jsx):
//   - Room stats cards (total, available, full, maintenance)
//   - Search bar to find rooms by room number, student name, or matric
//   - Filter buttons (All, Available, Full, Maintenance)
//   - Room table with occupancy bars and status badges
//   - "View" button to open room detail modal
//   - "Maint." button to toggle room maintenance status
//   - Room detail modal showing occupants and maintenance controls
//
// DATA SOURCE:
//   Gets room data from AdminLayout via useOutletContext()
//   Uses toggleRoomMaintenance() API to update maintenance status

import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toggleRoomMaintenance } from "../services/auth";

// ── Occupancy Bar (colored progress bar) ──
// Shows how full a room is: green → blue → orange → red
function OccBar({ pct }) {
    const color = pct >= 100 ? "var(--admin-red)" : pct > 85 ? "var(--admin-orange)" : pct > 75 ? "var(--admin-blue)" : "var(--admin-green)";
    return (
        <div className="admin-occ-bar-bg">
            <div className="admin-occ-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
        </div>
    );
}

export default function AdminRooms() {
    // ===== GET DATA FROM PARENT (AdminLayout) =====
    const { hallData, filteredRooms, setFilteredRooms, rooms, setRooms, triggerToast, fetchDashboardData } = useOutletContext();

    // ===== LOCAL STATE =====
    const [searchTerm, setSearchTerm] = useState("");       // What's typed in the search box
    const [filterStatus, setFilterStatus] = useState("All"); // Which filter button is active
    const [selectedRoom, setSelectedRoom] = useState(null);  // Which room's modal is open (null = closed)
    const [togglingRoom, setTogglingRoom] = useState(null);  // Which room is currently being toggled (for loading state)

    // Get ALL rooms from the hall data
    const allRooms = hallData?.rooms || [];

    // ===== SEARCH FUNCTION =====
    // This is the SAME search logic from the original admindashboard.jsx
    // It filters rooms by room number, student name, or matric number
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        // If search box is empty, show all rooms
        if (term === "") {
            setFilteredRooms(allRooms);
            return;
        }

        // Filter rooms: check if room number or any student's name/matric matches
        const results = allRooms.filter((room) => {
            const matchesRoomNumber = room.room_number.toLowerCase().includes(term);
            const matchesStudent = room.occupants_list.some((student) =>
                student.full_name.toLowerCase().includes(term) ||
                student.matric_number.toLowerCase().includes(term)
            );
            return matchesRoomNumber || matchesStudent;
        });
        setFilteredRooms(results);
    };

    // ===== APPLY STATUS FILTER ON TOP OF SEARCH =====
    // After search narrows down rooms, this further filters by status
    const getDisplayRooms = () => {
        let display = filteredRooms;
        if (filterStatus === "Available") {
            display = display.filter(r => !r.is_under_maintenance && r.current_occupants < r.capacity);
        } else if (filterStatus === "Full") {
            display = display.filter(r => r.current_occupants >= r.capacity);
        } else if (filterStatus === "Maintenance") {
            display = display.filter(r => r.is_under_maintenance);
        }
        return display;
    };

    const displayRooms = getDisplayRooms();

    // ===== TOGGLE MAINTENANCE =====
    // This is the SAME function from the original admindashboard.jsx
    // It calls the backend API to turn maintenance ON or OFF for a room
    const handleToggleMaintenance = async (roomId) => {
        try {
            // Show loading state for this room
            setTogglingRoom(roomId);

            // Get the admin's email from browser storage
            const userString = localStorage.getItem("Admin");
            const admin = JSON.parse(userString);
            const adminEmail = admin.email;

            // Call the API to toggle the maintenance status
            const response = await toggleRoomMaintenance(roomId, adminEmail);

            // Show a success toast message
            triggerToast(`${response.message} — Room: ${response.room_number}, Maintenance: ${response.is_under_maintenance ? "ON" : "OFF"}`);

            // Refresh all dashboard data to get updated room info
            await fetchDashboardData();
        } catch (error) {
            console.error("Error toggling maintenance:", error);
            const errorMsg = error.response?.data?.error || "Failed to toggle maintenance status";
            triggerToast(`Error: ${errorMsg}`);
        } finally {
            // Remove loading state regardless of success or failure
            setTogglingRoom(null);
        }
    };

    // ===== CALCULATE ROOM STATISTICS =====
    const stats = {
        total: allRooms.length,
        avail: allRooms.filter(r => !r.is_under_maintenance && r.current_occupants < r.capacity).length,
        full: allRooms.filter(r => r.current_occupants >= r.capacity).length,
        maint: allRooms.filter(r => r.is_under_maintenance).length,
    };

    // Helper functions to get room status label and badge color
    const statusLabel = (r) => r.is_under_maintenance ? "Maintenance" : r.current_occupants >= r.capacity ? "Full" : "Available";
    const statusBadge = (r) => r.is_under_maintenance ? "admin-badge-orange" : r.current_occupants >= r.capacity ? "admin-badge-red" : "admin-badge-green";

    // ===== RENDER THE PAGE =====
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

            {/* ── Page Header ── */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Room Management</h1>
                    <div className="admin-page-sub">Real-time room inventory — updates on every allocation</div>
                </div>
            </div>

            {/* ── Info Banner: How to use maintenance ── */}
            <div className="admin-banner">
                <span style={{ fontSize: 16, flexShrink: 0 }}>🔧</span>
                <span>
                    To mark a room under maintenance: click <strong>View</strong> on any room, then click <strong>Set Under Maintenance</strong>.
                    You can also toggle quickly using the <strong>🔧 Maint.</strong> button in the table.
                </span>
            </div>

            {/* ── Room Stats Cards ── */}
            <div className="admin-kpi-grid" style={{ padding: "20px 32px 0" }}>
                {[
                    { label: "Total Rooms", val: stats.total, color: "var(--admin-navy)" },
                    { label: "Available", val: stats.avail, color: "var(--admin-green)" },
                    { label: "Full", val: stats.full, color: "var(--admin-red)" },
                    { label: "Maintenance", val: stats.maint, color: "var(--admin-orange)" },
                ].map(st => (
                    <div key={st.label} className="admin-card admin-kpi" style={{ borderLeftColor: st.color, padding: "14px 18px" }}>
                        <span className="admin-kpi-label" style={{ marginBottom: 6 }}>{st.label}</span>
                        <div style={{ fontSize: 28, fontWeight: 800, color: st.color }}>{st.val}</div>
                    </div>
                ))}
            </div>

            {/* ── Search Bar + Filter Buttons ── */}
            <div className="admin-filter-bar">
                <input
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search room or student..."
                    className="admin-input"
                    style={{ width: 220 }}
                />
                {/* Filter buttons: clicking one highlights it and filters the table */}
                {["All", "Available", "Full", "Maintenance"].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilterStatus(f)}
                        className={`admin-btn ${filterStatus === f ? "admin-btn-primary" : "admin-btn-ghost"}`}
                        style={{ padding: "7px 14px", fontSize: 11 }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* ── Room Table ── */}
            <div style={{ flex: 1, overflow: "auto", padding: "0 32px 32px" }}>
                <div className="admin-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                {["Room", "Status", "Capacity", "Occupancy", "Maintenance", "Actions"].map(h => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayRooms.map((r, i) => {
                                // Calculate occupancy percentage for this room
                                const pct = r.capacity ? Math.round((r.current_occupants / r.capacity) * 100) : 0;
                                return (
                                    <tr key={r.room_id || i} style={{ animationDelay: `${i * 0.03}s` }}>
                                        {/* Room number */}
                                        <td style={{ fontWeight: 700, color: "var(--admin-navy)", fontFamily: "monospace" }}>{r.room_number}</td>

                                        {/* Status badge (green/red/orange) */}
                                        <td><span className={`admin-badge ${statusBadge(r)}`}>{statusLabel(r)}</span></td>

                                        {/* Capacity */}
                                        <td style={{ color: "var(--admin-muted)" }}>{r.capacity} beds</td>

                                        {/* Occupancy bar with percentage */}
                                        <td style={{ minWidth: 120 }}>
                                            <div style={{ fontSize: 11, color: "var(--admin-muted)", marginBottom: 4 }}>
                                                {r.current_occupants}/{r.capacity} · {pct}%
                                            </div>
                                            <OccBar pct={pct} />
                                        </td>

                                        {/* Maintenance indicator */}
                                        <td>
                                            {r.is_under_maintenance && (
                                                <span className="admin-badge admin-badge-orange">🔧 Yes</span>
                                            )}
                                        </td>

                                        {/* Action buttons */}
                                        <td>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                {/* View button: opens the room detail modal */}
                                                <button
                                                    onClick={() => setSelectedRoom(r)}
                                                    className="admin-btn admin-btn-ghost admin-btn-sm"
                                                    style={{ color: "var(--admin-navy)" }}
                                                >
                                                    View
                                                </button>

                                                {/* Maintenance toggle button: calls the API */}
                                                <button
                                                    onClick={() => handleToggleMaintenance(r.room_id)}
                                                    disabled={togglingRoom === r.room_id}
                                                    className="admin-btn admin-btn-ghost admin-btn-sm"
                                                    style={{
                                                        color: r.is_under_maintenance ? "var(--admin-green)" : "var(--admin-orange)",
                                                        opacity: togglingRoom === r.room_id ? 0.6 : 1,
                                                        cursor: togglingRoom === r.room_id ? "not-allowed" : "pointer",
                                                    }}
                                                >
                                                    {togglingRoom === r.room_id
                                                        ? "⏳..."
                                                        : r.is_under_maintenance
                                                            ? "✓ Available"
                                                            : "🔧 Maint."}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Show message if no rooms match the current filters */}
                    {displayRooms.length === 0 && (
                        <div className="admin-empty">No rooms match filters.</div>
                    )}
                </div>
            </div>

            {/* ===== ROOM DETAIL MODAL =====
                This popup appears when the admin clicks "View" on a room.
                It shows room info, occupancy, maintenance controls, and occupant list. */}
            {selectedRoom && (
                <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedRoom(null); }}>
                    <div className="admin-modal" style={{ width: 500 }}>

                        {/* Modal header with room number and close button */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                            <div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--admin-text)" }}>
                                    Room {selectedRoom.room_number}
                                </div>
                                <div style={{ fontSize: 11, color: "var(--admin-muted)", marginTop: 4 }}>
                                    {selectedRoom.room_status} · Capacity: {selectedRoom.capacity}
                                </div>
                            </div>
                            <button className="admin-modal-close" onClick={() => setSelectedRoom(null)}>×</button>
                        </div>

                        {/* Room stats (3 small cards) */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 22 }}>
                            {[
                                ["Capacity", `${selectedRoom.capacity} beds`, "var(--admin-border)"],
                                ["Occupied", `${selectedRoom.current_occupants}`, "var(--admin-blue)"],
                                ["Status", statusLabel(selectedRoom), statusBadge(selectedRoom).includes("green") ? "var(--admin-green)" : statusBadge(selectedRoom).includes("red") ? "var(--admin-red)" : "var(--admin-orange)"],
                            ].map(([k, v, col]) => (
                                <div key={k} className="admin-card" style={{ padding: "14px 16px", borderLeft: `3px solid ${col}` }}>
                                    <span className="admin-kpi-label">{k}</span>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: col === "var(--admin-border)" ? "var(--admin-navy)" : col }}>{v}</div>
                                </div>
                            ))}
                        </div>

                        {/* Occupancy bar for this room */}
                        <div style={{ marginBottom: 16 }}>
                            <OccBar pct={selectedRoom.capacity ? Math.round((selectedRoom.current_occupants / selectedRoom.capacity) * 100) : 0} />
                        </div>

                        {/* Maintenance toggle section */}
                        {selectedRoom.is_under_maintenance ? (
                            // Room IS under maintenance: show warning + "Mark Available" button
                            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-orange)", marginBottom: 2 }}>⚠ Under Maintenance</div>
                                    <div style={{ fontSize: 11, color: "var(--admin-muted)" }}>This room is hidden from students.</div>
                                </div>
                                <button
                                    onClick={() => handleToggleMaintenance(selectedRoom.room_id)}
                                    className="admin-btn admin-btn-primary"
                                    style={{ padding: "7px 14px", fontSize: 11, flexShrink: 0, marginLeft: 12 }}
                                >
                                    Mark Available
                                </button>
                            </div>
                        ) : (
                            // Room is NOT under maintenance: show "Set Under Maintenance" button
                            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                                <button
                                    onClick={() => handleToggleMaintenance(selectedRoom.room_id)}
                                    className="admin-btn admin-btn-ghost"
                                    style={{ padding: "7px 14px", fontSize: 11, color: "var(--admin-orange)" }}
                                >
                                    Set Under Maintenance
                                </button>
                            </div>
                        )}

                        {/* List of students currently in this room */}
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: "var(--admin-text)" }}>
                            Occupants ({selectedRoom.occupants_list ? selectedRoom.occupants_list.length : 0})
                        </div>
                        {(!selectedRoom.occupants_list || selectedRoom.occupants_list.length === 0) ? (
                            <div style={{ color: "var(--admin-muted)", fontSize: 12, padding: "16px 0" }}>No occupants yet.</div>
                        ) : (
                            selectedRoom.occupants_list.map(o => (
                                <div key={o.matric_number} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid var(--admin-border)", fontSize: 12 }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: "var(--admin-text)" }}>{o.full_name}</div>
                                        <div style={{ color: "var(--admin-muted)", fontSize: 11, marginTop: 2 }}>
                                            {o.matric_number} · {o.department} · Lvl {o.level}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
