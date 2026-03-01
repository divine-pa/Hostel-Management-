import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// ─── HostelMS Navy Theme ──────────────────────────────────────────────────────
const NAVY = "#1e3a6e";
const NAVY_LIGHT = "#2d4f8e";
const TEXT_PRIMARY = "#0f172a";
const TEXT_MUTED = "#64748b";
const BORDER = "#e2e8f0";
const GREEN = "#16a34a";
const BG_LIGHT = "#f8fafc";

const styles = StyleSheet.create({
    page: {
        padding: 0,
        fontSize: 10,
        fontFamily: "Helvetica",
        color: TEXT_PRIMARY,
        backgroundColor: "#ffffff",
    },

    // ── Header ──
    header: {
        backgroundColor: NAVY,
        paddingVertical: 28,
        paddingHorizontal: 40,
        textAlign: "center",
        position: "relative",
    },
    logoText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#ffffff",
        letterSpacing: -0.5,
        marginBottom: 3,
    },
    headerSubtitle: {
        fontSize: 8,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: "#bfdbfe",
        marginBottom: 12,
    },
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

    // ── Receipt number bar ──
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

    // ── Sections ──
    sectionContainer: {
        paddingHorizontal: 40,
        paddingTop: 18,
        paddingBottom: 6,
    },
    sectionTitle: {
        fontSize: 7,
        letterSpacing: 2.5,
        textTransform: "uppercase",
        color: TEXT_MUTED,
        fontWeight: "bold",
        marginBottom: 10,
    },
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
    rowValueGreen: {
        fontSize: 10,
        color: GREEN,
        fontWeight: "bold",
        textAlign: "right",
    },

    // ── Confirmation stamp ──
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

    // ── Instructions ──
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

    // ── Footer ──
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

const ReceiptDocument = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* ── Navy header ── */}
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

            {/* ── Receipt number ── */}
            <View style={styles.refBar}>
                <Text style={styles.refLabel}>Receipt No</Text>
                <Text style={styles.refValue}>{data.receipt_no}</Text>
            </View>

            {/* ── Student information ── */}
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

            {/* ── Allocation details ── */}
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
                {/* Status row — green */}
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Status</Text>
                    <Text style={styles.rowValueGreen}>{data.status}</Text>
                </View>
            </View>

            {/* ── Confirmation stamp ── */}
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

            {/* ── Divider ── */}
            <View style={styles.divider} />

            {/* ── Instructions ── */}
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

            {/* ── Footer ── */}
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

export default ReceiptDocument;