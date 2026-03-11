// ==================================================
// ADMINREPORTS.JSX — Reports & Analytics Page
// ==================================================
// This page provides reporting and analytics features.
//
// It has FOUR tabs:
//   1. "Occupancy" — shows room-by-room occupancy with progress bars
//   2. "Students" — shows room status + occupancy summary
//   3. "Effectiveness" — shows system metrics (how well allocation works)
//   4. "Receipts" — the FULL adminReceipts.jsx functionality
//      (search, expand receipt details, PDF download)
//
// The RECEIPTS tab is the most important one:
//   It loads all student receipts from the backend using getAdminReceipts()
//   and lets the admin search, view details, and download PDFs.
//   This is the SAME functionality from the original adminReceipts.jsx page.

import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getAdminReceipts } from "../services/auth";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReceiptDocument from "./ReceiptDocument";

// ── Occupancy Bar (colored progress bar) ──
function OccBar({ pct }) {
    const color = pct >= 100 ? "var(--admin-red)" : pct > 85 ? "var(--admin-orange)" : pct > 75 ? "var(--admin-blue)" : "var(--admin-green)";
    return (
        <div className="admin-occ-bar-bg">
            <div className="admin-occ-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
        </div>
    );
}

export default function AdminReports() {
    const navigate = useNavigate();
    // Get shared data from AdminLayout
    const { hallData, rooms, triggerToast } = useOutletContext();

    // Which tab is currently shown
    const [tab, setTab] = useState("occupancy");

    // ===== RECEIPTS STATE (all from original adminReceipts.jsx) =====
    const [receiptsLoading, setReceiptsLoading] = useState(true);   // Waiting for receipt data?
    const [receiptsError, setReceiptsError] = useState(null);       // Error message if fetch fails
    const [receiptStudents, setReceiptStudents] = useState([]);     // All receipts from server
    const [filteredReceipts, setFilteredReceipts] = useState([]);   // Receipts after search filter
    const [receiptSearch, setReceiptSearch] = useState("");         // What's typed in receipt search
    const [expandedReceipt, setExpandedReceipt] = useState(null);  // Which receipt is expanded (null = none)

    // ===== LOAD RECEIPTS FROM SERVER =====
    // This is the SAME logic from the original adminReceipts.jsx
    // It calls getAdminReceipts(email) to get all receipts for this admin's hall
    useEffect(() => {
        const loadReceipts = async () => {
            try {
                // Step 1: Check if admin is logged in
                const userString = localStorage.getItem("Admin");
                if (!userString) {
                    navigate("/adminlogin");
                    return;
                }

                // Step 2: Get admin email and fetch receipts
                const admin = JSON.parse(userString);
                const data = await getAdminReceipts(admin.email);

                // Step 3: Save receipt data
                setReceiptStudents(data);
                setFilteredReceipts(data);
                setReceiptsLoading(false);
            } catch (err) {
                console.error("Error loading receipts:", err);
                setReceiptsError("Failed to load student receipts.");
                setReceiptsLoading(false);
                // If unauthorized, redirect to login
                if (err.response && err.response.status === 401) {
                    navigate("/adminlogin");
                }
            }
        };
        loadReceipts();
    }, [navigate]);

    // ===== RECEIPT SEARCH =====
    // Filter receipts by student name, matric number, or room number
    // Same logic as original adminReceipts.jsx
    const handleReceiptSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setReceiptSearch(term);
        if (term === "") {
            setFilteredReceipts(receiptStudents);
            return;
        }
        const results = receiptStudents.filter(s =>
            s.full_name.toLowerCase().includes(term) ||
            s.matric_no.toLowerCase().includes(term) ||
            s.room_number.toLowerCase().includes(term)
        );
        setFilteredReceipts(results);
    };

    // Toggle receipt expansion (click to show/hide receipt details)
    const toggleReceipt = (receiptNo) => {
        setExpandedReceipt(prev => prev === receiptNo ? null : receiptNo);
    };

    // Get initials from a name (e.g., "James Okeke" → "JO")
    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(" ");
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0][0].toUpperCase();
    };

    // ===== COMPUTE STATISTICS FROM REAL API DATA =====
    const roomsList = hallData?.rooms || [];
    const totalBeds = roomsList.reduce((a, r) => a + (r.capacity || 0), 0);
    const occupied = roomsList.reduce((a, r) => a + (r.current_occupants || 0), 0);
    const occRate = totalBeds ? Math.round((occupied / totalBeds) * 100) : 0;
    const totalStudents = roomsList.reduce((a, r) => a + (r.occupants_list?.length || 0), 0);
    const totalRooms = roomsList.length;
    const availRooms = roomsList.filter(r => !r.is_under_maintenance && r.current_occupants < r.capacity).length;
    const maintRooms = roomsList.filter(r => r.is_under_maintenance).length;
    const fullRooms = roomsList.filter(r => r.current_occupants >= r.capacity).length;

    // Tab definitions
    const TABS = [
        ["occupancy", "Occupancy"],
        ["students", "Students"],
        ["effectiveness", "Effectiveness"],
        ["receipts", "Receipts"],
    ];

    // ===== RENDER THE PAGE =====
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

            {/* ── Page Header ── */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Reports & Analytics</h1>
                    <div className="admin-page-sub">System effectiveness, occupancy metrics & student receipts</div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="admin-btn admin-btn-ghost" onClick={() => window.print()}>🖨 Print</button>
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

            <div style={{ flex: 1, overflow: "auto", padding: 32 }}>

                {/* ═══════════════════════════════════════════
                    TAB 1: OCCUPANCY
                    Shows room-by-room occupancy with progress bars
                   ═══════════════════════════════════════════ */}
                {tab === "occupancy" && (
                    <>
                        {/* KPI cards */}
                        <div className="admin-kpi-grid">
                            {[
                                { label: "Overall Occupancy", val: `${occRate}%`, color: occRate > 80 ? "var(--admin-red)" : "var(--admin-green)" },
                                { label: "Total Beds", val: totalBeds, color: "var(--admin-blue)" },
                                { label: "Beds Occupied", val: occupied, color: "var(--admin-navy)" },
                                { label: "Beds Free", val: totalBeds - occupied, color: "var(--admin-green)" },
                            ].map(k => (
                                <div key={k.label} className="admin-card admin-kpi" style={{ borderLeftColor: k.color }}>
                                    <span className="admin-kpi-label" style={{ marginBottom: 8 }}>{k.label}</span>
                                    <div style={{ fontSize: 32, fontWeight: 800, color: k.color }}>{k.val}</div>
                                </div>
                            ))}
                        </div>

                        {/* Room-by-room occupancy list */}
                        <div className="admin-card">
                            <div className="admin-card-header">Room-by-Room Occupancy</div>
                            <div className="admin-card-body">
                                {roomsList.map((room, i) => {
                                    const pct = room.capacity ? Math.round((room.current_occupants / room.capacity) * 100) : 0;
                                    return (
                                        <div key={room.room_id || i} style={{ marginBottom: 18 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 13 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--admin-navy)" }}>{room.room_number}</span>
                                                    {room.is_under_maintenance && <span className="admin-badge admin-badge-orange" style={{ fontSize: 8, padding: "1px 6px" }}>🔧</span>}
                                                </div>
                                                <span style={{ color: "var(--admin-muted)" }}>
                                                    {room.current_occupants}/{room.capacity} ·{" "}
                                                    <span style={{ color: pct >= 100 ? "var(--admin-red)" : pct > 50 ? "var(--admin-orange)" : "var(--admin-green)", fontWeight: 600 }}>{pct}%</span>
                                                </span>
                                            </div>
                                            <OccBar pct={pct} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {/* ═══════════════════════════════════════════
                    TAB 2: STUDENTS
                    Shows room status and occupancy summaries
                   ═══════════════════════════════════════════ */}
                {tab === "students" && (
                    <div className="admin-grid-equal">
                        {/* Room Status card — percentages are out of total ROOMS */}
                        <div className="admin-card">
                            <div className="admin-card-header">Room Status</div>
                            <div className="admin-card-body">
                                {[
                                    ["Available", availRooms, "var(--admin-green)"],
                                    ["Full", fullRooms, "var(--admin-red)"],
                                    ["Under Maintenance", maintRooms, "var(--admin-orange)"],
                                ].map(([lbl, cnt, col]) => {
                                    const pct = totalRooms ? Math.round((cnt / totalRooms) * 100) : 0;
                                    return (
                                        <div key={lbl} style={{ marginBottom: 18 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                                                <span style={{ color: "var(--admin-text)" }}>{lbl}</span>
                                                <span style={{ color: col, fontWeight: 600 }}>
                                                    {cnt} of {totalRooms} rooms ({pct}%)
                                                </span>
                                            </div>
                                            <OccBar pct={pct} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Occupancy Summary card — percentages are out of total BEDS */}
                        <div className="admin-card">
                            <div className="admin-card-header">Occupancy Summary</div>
                            <div className="admin-card-body">
                                {[
                                    ["Total Students", totalStudents, "var(--admin-navy)"],
                                    ["Beds Occupied", occupied, "var(--admin-blue)"],
                                    ["Beds Free", totalBeds - occupied, "var(--admin-green)"],
                                ].map(([lbl, cnt, col]) => {
                                    const pct = totalBeds ? Math.round((cnt / totalBeds) * 100) : 0;
                                    return (
                                        <div key={lbl} style={{ marginBottom: 18 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                                                <span style={{ color: "var(--admin-text)" }}>{lbl}</span>
                                                <span style={{ color: col, fontWeight: 600 }}>
                                                    {cnt} of {totalBeds} beds ({pct}%)
                                                </span>
                                            </div>
                                            <OccBar pct={pct} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════
                    TAB 3: EFFECTIVENESS
                    Shows system performance metrics
                   ═══════════════════════════════════════════ */}
                {tab === "effectiveness" && (
                    <div className="admin-grid-equal">
                        {/* Room utilization breakdown */}
                        <div className="admin-card">
                            <div className="admin-card-header">Room Utilization</div>
                            <div className="admin-card-body">
                                {[
                                    ["Available (Not Full, Not Maint.)", availRooms, totalRooms, "var(--admin-green)"],
                                    ["Full Rooms", fullRooms, totalRooms, "var(--admin-red)"],
                                    ["Under Maintenance", maintRooms, totalRooms, "var(--admin-orange)"],
                                    ["Occupancy Rate", occupied, totalBeds, "var(--admin-blue)"],
                                ].map(([rule, pass, total, col]) => (
                                    <div key={rule} style={{ marginBottom: 18 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                                            <span style={{ color: "var(--admin-text)" }}>{rule}</span>
                                            <span style={{ color: col, fontWeight: 600 }}>{total ? Math.round((pass / total) * 100) : 0}%</span>
                                        </div>
                                        <OccBar pct={total ? Math.round((pass / total) * 100) : 0} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* System metrics (hardcoded display values) */}
                        <div className="admin-card">
                            <div className="admin-card-header">System Metrics</div>
                            <div className="admin-card-body">
                                {[
                                    ["Allocation Engine", "Rule-Based v1.0", "var(--admin-green)"],
                                    ["E-Receipt Delivery", "100%", "var(--admin-green)"],
                                    ["Avg. Allocation Time", "< 2s", "var(--admin-blue)"],
                                    ["System Uptime", "99.9%", "var(--admin-green)"],
                                    ["Auto-Refresh Interval", "10s", "var(--admin-navy)"],
                                ].map(([k, v, col]) => (
                                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--admin-border)", fontSize: 13 }}>
                                        <span style={{ color: "var(--admin-muted)" }}>{k}</span>
                                        <span style={{ color: col, fontWeight: 700 }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════
                    TAB 4: RECEIPTS
                    This is the FULL adminReceipts.jsx functionality:
                    - Search by name, matric, or room
                    - View receipt details (expandable)
                    - Download receipt as PDF
                   ═══════════════════════════════════════════ */}
                {tab === "receipts" && (
                    <div>
                        {/* Show loading while receipts are being fetched */}
                        {receiptsLoading ? (
                            <div className="admin-empty">Loading student receipts...</div>
                        ) : receiptsError ? (
                            <div className="admin-empty" style={{ color: "var(--admin-red)" }}>{receiptsError}</div>
                        ) : (
                            <>
                                {/* Receipt search bar */}
                                <input
                                    type="text"
                                    placeholder="Search by name, matric number, or room..."
                                    value={receiptSearch}
                                    onChange={handleReceiptSearch}
                                    className="admin-input"
                                    style={{ maxWidth: 400, marginBottom: 20 }}
                                />

                                {filteredReceipts.length === 0 ? (
                                    <div className="admin-empty">No student receipts found.</div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {/* Each receipt card */}
                                        {filteredReceipts.map(student => (
                                            <div key={student.receipt_no} className="admin-card" style={{ padding: "16px 22px" }}>

                                                {/* Student info header (avatar + name + meta) */}
                                                <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 12, borderBottom: "1px solid var(--admin-border)" }}>
                                                    <div className="admin-avatar admin-avatar-male" style={{ width: 44, height: 44, fontSize: 14 }}>
                                                        {getInitials(student.full_name)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)" }}>{student.full_name}</div>
                                                        <div style={{ fontSize: 11, color: "var(--admin-muted)", marginTop: 2 }}>
                                                            {student.matric_no} · {student.department} · Lvl {student.level}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Room info row */}
                                                <div style={{ display: "flex", gap: 24, padding: "10px 0", flexWrap: "wrap" }}>
                                                    {[["Room", student.room_number], ["Hall", student.hall_name], ["Gender", student.gender]].map(([lbl, val]) => (
                                                        <div key={lbl}>
                                                            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--admin-light)", fontWeight: 600 }}>{lbl}</div>
                                                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)", marginTop: 2 }}>{val}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Action buttons: View Receipt + Download PDF */}
                                                <div style={{ display: "flex", gap: 8, paddingTop: 10, flexWrap: "wrap" }}>
                                                    {/* Toggle button to expand/collapse receipt details */}
                                                    <button
                                                        className="admin-btn admin-btn-ghost admin-btn-sm"
                                                        style={{ color: "var(--admin-blue)" }}
                                                        onClick={() => toggleReceipt(student.receipt_no)}
                                                    >
                                                        {expandedReceipt === student.receipt_no ? "▲ Hide Receipt" : "▼ View Receipt"}
                                                    </button>

                                                    {/* PDF download link using @react-pdf/renderer */}
                                                    <PDFDownloadLink
                                                        document={<ReceiptDocument data={student} />}
                                                        fileName={`BU-Receipt_${student.matric_no}.pdf`}
                                                        style={{
                                                            padding: "4px 10px",
                                                            borderRadius: 7,
                                                            fontSize: 10,
                                                            fontWeight: 600,
                                                            background: "var(--admin-navy)",
                                                            color: "#fff",
                                                            textDecoration: "none",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            letterSpacing: "0.05em",
                                                        }}
                                                    >
                                                        {({ loading: pdfLoading }) => pdfLoading ? "Generating..." : "⬇ Download PDF"}
                                                    </PDFDownloadLink>
                                                </div>

                                                {/* Expanded Receipt Detail Section
                                                    Shows only when the admin clicks "View Receipt" */}
                                                {expandedReceipt === student.receipt_no && (
                                                    <div style={{ marginTop: 12, padding: "14px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid var(--admin-border)", animation: "adminFadeUp 0.2s ease" }}>
                                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                                                            {[
                                                                ["Receipt No", student.receipt_no],
                                                                ["Transaction Ref", student.transaction_reference],
                                                                ["Amount Paid", `₦${student.amount_paid}`],
                                                                ["Allocation Date", student.allocation_date ? new Date(student.allocation_date).toLocaleDateString() : "N/A"],
                                                                ["Status", student.status],
                                                                ["Email", student.email],
                                                                ["Phone", student.phone_number || "N/A"],
                                                                ["Address", student.house_address || "N/A"],
                                                            ].map(([lbl, val]) => (
                                                                <div key={lbl}>
                                                                    <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--admin-light)", fontWeight: 600 }}>{lbl}</div>
                                                                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--admin-text)", marginTop: 2 }}>{val}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
