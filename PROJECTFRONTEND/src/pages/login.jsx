// ==================================================
// LOGIN.JSX - The role-selection / sign-in page
// ==================================================
// Split-panel layout inspired by the reference design.
// Left  → navy branding panel (features list).
// Right → role-picker cards that route to /studentlogin or /adminlogin.

import { Link } from "react-router-dom";

function LoginPage() {
    return (
        <div className="flex min-h-screen font-sans">
            {/* ── LEFT — Navy branding panel ─────────────────────────────────── */}
            <div className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between p-[52px_48px] bg-[#1e3a6e] relative overflow-hidden min-h-screen">
                {/* Grid texture overlay */}
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
                                Automated &amp; Secure
                            </span>
                        </div>
                        <h2 className="text-white text-[32px] font-extrabold leading-[1.15] tracking-tight mb-3.5">
                            Smart rooms.
                            <br />
                            Instant receipts.
                        </h2>
                        <p className="text-blue-200/75 text-[13px] leading-[1.7] max-w-[300px]">
                            A rule-based engine assigns rooms by payment status, gender, and
                            real-time availability — then delivers a secure e-receipt
                            instantly.
                        </p>
                    </div>

                    {/* Feature bullets */}
                    <div className="flex flex-col gap-3.5">
                        {[
                            {
                                label: "Payment Verified",
                                sub: "Only confirmed payments unlock allocation",
                            },
                            {
                                label: "Gender Matched",
                                sub: "Rooms assigned to the correct hall by gender",
                            },
                            {
                                label: "Auto Allocated",
                                sub: "Best-fit room selected automatically",
                            },
                            {
                                label: "E-Receipt Instant",
                                sub: "Delivered to student & admin on confirmation",
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

                {/* Bottom spacer */}
                <div className="relative z-10" />
            </div>

            {/* ── RIGHT — Role picker ────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-16 bg-[#F5F5F5] overflow-y-auto min-h-screen">
                {/* Back link */}
                <div className="w-full max-w-[380px] mb-10">
                    <Link
                        to="/"
                        className="text-slate-500 text-xs flex items-center gap-1.5 hover:text-[#1e3a6e] transition-colors no-underline"
                    >
                        ← Back to Home
                    </Link>
                </div>

                <div className="w-full max-w-[380px]">
                    {/* Heading */}
                    <h1 className="text-[30px] font-extrabold text-slate-900 tracking-tight mb-1.5">
                        Sign in
                    </h1>
                    <p className="text-sm text-slate-500 mb-9">
                        Who are you signing in as?
                    </p>

                    {/* Role cards */}
                    <div className="flex flex-col gap-3.5">
                        {/* Student card */}
                        <Link
                            to="/studentlogin"
                            className="group w-full bg-white border-2 border-slate-200 rounded-2xl p-5 text-left no-underline flex items-center gap-4 transition-all duration-200 hover:border-[#1e3a6e] hover:shadow-[0_4px_16px_rgba(30,58,110,0.1)]"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[22px] shrink-0">
                                🎒
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[15px] font-bold text-slate-900">
                                    Student
                                </div>
                                <div className="text-xs text-slate-500 mt-[3px]">
                                    Browse halls, request allocation &amp; download e-receipt
                                </div>
                            </div>
                            <span className="text-lg text-slate-400 group-hover:text-[#1e3a6e] transition-colors">
                                →
                            </span>
                        </Link>

                        {/* Admin card */}
                        <Link
                            to="/adminlogin"
                            className="group w-full bg-white border-2 border-slate-200 rounded-2xl p-5 text-left no-underline flex items-center gap-4 transition-all duration-200 hover:border-[#1e3a6e] hover:shadow-[0_4px_16px_rgba(30,58,110,0.1)]"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#1e3a6e] flex items-center justify-center text-[22px] shrink-0">
                                🛡
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[15px] font-bold text-slate-900">
                                    Administrator
                                </div>
                                <div className="text-xs text-slate-500 mt-[3px]">
                                    Manage rooms, students, payments &amp; system reports
                                </div>
                            </div>
                            <span className="text-lg text-slate-400 group-hover:text-[#1e3a6e] transition-colors">
                                →
                            </span>
                        </Link>
                    </div>

                    {/* Help text */}
                    <p className="mt-10 text-xs text-slate-400 text-center">
                        Need help? Contact the hostel administration office.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;