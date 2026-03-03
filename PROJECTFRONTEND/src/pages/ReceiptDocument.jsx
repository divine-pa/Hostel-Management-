// ==================================================
// RECEIPTDOCUMENT.JSX — PDF Receipt Template
// ==================================================
// This file creates the PDF version of the hostel allocation receipt.
// It uses @react-pdf/renderer (a library that generates real PDF files).
//
// HOW IT WORKS:
//   - This is NOT a regular web page — it's a PDF document
//   - It uses special components: Document, Page, View, Text (NOT div, p, span)
//   - It gets student data through the "data" prop
//   - It's used in two places:
//     1. reciept.jsx → Student downloads their own receipt
//     2. AdminReports.jsx / adminReceipts.jsx → Admin downloads student receipts
//
// The StyleSheet.create() works like CSS but for PDFs.
// You can't use Tailwind or regular CSS here — only React-PDF styles.

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// ─── Color Constants (navy theme matching the rest of the app) ───
const NAVY = "#1e3a6e";           // Main navy blue color
const NAVY_LIGHT = "#2d4f8e";     // Lighter navy (not used directly but available)
const TEXT_PRIMARY = "#0f172a";    // Dark text color
const TEXT_MUTED = "#64748b";     // Light gray text for labels
const BORDER = "#e2e8f0";        // Light border color
const GREEN = "#16a34a";         // Green for "confirmed" status
const BG_LIGHT = "#f8fafc";      // Very light background

// ─── PDF Stylesheet ───
// This is like CSS but for PDF documents
// Each key (page, header, logoText, etc.) is a style that can be applied to components
const styles = StyleSheet.create({
    // Page layout: padding, font, and background
    page: {
        padding: 0,
        fontSize: 10,
        fontFamily: "Helvetica",
        color: TEXT_PRIMARY,
        backgroundColor: "#ffffff",
    },

    // ── Header section (navy blue bar at top) ──
    header: {
        backgroundColor: NAVY,
        paddingVertical: 28,
        paddingHorizontal: 40,
        textAlign: "center",
        position: "relative",
    },
    // Big white "HostelMS" text in the header
    logoText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#ffffff",
        letterSpacing: -0.5,
        marginBottom: 3,
    },
    // Small subtitle under the logo
    headerSubtitle: {
        fontSize: 8,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: "#bfdbfe",
        marginBottom: 12,
    },
    // "VERIFIED & SECURE" badge in the header
    verifiedBadge: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "rgba(255,255,255,0.12)",
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 14,
        alignSelf: "center",
    },
    // Small green dot next to "VERIFIED"
    verifiedDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#4ade80",
    },
    verifiedText: {
        fontSize: 7,
        letterSpacing: 1.5,
        color: "#ffffff",
        fontWeight: "bold",
    },

    // ── Receipt number bar (light gray strip below header) ──
    refBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 40,
        backgroundColor: BG_LIGHT,
        borderBottom: `1px solid ${BORDER}`,
    },
    refLabel: {
        fontSize: 7,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: TEXT_MUTED,
        fontWeight: "bold",
    },
    refValue: {
        fontSize: 11,
        fontFamily: "Courier",
        fontWeight: "bold",
        color: NAVY,
        letterSpacing: 0.5,
    },

    // ── Section containers (Student Info, Allocation Details) ──
    sectionContainer: {
        paddingHorizontal: 40,
        paddingTop: 18,
        paddingBottom: 6,
    },
    // Section title (e.g. "STUDENT INFORMATION")
    sectionTitle: {
        fontSize: 7,
        letterSpacing: 2.5,
        textTransform: "uppercase",
        color: TEXT_MUTED,
        fontWeight: "bold",
        marginBottom: 10,
    },
    // Each row: label on the left, value on the right
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 7,
        borderBottom: `1px solid ${BORDER}`,
    },
    rowLabel: {
        fontSize: 10,
        color: TEXT_MUTED,
    },
    rowValue: {
        fontSize: 10,
        color: TEXT_PRIMARY,
        fontWeight: "medium",
        textAlign: "right",
        maxWidth: "60%",
    },
    // Green text for the "Status" field
    rowValueGreen: {
        fontSize: 10,
        color: GREEN,
        fontWeight: "bold",
        textAlign: "right",
    },

    // ── Confirmation stamp (green box at bottom) ──
    stamp: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginHorizontal: 40,
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#f0fdf4",
        borderRadius: 6,
        border: `1px solid #bbf7d0`,
    },
    stampEmoji: {
        fontSize: 16,
    },
    stampTitle: {
        fontSize: 9,
        fontWeight: "bold",
        color: GREEN,
        marginBottom: 2,
    },
    stampSub: {
        fontSize: 8,
        color: TEXT_MUTED,
        lineHeight: 1.4,
    },

    // ── Divider line ──
    divider: {
        height: 1,
        backgroundColor: BORDER,
        marginHorizontal: 40,
        marginTop: 16,
    },

    // ── Instructions section (bullet points) ──
    instructions: {
        paddingHorizontal: 40,
        paddingTop: 14,
        paddingBottom: 8,
    },
    instructionText: {
        fontSize: 8,
        color: TEXT_MUTED,
        lineHeight: 1.5,
        marginBottom: 3,
    },

    // ── Footer (absolute positioned at page bottom) ──
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        borderTop: `1px solid ${BORDER}`,
        paddingTop: 10,
    },
    footerText: {
        fontSize: 7,
        color: TEXT_MUTED,
        letterSpacing: 0.3,
    },
});

// ==================================================
// THE ACTUAL PDF RECEIPT COMPONENT
// ==================================================
// "data" prop contains all the student and allocation info:
//   data.receipt_no, data.full_name, data.matric_no, data.department,
//   data.level, data.gender, data.email, data.phone_number,
//   data.house_address, data.hall_name, data.room_number,
//   data.allocation_date, data.transaction_reference,
//   data.amount_paid, data.status
const ReceiptDocument = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* ── Navy header with logo and "VERIFIED" badge ── */}
            <View style={styles.header}>
                <Text style={styles.logoText}>HostelMS</Text>
                <Text style={styles.headerSubtitle}>
                    Official Hostel Allocation E-Receipt
                </Text>
                <View style={styles.verifiedBadge}>
                    <View style={styles.verifiedDot} />
                    <Text style={styles.verifiedText}>VERIFIED & SECURE</Text>
                </View>
            </View>

            {/* ── Receipt number (unique ID for this receipt) ── */}
            <View style={styles.refBar}>
                <Text style={styles.refLabel}>Receipt No</Text>
                <Text style={styles.refValue}>{data.receipt_no}</Text>
            </View>

            {/* ── Student information section ──
                Shows all personal details of the student */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Student Information</Text>
                {[
                    ["Full Name", data.full_name],
                    ["Matric Number", data.matric_no],
                    ["Department", data.department],
                    ["Level", data.level],
                    ["Gender", data.gender],
                    ["Email", data.email],
                    ["Phone", data.phone_number],
                    ["Address", data.house_address],
                ].map(([label, value]) => (
                    <View key={label} style={styles.row}>
                        <Text style={styles.rowLabel}>{label}</Text>
                        <Text style={styles.rowValue}>{value || "—"}</Text>
                    </View>
                ))}
            </View>

            {/* ── Allocation details section ──
                Shows which room was assigned and payment info */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Allocation Details</Text>
                {[
                    ["Hall Allocated", data.hall_name],
                    ["Room Number", data.room_number],
                    [
                        "Allocation Date",
                        new Date(data.allocation_date).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        }),
                    ],
                    ["Session", "2025/2026"],
                    ["Transaction Reference", data.transaction_reference],
                    ["Amount Paid", data.amount_paid],
                ].map(([label, value]) => (
                    <View key={label} style={styles.row}>
                        <Text style={styles.rowLabel}>{label}</Text>
                        <Text style={styles.rowValue}>{value || "—"}</Text>
                    </View>
                ))}
                {/* Status row in green to show it's confirmed */}
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Status</Text>
                    <Text style={styles.rowValueGreen}>{data.status}</Text>
                </View>
            </View>

            {/* ── Green confirmation stamp ── */}
            <View style={styles.stamp}>
                <Text style={styles.stampEmoji}>✅</Text>
                <View>
                    <Text style={styles.stampTitle}>ALLOCATION CONFIRMED</Text>
                    <Text style={styles.stampSub}>
                        This receipt confirms your hostel room allocation. Present it at the
                        porter's lodge.
                    </Text>
                </View>
            </View>

            {/* ── Divider line ── */}
            <View style={styles.divider} />

            {/* ── Instructions for the student ── */}
            <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                    • Present your student ID along with this receipt at the porter's
                    lodge
                </Text>
                <Text style={styles.instructionText}>
                    • Follow hall guidelines for check-in times and procedures
                </Text>
                <Text style={styles.instructionText}>
                    • Contact hostel administration for any discrepancies or support
                </Text>
            </View>

            {/* ── Footer (at the very bottom of the page) ── */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    HostelMS — Babcock University Hostel Management System
                </Text>
                <Text style={styles.footerText}>
                    Generated on {new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                    . This is a computer-generated document. No signature is required.
                </Text>
            </View>
        </Page>
    </Document>
);

// Export so it can be used in reciept.jsx and AdminReports.jsx
export default ReceiptDocument;