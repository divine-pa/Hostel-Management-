// ==================================================
// ADMINDASHBOARD.JSX — Dashboard Overview Page
// ==================================================
// This is the FIRST page admins see when they log in.
// It shows a quick summary of everything happening in their hall:
//   - KPI cards (occupancy rate, students, available rooms, beds)
//   - Allocation trend chart (shows bookings over time)
//   - Hall statistics panel (blue gradient box with all key numbers)
//   - Room occupancy bars (visual bars showing how full each room is)
//   - Allocation summary (total rooms, available, full, maintenance)
//   - Recent occupants table (last students assigned to rooms)
//
// HOW DATA GETS HERE:
// This page does NOT fetch data itself.
// The AdminLayout.jsx wrapper fetches everything from the server,
// then passes it down through "Outlet context".
// We grab that data using useOutletContext() below.

import { useOutletContext } from "react-router-dom";
import AllocationTrend from "./Charts";

// ── Occupancy Bar Component ──
// A small colored progress bar that shows how full a room is
// Green = low, Blue = medium, Orange = getting full, Red = completely full
function OccBar({ pct }) {
    const color = pct >= 100 ? "var(--admin-red)" : pct > 85 ? "var(--admin-orange)" : pct > 75 ? "var(--admin-blue)" : "var(--admin-green)";
    return (
        <div className="admin-occ-bar-bg">
            <div className="admin-occ-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
        </div>
    );
}

export default function AdminDashboard() {
    // ===== GET DATA FROM PARENT (AdminLayout) =====
    // useOutletContext() grabs the data that AdminLayout passed down
    const { hall_details, hallData, chartData, rooms } = useOutletContext();

    // If there's no hall data (admin might not be assigned to a hall), show a message
    if (!hall_details) {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Dashboard Overview</h1>
                        <div className="admin-page-sub">No hall data available</div>
                    </div>
                </div>
                <div className="admin-page-content">
                    <p style={{ color: "var(--admin-muted)" }}>No hall has been assigned to this admin account.</p>
                </div>
            </div>
        );
    }

    // ===== EXTRACT VALUES FROM API DATA =====
    // Pull out specific numbers from the hall_details object
    // The "|| 0" means "if the value is missing, use 0 instead"
    const totalRooms = hall_details.total_rooms || 0;
    const availableRooms = hall_details.available_rooms || 0;
    const totalStudents = hall_details.total_students_in_hall || 0;
    const occupancyRate = hall_details.occupancy_rate || "0%";
    const trueAvailableBeds = hall_details.true_available_beds || 0;
    const roomsUnderMaint = hall_details.rooms_under_maintenance || 0;
    const hallName = hall_details.hall_name || "Hall";
    const gender = hall_details.gender || "—";
    const roomsList = hallData?.rooms || [];

    // ===== CALCULATE BED STATISTICS =====
    // Add up ALL beds across ALL rooms
    const totalBeds = roomsList.reduce((a, r) => a + (r.capacity || 0), 0);
    // Add up how many beds are currently occupied
    const occupied = roomsList.reduce((a, r) => a + (r.current_occupants || 0), 0);

    // ===== GET ALL STUDENTS LIVING IN ROOMS =====
    // This flattens all occupant lists from all rooms into one big list
    // and adds the room number to each student so we know which room they're in
    const allOccupants = roomsList.flatMap(r => (r.occupants_list || []).map(o => ({ ...o, room: r.room_number })));

    // ===== KPI CARD DATA =====
    // Each KPI card shows a label, value, subtitle, color, and icon
    const kpis = [
        { label: "Occupancy Rate", val: occupancyRate, sub: `${occupied}/${totalBeds} beds filled`, color: "var(--admin-green)", icon: "📊" },
        { label: "Total Students", val: totalStudents, sub: `in ${hallName}`, color: "var(--admin-blue)", icon: "👥" },
        { label: "Rooms Available", val: availableRooms, sub: `${roomsUnderMaint} in maintenance`, color: "var(--admin-green)", icon: "🏠" },
        { label: "True Available Beds", val: trueAvailableBeds, sub: `of ${totalBeds} total beds`, color: "var(--admin-navy)", icon: "🛏️" },
    ];

    // Get the 5 most recent occupants (reverse to show newest first)
    const recentOccupants = allOccupants.slice(-5).reverse();

    // ===== RENDER THE PAGE =====
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

            {/* ── Page Header (top bar with title) ── */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Dashboard Overview</h1>
                    <div className="admin-page-sub">{hallName} · {gender} · Real-time data</div>
                </div>
            </div>

            {/* ── Scrollable Content Area ── */}
            <div className="admin-page-content">

                {/* ===== KPI CARDS ROW =====
                    4 cards in a grid showing the most important numbers */}
                <div className="admin-kpi-grid">
                    {kpis.map((k, i) => (
                        <div key={k.label} className="admin-card admin-kpi" style={{ borderLeftColor: k.color, animationDelay: `${i * 0.07}s` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                <span className="admin-kpi-label">{k.label}</span>
                                <span className="admin-kpi-icon">{k.icon}</span>
                            </div>
                            <div className="admin-kpi-value" style={{ color: k.color }}>{k.val}</div>
                            <div className="admin-kpi-sub">{k.sub}</div>
                        </div>
                    ))}
                </div>

                {/* ===== ALLOCATION TREND CHART =====
                    Line chart showing allocation activity over time
                    Uses the Charts.jsx component with data from allocationGraph() API */}
                <div className="admin-card" style={{ marginBottom: 24 }}>
                    <div className="admin-card-header">Allocation Trend</div>
                    <div className="admin-card-body">
                        <AllocationTrend data={chartData} />
                    </div>
                </div>

                {/* ===== TWO-COLUMN LAYOUT: Hall Stats + Allocation Summary ===== */}
                <div className="admin-grid-2">

                    {/* ── Left Column: Hall Statistics ── */}
                    <div className="admin-card">
                        <div className="admin-card-header">Hall Statistics</div>
                        <div className="admin-card-body">

                            {/* Blue gradient box with key hall numbers */}
                            <div style={{ background: "linear-gradient(135deg, var(--admin-navy) 0%, #1e40af 100%)", color: "white", padding: 24, borderRadius: 10, marginBottom: 16 }}>
                                <h3 style={{ fontSize: 20, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, marginTop: 0 }}>
                                    {hallName}
                                </h3>
                                {/* Grid of 6 stat boxes */}
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 12 }}>
                                    {[
                                        ["Gender", gender],
                                        ["Total Rooms", totalRooms],
                                        ["Available", availableRooms],
                                        ["Students", totalStudents],
                                        ["Maintenance", roomsUnderMaint],
                                        ["Avail. Beds", trueAvailableBeds],
                                    ].map(([lbl, val]) => (
                                        <div key={lbl} style={{ background: "rgba(255,255,255,0.1)", padding: "12px 14px", borderRadius: 8 }}>
                                            <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 4 }}>{lbl}</div>
                                            <div style={{ fontSize: 20, fontWeight: 700 }}>{val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Room-level occupancy bars (shows first 8 rooms) */}
                            {roomsList.slice(0, 8).map((room, i) => {
                                // Calculate the percentage: (current / capacity) × 100
                                const pct = room.capacity ? Math.round((room.current_occupants / room.capacity) * 100) : 0;
                                return (
                                    <div key={room.room_id || i} style={{ marginBottom: 14 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                {/* Room number */}
                                                <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "var(--admin-navy)" }}>
                                                    {room.room_number}
                                                </span>
                                                {/* Show wrench icon if room is under maintenance */}
                                                {room.is_under_maintenance && (
                                                    <span className="admin-badge admin-badge-orange" style={{ fontSize: 8, padding: "1px 6px" }}>🔧</span>
                                                )}
                                            </div>
                                            {/* Occupancy numbers and percentage */}
                                            <span style={{ fontSize: 12, color: "var(--admin-muted)" }}>
                                                {room.current_occupants}/{room.capacity} · <span style={{ color: pct >= 100 ? "var(--admin-red)" : pct > 50 ? "var(--admin-orange)" : "var(--admin-green)", fontWeight: 600 }}>{pct}%</span>
                                            </span>
                                        </div>
                                        {/* The colored progress bar */}
                                        <OccBar pct={pct} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Right Column: Allocation Summary ── */}
                    <div className="admin-card">
                        <div className="admin-card-header">Allocation Summary</div>
                        <div className="admin-card-body">
                            {/* Room status breakdown — count full rooms properly */}
                            {(() => {
                                const fullRooms = roomsList.filter(r => !r.is_under_maintenance && r.capacity > 0 && r.current_occupants >= r.capacity).length;
                                return [
                                    ["Total Rooms", totalRooms, "var(--admin-navy)"],
                                    ["Available Rooms", availableRooms, "var(--admin-green)"],
                                    ["Full Rooms", fullRooms, "var(--admin-red)"],
                                    ["Under Maintenance", roomsUnderMaint, "var(--admin-orange)"],
                                ];
                            })().map(([lbl, cnt, col]) => (
                                <div key={lbl} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--admin-border)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        {/* Colored dot */}
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />
                                        <span style={{ fontSize: 13, color: "var(--admin-text)" }}>{lbl}</span>
                                    </div>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: col, minWidth: 20, textAlign: "right" }}>{cnt}</span>
                                </div>
                            ))}

                            {/* Bed occupancy breakdown */}
                            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--admin-border)" }}>
                                <span className="admin-label" style={{ marginBottom: 12, display: "block" }}>Occupancy Breakdown</span>
                                {[
                                    ["Occupied Beds", occupied, "var(--admin-blue)"],
                                    ["Empty Beds", trueAvailableBeds, "var(--admin-green)"],
                                ].map(([lbl, cnt, col]) => (
                                    <div key={lbl} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 12 }}>
                                        <span style={{ color: "var(--admin-muted)" }}>{lbl}</span>
                                        <span style={{ color: col, fontWeight: 600 }}>{cnt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== RECENT OCCUPANTS TABLE =====
                    Shows the last 5 students assigned to rooms */}
                <div className="admin-card">
                    <div className="admin-card-header">Current Room Occupants</div>
                    {recentOccupants.length > 0 ? (
                        <div className="admin-table-scroll">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    {["Student", "Matric No.", "Department", "Level", "Room"].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentOccupants.map((st, i) => (
                                    <tr key={st.matric_number || i} style={{ animationDelay: `${i * 0.05}s` }}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                {/* Avatar circle with student's initials */}
                                                <div className="admin-avatar admin-avatar-male" style={{ width: 28, height: 28, fontSize: 10 }}>
                                                    {st.full_name ? st.full_name.split(" ").map(n => n[0]).join("").slice(0, 2) : "?"}
                                                </div>
                                                <span style={{ fontWeight: 600, color: "var(--admin-text)" }}>{st.full_name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: "var(--admin-navy)", fontFamily: "monospace", fontSize: 11 }}>{st.matric_number}</td>
                                        <td style={{ color: "var(--admin-muted)" }}>{st.department}</td>
                                        <td style={{ color: "var(--admin-muted)" }}>{st.level}</td>
                                        <td style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--admin-navy)" }}>{st.room}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    ) : (
                        // If no occupants, show a message
                        <div className="admin-empty">No occupants to display.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
