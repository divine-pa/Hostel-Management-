// ==================================================
// RECIEPT.JSX - Student's official room allocation receipt
// ==================================================
// Tailwind-styled receipt page matching the HostelMS theme.
// All original functionality preserved:
//   - RecipetData API call on mount
//   - PDFDownloadLink for PDF download
//   - Navigation back to dashboard

import { RecipetData } from "../services/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReceiptDocument from "./ReceiptDocument";

// ==================================================
// RECEIPT PAGE COMPONENT
// ==================================================
function ReceiptPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recieptData, setRecieptData] = useState(null);

    // ===== LOAD RECEIPT DATA WHEN PAGE OPENS =====
    useEffect(() => {
        const loadData = async () => {
            try {
                const userString = localStorage.getItem("user");
                if (!userString) {
                    navigate("/studentdashboard");
                    return;
                }
                const user = JSON.parse(userString);
                const matricparm = user.matriculation_number || user.matric_number;
                const data = await RecipetData(matricparm);
                setRecieptData(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError("Failed to load receipt data");
                setLoading(false);
                if (error.response && error.response.status === 401) {
                    navigate("/studentlogin");
                }
            }
        };
        loadData();
    }, [navigate]);

    // ===== LOADING STATE =====
    if (loading)
        return (
            <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center font-sans">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#1e3a6e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 text-sm font-medium">Loading receipt...</p>
                </div>
            </div>
        );

    // ===== ERROR STATE =====
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

    if (!recieptData) return null;

    return (
        <div className="min-h-screen bg-[#F5F5F5] font-sans text-slate-900">
            {/* ── NAV ──────────────────────────────────────────────────────────── */}
            <nav className="bg-[#1e3a6e] h-16 flex items-center justify-between px-6 md:px-9 sticky top-0 z-40 relative">
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.18] border border-white/[0.22] flex items-center justify-center">
                        🏠
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">HostelMS</span>
                    <span className="text-[9px] font-semibold tracking-widest uppercase px-2.5 py-[3px] rounded bg-white/[0.12] border border-white/[0.18] text-blue-100">
                        E-Receipt
                    </span>
                </div>
                <button
                    onClick={() => navigate("/studentdashboard")}
                    className="relative z-10 text-white/70 text-xs flex items-center gap-1.5 bg-transparent border border-white/20 rounded-lg px-4 py-2 cursor-pointer hover:bg-white/10 transition-colors"
                >
                    ← Back to Dashboard
                </button>
            </nav>

            {/* ── Receipt card ─────────────────────────────────────────────────── */}
            <div className="px-6 md:px-9 py-10 max-w-[520px] mx-auto">
                <div className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                    {/* ── Receipt header ── */}
                    <div className="bg-[#1e3a6e] px-8 py-7 text-center relative">
                        <div
                            className="absolute inset-0 opacity-[0.06] pointer-events-none"
                            style={{
                                backgroundImage:
                                    "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                                backgroundSize: "28px 28px",
                            }}
                        />
                        <div className="relative z-10">
                            <div className="text-[22px] font-extrabold text-white tracking-tight mb-1">
                                HostelMS
                            </div>
                            <div className="text-[10px] tracking-[0.12em] uppercase text-blue-200">
                                Official Hostel Allocation E-Receipt
                            </div>
                            <div className="mt-3.5 inline-flex items-center gap-1.5 bg-white/[0.12] border border-white/20 rounded-full px-4 py-[5px]">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                <span className="text-[10px] text-white tracking-wider font-semibold">
                                    VERIFIED & SECURE
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Transaction ref bar ── */}
                    <div className="px-7 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 tracking-widest uppercase font-semibold">
                            Receipt No
                        </span>
                        <span className="font-mono text-[13px] text-[#1e3a6e] font-bold tracking-wide">
                            {recieptData.receipt_no}
                        </span>
                    </div>

                    {/* ── Student details ── */}
                    <div className="px-7 py-5">
                        <div className="text-[10px] text-slate-500 tracking-widest uppercase font-semibold mb-3.5">
                            Student Details
                        </div>
                        {[
                            ["Full Name", recieptData.full_name],
                            ["Matric Number", recieptData.matric_no],
                            ["Department", recieptData.department],
                            ["Level", recieptData.level],
                            ["Gender", recieptData.gender],
                            ["Email", recieptData.email],
                            ["Phone", recieptData.phone_number],
                            ["Address", recieptData.house_address],
                        ].map(([k, v]) => (
                            <div
                                key={k}
                                className="flex justify-between py-[9px] border-b border-slate-200 text-[13px]"
                            >
                                <span className="text-slate-500">{k}</span>
                                <span className="text-slate-900 font-medium text-right max-w-[60%]">
                                    {v}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* ── Allocation details ── */}
                    <div className="px-7 pb-5">
                        <div className="text-[10px] text-slate-500 tracking-widest uppercase font-semibold mb-3.5">
                            Allocation Details
                        </div>
                        {[
                            ["Hall", recieptData.hall_name],
                            ["Room Number", recieptData.room_number],
                            [
                                "Allocation Date",
                                new Date(recieptData.allocation_date).toLocaleDateString(
                                    "en-NG",
                                    { day: "numeric", month: "long", year: "numeric" }
                                ),
                            ],
                            ["Status", recieptData.status],
                            ["Transaction Ref", recieptData.transaction_reference],
                            ["Amount Paid", recieptData.amount_paid],
                        ].map(([k, v]) => (
                            <div
                                key={k}
                                className="flex justify-between py-[9px] border-b border-slate-200 text-[13px]"
                            >
                                <span className="text-slate-500">{k}</span>
                                <span
                                    className={`font-medium text-right ${k === "Status"
                                            ? "text-green-600 font-semibold"
                                            : "text-slate-900"
                                        }`}
                                >
                                    {v}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* ── Confirmation stamp ── */}
                    <div className="px-7 py-4 bg-green-50 border-t border-green-200 flex items-center gap-3">
                        <span className="text-[22px]">✅</span>
                        <div>
                            <div className="text-xs font-bold text-green-600 mb-[2px]">
                                ALLOCATION CONFIRMED
                            </div>
                            <div className="text-[11px] text-slate-500">
                                Present this receipt at the porter's lodge to access your room.
                            </div>
                        </div>
                    </div>

                    {/* ── Action buttons ── */}
                    <div className="px-7 py-[18px] flex gap-3">
                        <button
                            onClick={() => navigate("/studentdashboard")}
                            className="flex-1 py-3 bg-transparent border border-slate-200 text-slate-500 rounded-lg text-xs cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                            ← Back to Dashboard
                        </button>

                        {recieptData && (
                            <PDFDownloadLink
                                document={<ReceiptDocument data={recieptData} />}
                                fileName={`BU-Receipt_${recieptData.matric_no}.pdf`}
                                className="flex-1 py-3 bg-[#1e3a6e] text-white rounded-lg text-xs font-bold tracking-wider text-center no-underline cursor-pointer hover:bg-[#162d57] transition-colors flex items-center justify-center"
                            >
                                {({ loading: pdfLoading }) =>
                                    pdfLoading ? "Generating..." : "↓ Download PDF"
                                }
                            </PDFDownloadLink>
                        )}
                    </div>
                </div>

                {/* ── Footer note ── */}
                <p className="text-center text-[11px] text-slate-400 mt-6">
                    This is a computer-generated receipt. No signature is required.
                </p>
            </div>
        </div>
    );
}

// Export this component so it can be used in App.jsx
export default ReceiptPage;