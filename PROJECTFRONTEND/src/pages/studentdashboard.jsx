// ==================================================
// STUDENTDASHBOARD.JSX - Student's personal dashboard
// ==================================================
// Tailwind-styled dashboard matching the HostelMS theme.
// All original functionality preserved:
//   - getStudentDashboard API call on mount
//   - Hall selection with getAvailableRooms
//   - Room booking with bookRoom
//   - Block tabs for room filtering
//   - Receipt navigation
//   - Logout

import { getStudentDashboard } from "../services/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookRoom, getAvailableRooms } from "../services/auth";

// ─── Occupancy bar helper ─────────────────────────────────────────────────────
function OccBar({ current, capacity }) {
    const pct = capacity ? Math.round((current / capacity) * 100) : 0;
    const col =
        pct >= 100
            ? "bg-red-500"
            : pct > 85
                ? "bg-amber-500"
                : pct > 75
                    ? "bg-blue-600"
                    : "bg-green-500";
    return (
        <div className="bg-slate-200 rounded-sm h-1.5 mt-1.5">
            <div
                className={`h-full rounded-sm transition-all duration-500 ${col}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
            />
        </div>
    );
}

// ==================================================
// STUDENT DASHBOARD COMPONENT
// ==================================================
function StudentDashboard() {
    // ===== STATE VARIABLES =====
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedHall, setSelectedHall] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState("halls");
    const navigate = useNavigate();

    const triggerToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
    };

    // ===== LOAD DATA WHEN PAGE OPENS =====
    useEffect(() => {
        const loadData = async () => {
            try {
                const userString = localStorage.getItem("user");
                if (!userString) {
                    navigate("/studentlogin");
                    return;
                }
                const user = JSON.parse(userString);
                const matricparm = user.matriculation_number || user.matric_number;
                const data = await getStudentDashboard(matricparm);
                setDashboardData(data);
                setLoading(false);
            } catch (error) {
                console.error("Dashboard Error:", error);
                setError("Failed to load dashboard data.");
                setLoading(false);
                if (error.response && error.response.status === 401) {
                    navigate("/studentlogin");
                }
            }
        };
        loadData();
    }, [navigate]);

    // ===== LOGOUT FUNCTION =====
    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/studentlogin");
    };

    // ===== LOADING & ERROR STATES =====
    if (loading)
        return (
            <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center font-sans">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#1e3a6e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 text-sm font-medium">
                        Loading Dashboard...
                    </p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center font-sans">
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-8 py-6 text-center max-w-md">
                    <div className="text-3xl mb-3">⚠</div>
                    <p className="font-semibold text-lg mb-1">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );

    if (!dashboardData) return null;

    // ===== EXTRACT DATA =====
    const { profile, available_halls } = dashboardData;
    const { room_details } = profile;

    // ===== HANDLE SELECTING A HALL =====
    const handleSelectHall = async (hall) => {
        try {
            setRoomsLoading(true);
            setSelectedHall(hall);
            const roomData = await getAvailableRooms(hall.hall_id);
            setRooms(roomData);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            alert("Failed to load rooms. Please try again.");
            setSelectedHall(null);
        } finally {
            setRoomsLoading(false);
        }
    };

    // ===== HANDLE ROOM BOOKING =====
    const handleBooking = async (hall_id, room_id, roomNumber) => {
        if (
            !window.confirm(
                `Are you sure you want to book Room ${roomNumber} in ${selectedHall.hall_name}?`
            )
        ) {
            return;
        }

        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem("user"));
            const matricparm = user.matriculation_number || user.matric_number;
            await bookRoom(matricparm, hall_id, room_id);
            triggerToast("Room Booked Successfully! 🎉");
            setSelectedHall(null);
            setRooms([]);
            const updateData = await getStudentDashboard(matricparm);
            setDashboardData(updateData);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || "Failed to book room");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] font-sans text-slate-900">
            {/* Toast notification */}
            {toast && (
                <div className="fixed top-6 right-6 z-[9999] bg-[#1e3a6e] text-white px-6 py-3 rounded-lg font-semibold text-xs tracking-wide shadow-[0_8px_32px_rgba(30,58,110,0.3)] animate-[slideIn_0.3s_ease] max-w-[360px]">
                    ✓ {toast}
                </div>
            )}

            {/* ── NAV ──────────────────────────────────────────────────────────── */}
            <nav className="bg-[#1e3a6e] h-16 flex items-center justify-between px-6 md:px-9 sticky top-0 z-40 shrink-0 relative">
                {/* Grid texture */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                {/* Left: logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.18] border border-white/[0.22] flex items-center justify-center">
                        🏠
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">
                        HostelMS
                    </span>
                    <span className="text-[9px] font-semibold tracking-widest uppercase px-2.5 py-[3px] rounded bg-white/[0.12] border border-white/[0.18] text-blue-100">
                        Student Portal
                    </span>
                </div>
                {/* Right: payment badge + avatar/logout */}
                <div className="relative z-10 flex items-center gap-3.5">
                    {/* Payment badge */}
                    <div
                        className={`flex items-center gap-1.5 px-3 py-[5px] rounded-md border ${profile.payment_status === "Verified"
                            ? "bg-green-400/[0.15] border-green-400/[0.35]"
                            : "bg-red-400/[0.15] border-red-400/[0.35]"
                            }`}
                    >
                        <div
                            className={`w-1.5 h-1.5 rounded-full ${profile.payment_status === "Verified"
                                ? "bg-green-400"
                                : "bg-red-400"
                                }`}
                        />
                        <span
                            className={`text-[10px] font-semibold tracking-wider ${profile.payment_status === "Verified"
                                ? "text-green-400"
                                : "text-red-400"
                                }`}
                        >
                            {profile.payment_status === "Verified"
                                ? "PAYMENT VERIFIED"
                                : "PAYMENT PENDING"}
                        </span>
                    </div>
                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        title="Sign out"
                        className="w-[34px] h-[34px] rounded-full bg-white/20 border border-white/25 flex items-center justify-center text-xs font-bold text-white cursor-pointer"
                    >
                        {profile.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                    </button>
                </div>
            </nav>

            {/* ── Main content ─────────────────────────────────────────────────── */}
            <div className="px-6 md:px-9 py-8 max-w-[1100px] mx-auto">
                {/* ── Profile card ─────────────────────────────────────────────────── */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-7 flex flex-col md:flex-row justify-between items-start md:items-center mb-7 gap-4">
                    {/* Left: avatar + info */}
                    <div className="flex items-center gap-4">
                        <div className="w-[52px] h-[52px] rounded-full bg-blue-50 border-2 border-blue-400 flex items-center justify-center text-[22px]">
                            👨
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-500 tracking-widest uppercase font-semibold mb-1">
                                Student
                            </div>
                            <div className="text-[22px] font-extrabold text-slate-900 tracking-tight mb-[3px]">
                                {profile.full_name}
                            </div>
                            <div className="text-xs text-slate-500">
                                {profile.matriculation_number} · {profile.department} ·{" "}
                                {profile.level}
                            </div>
                        </div>
                    </div>
                    {/* Right: allocation status */}
                    <div className="md:text-right">
                        <div className="text-[10px] text-slate-500 tracking-widest uppercase font-semibold mb-2.5">
                            Allocation Status
                        </div>
                        {room_details ? (
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-green-50 border border-green-200 text-[11px] text-green-600 font-semibold tracking-wider mb-1.5">
                                    ✓ ALLOCATED
                                </div>
                                <div className="text-xs text-slate-500">
                                    {room_details.hall_name} · Room {room_details.room_number}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-[11px] text-amber-500 font-semibold tracking-wider mb-2.5">
                                    PENDING ALLOCATION
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Payment blocked banner ────────────────────────────────────────── */}
                {profile.payment_status !== "Verified" && (
                    <div className="bg-red-50 border border-red-200 rounded-[10px] px-6 py-[18px] mb-6 flex items-center gap-4">
                        <span className="text-[26px]">🔒</span>
                        <div>
                            <div className="text-sm font-bold text-red-600 mb-1">
                                Room Allocation Blocked
                            </div>
                            <div className="text-xs text-slate-500 leading-relaxed">
                                Your hostel payment has not been verified. Please visit the
                                bursar's office or pay via the school portal, then return here.
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB NAVIGATION ────────────────────────────────────────────── */}
                <div className="flex border-b border-slate-200 mb-7 bg-white rounded-t-[10px]">
                    {[["halls", "Available Halls"], ["myroom", "My Room"], ["receipt", "E-Receipt"]].map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`px-6 py-3.5 bg-transparent border-none text-xs tracking-wide cursor-pointer -mb-px transition-all duration-200 ${activeTab === key
                                    ? "border-b-2 border-[#1e3a6e] text-[#1e3a6e] font-semibold"
                                    : "text-slate-500 font-normal border-b-2 border-transparent"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* ── TAB: Available Halls ──────────────────────────────────────── */}
                {activeTab === "halls" && (
                    <div className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                        {profile.payment_status !== "Verified" ? (
                            <div className="p-12 text-center">
                                <div className="text-[44px] mb-4">🔒</div>
                                <h2 className="text-xl font-extrabold text-red-600 mb-2">Action Required</h2>
                                <p className="text-sm text-slate-900 mb-2">Your school fees payment has not been verified yet.</p>
                                <p className="text-xs text-slate-500">Please contact the bursary or wait for verification.</p>
                            </div>
                        ) : room_details ? (
                            <div className="p-12 text-center">
                                <div className="text-[44px] mb-4">✅</div>
                                <h2 className="text-xl font-extrabold text-green-600 mb-2">Already Allocated</h2>
                                <p className="text-sm text-slate-900 mb-2">You have already been assigned to <strong>{room_details.hall_name} — Room {room_details.room_number}</strong>.</p>
                                <p className="text-xs text-slate-500">Check the "My Room" or "E-Receipt" tabs for details.</p>
                            </div>
                        ) : (
                            <div className="p-6 md:p-8">
                                {!selectedHall ? (
                                    <div>
                                        <div className="mb-5">
                                            <h2 className="text-[22px] font-extrabold text-[#1e3a6e] tracking-tight mb-1">Select a Hall</h2>
                                            <p className="text-[13px] text-slate-500">Choose a hostel hall to view available rooms</p>
                                        </div>
                                        {available_halls.length === 0 ? (
                                            <div className="bg-white border border-slate-200 rounded-xl p-14 text-center text-slate-500">No halls are currently available for your gender.</div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                                {available_halls.map((hall) => (
                                                    <div key={hall.hall_id} className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 flex items-center justify-between gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                                                        <div className="flex-1">
                                                            <div className="text-base font-bold text-slate-900 mb-[3px]">{hall.hall_name}</div>
                                                            <div className="text-xs text-slate-500 mb-2.5">{hall.available_rooms} room{hall.available_rooms !== 1 ? "s" : ""} left</div>
                                                            <OccBar current={0} capacity={hall.available_rooms > 0 ? 1 : 0} />
                                                        </div>
                                                        <button onClick={() => handleSelectHall(hall)} className="bg-[#1e3a6e] text-white border-none rounded-lg px-5 py-2.5 text-[13px] font-bold cursor-pointer shrink-0 tracking-wide hover:bg-[#162d57] transition-colors">Select</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <button onClick={() => { setSelectedHall(null); setRooms([]); setSelectedBlock(null); }} className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-semibold text-slate-900 cursor-pointer flex items-center gap-1.5 hover:bg-slate-50 transition-colors">← Back to Halls</button>
                                            <h2 className="text-xl font-extrabold text-[#1e3a6e] tracking-tight">{selectedHall.hall_name} — Pick a Room</h2>
                                        </div>
                                        {roomsLoading ? (
                                            <div className="text-center py-12">
                                                <div className="w-8 h-8 border-4 border-[#1e3a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                                <p className="text-sm text-slate-500">Loading rooms...</p>
                                            </div>
                                        ) : rooms.length === 0 ? (
                                            <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 text-red-600 text-sm">No available rooms in this hall right now.</div>
                                        ) : (() => {
                                            const blocks = {};
                                            rooms.forEach((room) => { const bl = room.room_number.charAt(0).toUpperCase(); if (!blocks[bl]) blocks[bl] = []; blocks[bl].push(room); });
                                            const blockKeys = Object.keys(blocks).sort();
                                            const activeBlock = selectedBlock && blocks[selectedBlock] ? selectedBlock : blockKeys[0];
                                            return (
                                                <div>
                                                    <div className="flex gap-2 mb-6 flex-wrap">
                                                        {blockKeys.map((block) => (
                                                            <button key={block} onClick={() => setSelectedBlock(block)} className={`px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide border transition-all duration-200 cursor-pointer min-w-[80px] ${activeBlock === block ? "bg-[#1e3a6e] text-white border-[#1e3a6e]" : "bg-white text-slate-500 border-slate-200 hover:border-[#1e3a6e] hover:text-[#1e3a6e]"}`}>
                                                                {block} Block <span className="text-[10px] ml-1 opacity-70">({blocks[block].length})</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                                                        {blocks[activeBlock].map((room) => {
                                                            const full = room.current_occupants >= room.capacity;
                                                            return (
                                                                <div key={room.room_id} className={`bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-[18px] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${full ? "opacity-50" : ""}`}>
                                                                    <div className="flex justify-between items-start mb-2.5">
                                                                        <div className="text-base font-bold text-slate-900">Room {room.room_number}</div>
                                                                        {full && <span className="inline-flex items-center text-[10px] font-semibold tracking-wider uppercase px-2.5 py-[3px] rounded bg-red-600/[0.08] border border-red-600/[0.25] text-red-600">Full</span>}
                                                                    </div>
                                                                    <div className="text-xs text-slate-500 mb-3.5">{room.current_occupants}/{room.capacity} beds taken</div>
                                                                    <button disabled={full} onClick={() => handleBooking(selectedHall.hall_id, room.room_id, room.room_number)} className={`w-full py-2.5 border-none rounded-lg text-xs font-bold tracking-wide transition-colors duration-200 ${full ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-[#1e3a6e] text-white cursor-pointer hover:bg-[#162d57]"}`}>
                                                                        {full ? "Full" : "Book"}
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ── TAB: My Room ──────────────────────────────────────────────── */}
                {activeTab === "myroom" && (
                    <div>
                        {!room_details ? (
                            <div className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-14 text-center">
                                <div className="text-[40px] mb-4">🏠</div>
                                <div className="text-lg font-bold text-slate-900 mb-2">No Room Allocated Yet</div>
                                <div className="text-sm text-slate-500 leading-relaxed max-w-[380px] mx-auto">
                                    {profile.payment_status !== "Verified"
                                        ? "Your payment must be verified before you can request a room."
                                        : "Head to the \"Available Halls\" tab to select and book a room."}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Room info card */}
                                <div className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                                    <div className="px-6 py-[18px] border-b border-slate-200 font-bold text-[15px] text-slate-900">Your Room</div>
                                    <div className="p-6">
                                        <div className="text-[40px] font-extrabold text-[#1e3a6e] tracking-tight mb-1">Room {room_details.room_number}</div>
                                        <div className="text-sm text-slate-500 mb-5">{room_details.hall_name}</div>
                                        {[["Hall", room_details.hall_name], ["Room", room_details.room_number], ["Session", "2025/2026"]].map(([k, v]) => (
                                            <div key={k} className="flex justify-between py-2.5 border-b border-slate-200 text-[13px]">
                                                <span className="text-slate-500">{k}</span>
                                                <span className="text-slate-900 font-medium">{v}</span>
                                            </div>
                                        ))}
                                        <button onClick={() => navigate("/reciept")} className="w-full mt-[18px] py-3 bg-[#1e3a6e] border-none text-white rounded-lg text-xs font-bold cursor-pointer tracking-wider hover:bg-[#162d57] transition-colors">
                                            View E-Receipt →
                                        </button>
                                    </div>
                                </div>
                                {/* Info / instructions card */}
                                <div className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                                    <div className="px-6 py-[18px] border-b border-slate-200 font-bold text-[15px] text-slate-900">Instructions</div>
                                    <div className="p-6">
                                        <div className="flex flex-col gap-4">
                                            {[
                                                { icon: "🪪", label: "Present ID", sub: "Show your student ID at the porter's lodge" },
                                                { icon: "🧾", label: "Carry Receipt", sub: "Print or show your e-receipt on arrival" },
                                                { icon: "📦", label: "Move In", sub: "Follow hall guidelines for check-in times" },
                                                { icon: "📞", label: "Need Help?", sub: "Contact hostel administration for support" },
                                            ].map((item) => (
                                                <div key={item.label} className="flex items-start gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-lg shrink-0">{item.icon}</div>
                                                    <div>
                                                        <div className="text-[13px] font-semibold text-slate-900">{item.label}</div>
                                                        <div className="text-[11px] text-slate-500 mt-0.5">{item.sub}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── TAB: E-Receipt ────────────────────────────────────────────── */}
                {activeTab === "receipt" && (
                    <div>
                        {!room_details ? (
                            <div className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-14 text-center">
                                <div className="text-[40px] mb-4">🧾</div>
                                <div className="text-lg font-bold text-slate-900 mb-2">No Receipt Yet</div>
                                <div className="text-sm text-slate-500">Your e-receipt will appear here once a room has been allocated.</div>
                            </div>
                        ) : (
                            <div className="max-w-[480px] mx-auto">
                                {/* Inline receipt preview */}
                                <div className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden mb-4">
                                    {/* Receipt header */}
                                    <div className="bg-[#1e3a6e] px-7 py-6 text-center relative">
                                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
                                        <div className="relative z-10">
                                            <div className="text-xl font-extrabold text-white mb-[3px]">HostelMS</div>
                                            <div className="text-[9px] tracking-widest uppercase text-blue-200">Official Hostel Allocation E-Receipt</div>
                                            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/[0.12] border border-white/20 rounded-full px-3.5 py-1">
                                                <span className="w-[5px] h-[5px] rounded-full bg-green-400 inline-block" />
                                                <span className="text-[9px] text-white tracking-wider font-semibold">VERIFIED & SECURE</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Details */}
                                    <div className="p-6">
                                        {[["Name", profile.full_name], ["Matric", profile.matriculation_number], ["Department", profile.department], ["Level", profile.level], ["Hall", room_details.hall_name], ["Room", room_details.room_number], ["Session", "2025/2026"]].map(([k, v]) => (
                                            <div key={k} className="flex justify-between py-2 border-b border-slate-200 text-[13px]">
                                                <span className="text-slate-500">{k}</span>
                                                <span className="text-slate-900 font-medium">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Stamp */}
                                    <div className="px-6 py-3.5 bg-green-50 border-t border-green-200 flex items-center gap-2.5">
                                        <span>✅</span>
                                        <span className="text-[11px] font-bold text-green-600">ALLOCATION CONFIRMED</span>
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button onClick={() => navigate("/reciept")} className="flex-1 py-3 bg-[#1e3a6e] border-none text-white rounded-lg text-xs font-bold cursor-pointer tracking-wider hover:bg-[#162d57] transition-colors">View Full Receipt →</button>
                                    <button onClick={() => window.print()} className="flex-1 py-3 bg-transparent border border-slate-200 text-slate-500 rounded-lg text-xs cursor-pointer hover:bg-slate-50 transition-colors">↓ Download PDF</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Animations ─────────────────────────────────────────────────── */}
            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
}

// Export this component so it can be used in App.jsx
export default StudentDashboard;