// ==================================================
// ADMINSTUDENTS.JSX — Student Records Page
// ==================================================
// This page shows all students currently living in the hall.
//
// It has TWO tabs:
//   1. "Live Students" — shows real-time data from the server
//      (pulled from room occupant lists)
//   2. "Offline Data" — shows data saved in the browser's localStorage
//      (this is the same functionality from persistent.jsx)
//
// WHY OFFLINE DATA?
//   The admin might lose internet. When the app fetches room data,
//   it saves a copy to localStorage. This tab reads that saved copy
//   so the admin can still see room/student info even without internet.

import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function AdminStudents() {
    // ===== GET DATA FROM PARENT (AdminLayout) =====
    const { hallData } = useOutletContext();

    // ===== LOCAL STATE =====
    const [searchTerm, setSearchTerm] = useState("");  // Search box text
    const [tab, setTab] = useState("live");            // Which tab is active: "live" or "offline"

    // ===== OFFLINE DATA (from localStorage) =====
    // This reads the saved room data from the browser's storage
    // Same logic as the original persistent.jsx component
    const [offlineData, setOfflineData] = useState(() => {
        const data = localStorage.getItem("hostel_rooms_data");
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : null;
        } catch {
            return null;
        }
    });

    // Re-read localStorage every 10 seconds to keep offline data fresh
    // (same auto-refresh as original persistent.jsx)
    useEffect(() => {
        const fetchInterval = setInterval(() => {
            const data = localStorage.getItem("hostel_rooms_data");
            try {
                const parsed = JSON.parse(data);
                setOfflineData(Array.isArray(parsed) ? parsed : null);
            } catch {
                setOfflineData(null);
            }
        }, 10000); // 10 seconds
        return () => clearInterval(fetchInterval);
    }, []);

    // ===== BUILD STUDENT LIST =====
    // For each room, grab all occupants and add the room number to each student
    const roomsList = hallData?.rooms || [];
    const allStudents = roomsList.flatMap(r =>
        (r.occupants_list || []).map(o => ({
            ...o,
            room_number: r.room_number,
            room_status: r.room_status,
            is_under_maintenance: r.is_under_maintenance,
        }))
    );

    // ===== SEARCH FILTER =====
    // Filter students by name, matric number, department, or room number
    const filteredStudents = allStudents.filter(st => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
            st.full_name?.toLowerCase().includes(q) ||
            st.matric_number?.toLowerCase().includes(q) ||
            st.department?.toLowerCase().includes(q) ||
            st.room_number?.toLowerCase().includes(q)
        );
    });

    // Get offline rooms that have at least one occupant
    const offlineRoomsWithOccupants = offlineData
        ? offlineData.filter(r => r.occupants_list && r.occupants_list.length > 0)
        : [];

    // Tab definitions
    const TABS = [
        ["live", "Live Students"],
        ["offline", "Offline Data"],
    ];

    // ===== RENDER THE PAGE =====
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

            {/* ── Page Header ── */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Student Records</h1>
                    <div className="admin-page-sub">View students allocated to rooms in your hall</div>
                </div>
            </div>

            {/* ── Tab Buttons ── */}
            <div className="admin-tabs">
                {TABS.map(([key, lbl]) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`admin-tab ${tab === key ? "active" : ""}`}
                    >
                        {lbl}
                    </button>
                ))}
            </div>

            <div style={{ flex: 1, overflow: "auto" }}>
                {/* ===== LIVE STUDENTS TAB ===== */}
                {tab === "live" && (
                    <>
                        {/* Student Stats Cards */}
                        <div className="admin-kpi-grid" style={{ padding: "20px 32px 0" }}>
                            {[
                                { label: "Total Students", val: allStudents.length, color: "var(--admin-navy)" },
                                { label: "Rooms with Students", val: roomsList.filter(r => r.current_occupants > 0).length, color: "var(--admin-blue)" },
                                { label: "Total Rooms", val: roomsList.length, color: "var(--admin-green)" },
                            ].map(st => (
                                <div key={st.label} className="admin-card admin-kpi" style={{ borderLeftColor: st.color, padding: "14px 18px" }}>
                                    <span className="admin-kpi-label" style={{ marginBottom: 6 }}>{st.label}</span>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: st.color }}>{st.val}</div>
                                </div>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="admin-filter-bar">
                            <input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search name, matric, department, or room..."
                                className="admin-input"
                                style={{ width: 300 }}
                            />
                        </div>

                        {/* Student Table */}
                        <div style={{ padding: "0 32px 32px" }}>
                            <div className="admin-card">
                                {filteredStudents.length > 0 ? (
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                {["Student", "Matric No.", "Department", "Level", "Room", "Status"].map(h => (
                                                    <th key={h}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map((st, i) => (
                                                <tr key={st.matric_number || i} style={{ animationDelay: `${i * 0.03}s` }}>
                                                    <td>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                            {/* Avatar with student initials */}
                                                            <div className="admin-avatar admin-avatar-male" style={{ width: 28, height: 28, fontSize: 10 }}>
                                                                {st.full_name ? st.full_name.split(" ").map(n => n[0]).join("").slice(0, 2) : "?"}
                                                            </div>
                                                            <span style={{ fontWeight: 600 }}>{st.full_name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ color: "var(--admin-navy)", fontFamily: "monospace", fontSize: 11 }}>{st.matric_number}</td>
                                                    <td style={{ color: "var(--admin-muted)", fontSize: 11 }}>{st.department}</td>
                                                    <td style={{ color: "var(--admin-muted)" }}>{st.level}</td>
                                                    <td style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--admin-navy)" }}>{st.room_number}</td>
                                                    <td>
                                                        <span className="admin-badge admin-badge-green">Allocated</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="admin-empty">
                                        {searchTerm ? "No students match your search." : "No students allocated yet."}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* ===== OFFLINE DATA TAB =====
                    This replaces the old persistent.jsx standalone page.
                    Shows room data saved in the browser's localStorage. */}
                {tab === "offline" && (
                    <div style={{ padding: 32 }}>
                        <div className="admin-card" style={{ marginBottom: 20 }}>
                            <div className="admin-card-header">
                                Offline Room Data
                                <span style={{ fontWeight: 400, fontSize: 11, color: "var(--admin-muted)", marginLeft: 12 }}>
                                    Cached in browser · Auto-refreshes every 10s
                                </span>
                            </div>
                            <div className="admin-card-body">
                                {offlineRoomsWithOccupants.length === 0 ? (
                                    <div className="admin-empty">No saved room data found.</div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {/* Show each room that has occupants */}
                                        {offlineRoomsWithOccupants.map(room => (
                                            <div key={room.room_number} className="admin-card" style={{ padding: "16px 20px", borderLeft: "3px solid var(--admin-blue)" }}>
                                                {/* Room info header */}
                                                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                                                    <div style={{ background: "#EFF6FF", color: "var(--admin-blue)", fontWeight: 700, fontSize: 14, padding: "8px 14px", borderRadius: 6 }}>
                                                        {room.room_number}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 11, color: "var(--admin-muted)" }}>Occupancy</div>
                                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{room.current_occupants} / {room.capacity}</div>
                                                    </div>
                                                    <span className={`admin-badge ${room.room_status === "available" || room.room_status === "Available" ? "admin-badge-green" : "admin-badge-red"}`}>
                                                        {room.room_status}
                                                    </span>
                                                </div>

                                                {/* List of residents in this room */}
                                                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--admin-muted)", marginBottom: 8, fontWeight: 600 }}>
                                                    Residents
                                                </div>
                                                {room.occupants_list.map(student => (
                                                    <div key={student.matric_number} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 8px", borderRadius: 6, fontSize: 12 }}>
                                                        <span style={{ fontWeight: 600, color: "var(--admin-text)", minWidth: 140 }}>{student.full_name}</span>
                                                        <span style={{ color: "var(--admin-muted)" }}>{student.matric_number}</span>
                                                        <span style={{ color: "var(--admin-muted)" }}>{student.department}</span>
                                                        <span style={{ color: "var(--admin-muted)" }}>Lvl {student.level}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Print button */}
                        <button
                            onClick={() => window.print()}
                            className="admin-btn admin-btn-primary"
                            style={{ padding: "10px 24px" }}
                        >
                            🖨 Print Offline Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
