// ==================================================
// ADMINSETTINGS.JSX — Settings Page
// ==================================================
// This page lets the admin configure system preferences.
//
// ⚠ IMPORTANT: This page is mostly FRONTEND-ONLY (cosmetic).
// The toggles and forms do NOT connect to the backend API.
// They are here for demo/presentation purposes.
//
// WHAT ACTUALLY WORKS:
//   - Admin Profile section shows real data (name, email, role)
//     from the getAdminDashboard() API response
//
// WHAT IS FRONTEND-ONLY (no backend):
//   - Booking Open / Auto-Allocate toggles (reset on page reload)
//   - Change Password form (just shows a toast message)
//   - System Info (static/hardcoded text)
//   - Danger Zone buttons (just show toast messages)
//
// THREE TABS:
//   1. "General" — system toggles + admin profile
//   2. "Security" — change password form
//   3. "System" — system info + danger zone

import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function AdminSettings() {
    // ===== GET DATA FROM PARENT (AdminLayout) =====
    // triggerToast = function to show popup messages
    // name, email, role = admin's real info from the API
    const { triggerToast, name, email, role } = useOutletContext();

    // ===== LOCAL STATE =====
    const [tab, setTab] = useState("general");      // Which tab is active
    const [bookingOpen, setBookingOpen] = useState(true);  // Toggle: is booking open?
    const [autoAlloc, setAutoAlloc] = useState(true);      // Toggle: auto-allocate on payment?

    // Tab definitions
    const TABS = [
        ["general", "General"],
        ["security", "Security"],
        ["system", "System"],
    ];

    // ===== TOGGLE SWITCH COMPONENT =====
    // A sliding ON/OFF switch (purely visual, no backend)
    const Toggle = ({ checked, onChange }) => (
        <button
            onClick={() => onChange(!checked)}
            className={`admin-toggle ${checked ? "on" : "off"}`}
        >
            <span className="admin-toggle-knob" />
        </button>
    );

    // ===== RENDER THE PAGE =====
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

            {/* ── Page Header ── */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">System Settings</h1>
                    <div className="admin-page-sub">Configure allocation rules, security and system preferences</div>
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
                    GENERAL TAB
                    System toggles + admin profile info
                   ═══════════════════════════════════════════ */}
                {tab === "general" && (
                    <div style={{ maxWidth: 560 }}>

                        {/* System Controls Card */}
                        <div className="admin-card" style={{ padding: 28, marginBottom: 20 }}>
                            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--admin-text)", marginBottom: 20 }}>System Controls</div>
                            {[
                                { label: "Booking Open", sub: "Allow students to submit room allocation requests", val: bookingOpen, set: setBookingOpen },
                                { label: "Auto-Allocate on Payment", sub: "Automatically run allocation when payment is verified", val: autoAlloc, set: setAutoAlloc },
                            ].map(item => (
                                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--admin-border)" }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--admin-text)" }}>{item.label}</div>
                                        <div style={{ fontSize: 11, color: "var(--admin-muted)", marginTop: 3 }}>{item.sub}</div>
                                    </div>
                                    {/* The toggle switch */}
                                    <Toggle checked={item.val} onChange={item.set} />
                                </div>
                            ))}
                        </div>

                        {/* Admin Profile Card (shows REAL data from API) */}
                        <div className="admin-card" style={{ padding: 28 }}>
                            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--admin-text)", marginBottom: 20 }}>Admin Profile</div>
                            {[
                                ["Admin Name", name || ""],
                                ["Email", email || ""],
                                ["Role", role || ""],
                            ].map(([k, v]) => (
                                <div key={k} style={{ marginBottom: 16 }}>
                                    <label className="admin-label">{k}</label>
                                    {/* readOnly = can't be edited, just for display */}
                                    <input defaultValue={v} className="admin-input" readOnly style={{ background: "#f8fafc" }} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════
                    SECURITY TAB
                    Change password form (frontend-only for now)
                   ═══════════════════════════════════════════ */}
                {tab === "security" && (
                    <div style={{ maxWidth: 500 }}>
                        <div className="admin-card" style={{ padding: 28 }}>
                            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--admin-text)", marginBottom: 22 }}>Change Password</div>
                            {/* Password input fields */}
                            {["Current Password", "New Password", "Confirm New Password"].map(lbl => (
                                <div key={lbl} style={{ marginBottom: 16 }}>
                                    <label className="admin-label">{lbl}</label>
                                    <input type="password" placeholder="••••••••" className="admin-input" />
                                </div>
                            ))}
                            {/* Submit button (just shows a toast, no backend call) */}
                            <button
                                onClick={() => triggerToast("Password change feature coming soon")}
                                className="admin-btn admin-btn-primary"
                                style={{ padding: "10px 24px" }}
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════
                    SYSTEM TAB
                    System info + danger zone actions
                   ═══════════════════════════════════════════ */}
                {tab === "system" && (
                    <div style={{ maxWidth: 560 }}>

                        {/* System Information Card (all hardcoded values) */}
                        <div className="admin-card" style={{ padding: 28, marginBottom: 20 }}>
                            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--admin-text)", marginBottom: 20 }}>System Information</div>
                            {[
                                ["System Version", "HostelMS v1.0.0"],
                                ["Last Backup", "Today, 03:00 AM"],
                                ["Server Status", "Online"],
                                ["Allocation Engine", "Rule-Based v1.0"],
                                ["Auto-Refresh", "10 seconds"],
                            ].map(([k, v]) => (
                                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--admin-border)", fontSize: 13 }}>
                                    <span style={{ color: "var(--admin-muted)" }}>{k}</span>
                                    <span style={{
                                        color: (k === "Server Status" || k === "Allocation Engine") ? "var(--admin-green)" : "var(--admin-text)",
                                        fontWeight: (v === "Online" || v.includes("Rule")) ? 600 : 400,
                                    }}>{v}</span>
                                </div>
                            ))}
                        </div>

                        {/* Danger Zone Card */}
                        <div className="admin-card">
                            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--admin-text)", padding: "16px 24px", borderBottom: "1px solid var(--admin-border)" }}>
                                Danger Zone
                            </div>
                            <div style={{ padding: "0 24px" }}>
                                {/* Each danger action: just shows a toast message (no real backend action) */}
                                {[
                                    { label: "Export All Data", sub: "Download full database as JSON backup", action: "Export", color: "var(--admin-blue)" },
                                    { label: "Clear All Allocations", sub: "Reset all room assignments for new session", action: "Clear", color: "var(--admin-orange)" },
                                    { label: "Reset System", sub: "Wipe all data and restore factory defaults", action: "Reset", color: "var(--admin-red)" },
                                ].map(({ label, sub, action, color }) => (
                                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--admin-border)" }}>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--admin-text)", marginBottom: 3 }}>{label}</div>
                                            <div style={{ fontSize: 11, color: "var(--admin-muted)" }}>{sub}</div>
                                        </div>
                                        <button
                                            onClick={() => triggerToast(`${action} triggered`)}
                                            style={{
                                                padding: "7px 16px",
                                                background: "transparent",
                                                border: `1px solid ${color}`,
                                                color: color,
                                                borderRadius: 6,
                                                fontSize: 11,
                                                cursor: "pointer",
                                                fontFamily: "inherit",
                                                fontWeight: 600,
                                                opacity: 0.8,
                                            }}
                                        >
                                            {action}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
