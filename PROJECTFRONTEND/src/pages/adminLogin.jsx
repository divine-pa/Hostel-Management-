// ==================================================
// ADMINLOGIN.JSX - Admin login page
// ==================================================
// Split-panel Tailwind design matching the HostelMS theme.
// Left  → navy branding panel.
// Right → admin login form.

import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginadmin } from "../services/auth";

function AdminLogin() {
    // ===== STATE VARIABLES =====
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // ===== HANDLE LOGIN SUBMISSION =====
    const handlesubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await loginadmin(email, password);
            navigate("/admindashboard");
        } catch (err) {
            setError("Login failed. Check your email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen font-sans">
            {/* ── LEFT — Navy branding panel ─────────────────────────────────── */}
            <div className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between p-[52px_48px] bg-[#1e3a6e] relative overflow-hidden min-h-screen">
                {/* Grid texture */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)",
                        backgroundSize: "36px 36px",
                    }}
                />
                {/* Glow blob */}
                <div className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full bg-blue-300/[0.07] blur-[80px] pointer-events-none" />

                {/* Top content */}
                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-[52px]">
                        <div className="w-10 h-10 rounded-[10px] bg-white/15 border border-white/20 flex items-center justify-center text-xl">
                            🏠
                        </div>
                        <div>
                            <div className="text-white font-bold text-xl tracking-tight leading-none">
                                HostelMS
                            </div>
                            <div className="text-blue-200 text-[10px] font-semibold tracking-widest uppercase mt-[3px]">
                                Allocation System
                            </div>
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="mb-9">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-6 h-px bg-blue-200/50" />
                            <span className="text-blue-200 text-[10px] font-semibold tracking-widest uppercase">
                                Admin Portal
                            </span>
                        </div>
                        <h2 className="text-white text-[32px] font-extrabold leading-[1.15] tracking-tight mb-3.5">
                            System
                            <br />
                            Management.
                        </h2>
                        <p className="text-blue-200/75 text-[13px] leading-[1.7] max-w-[300px]">
                            Access the administration dashboard to manage rooms, students,
                            payments, and generate comprehensive system reports.
                        </p>
                    </div>

                    {/* Feature bullets */}
                    <div className="flex flex-col gap-3.5">
                        {[
                            {
                                label: "Room Management",
                                sub: "Add, edit, and allocate hostel rooms",
                            },
                            {
                                label: "Student Records",
                                sub: "View and manage all student information",
                            },
                            {
                                label: "Payment Tracking",
                                sub: "Monitor and verify hostel fee payments",
                            },
                            {
                                label: "System Reports",
                                sub: "Generate allocation and occupancy reports",
                            },
                        ].map((f) => (
                            <div key={f.label} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[9px] text-white shrink-0 mt-px">
                                    ✓
                                </div>
                                <div>
                                    <div className="text-white text-xs font-semibold leading-[1.2]">
                                        {f.label}
                                    </div>
                                    <div className="text-blue-200/65 text-[11px] mt-0.5">
                                        {f.sub}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10" />
            </div>

            {/* ── RIGHT — Login form ─────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-16 bg-[#F5F5F5] overflow-y-auto min-h-screen">
                {/* Back link */}
                <div className="w-full max-w-[380px] mb-10">
                    <Link
                        to="/LoginPage"
                        className="text-slate-500 text-xs flex items-center gap-1.5 hover:text-[#1e3a6e] transition-colors no-underline"
                    >
                        ← Back to Login
                    </Link>
                </div>

                <div className="w-full max-w-[380px]">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-1.5">
                        <div className="w-9 h-9 rounded-lg bg-[#1e3a6e] flex items-center justify-center text-lg shrink-0">
                            🛡
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Admin Sign In
                        </h1>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 ml-12">
                        Enter your admin email and password
                    </p>

                    {/* Admin badge */}
                    <div className="ml-12 mb-7">
                        <span className="inline-block px-3 py-1 bg-[#1e3a6e] text-white rounded text-[10px] font-semibold tracking-wider uppercase">
                            Admin Portal
                        </span>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-[10px] px-4 py-2.5 text-[13px] mb-4 flex items-center gap-2">
                            ⚠ {error}
                        </div>
                    )}

                    {/* Login form */}
                    <form onSubmit={handlesubmit}>
                        {/* Email */}
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                required
                                autoFocus
                                className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 text-sm px-4 py-3 outline-none transition-all duration-200 focus:border-[#1e3a6e] focus:ring-[3px] focus:ring-[#1e3a6e]/[0.08]"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-2 relative">
                            <label
                                htmlFor="password"
                                className="block text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-2"
                            >
                                Password
                            </label>
                            <input
                                type={showPwd ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                required
                                className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 text-sm pl-4 pr-11 py-3 outline-none transition-all duration-200 focus:border-[#1e3a6e] focus:ring-[3px] focus:ring-[#1e3a6e]/[0.08]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(!showPwd)}
                                className="absolute right-3.5 bottom-3.5 bg-transparent border-none cursor-pointer text-slate-400 text-sm leading-none p-0"
                            >
                                {showPwd ? "🙈" : "👁"}
                            </button>
                        </div>

                        {/* Forgot password */}
                        <div className="flex justify-end mb-5">
                            <span className="text-xs text-[#1e3a6e] cursor-pointer hover:underline">
                                Forgot password?
                            </span>
                        </div>

                        {/* Sign In button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 text-white border-none rounded-lg text-[13px] font-bold tracking-wider uppercase transition-colors duration-200 ${loading
                                    ? "bg-[#4a6fa5] cursor-not-allowed"
                                    : "bg-[#1e3a6e] cursor-pointer hover:bg-[#162d57]"
                                }`}
                        >
                            {loading ? "Verifying..." : "Sign In →"}
                        </button>
                    </form>

                    {/* Switch role */}
                    <Link
                        to="/LoginPage"
                        className="block w-full mt-3.5 py-3 text-center text-slate-500 text-xs no-underline hover:text-[#1e3a6e] transition-colors"
                    >
                        ← Sign in as a different role
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Export this component so it can be used in App.jsx
export default AdminLogin;