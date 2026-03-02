// ==================================================
// ADMINRECEIPTS.JSX — Standalone Admin Receipts Page (Legacy)
// ==================================================
// ⚠ NOTE: This page's functionality has been INTEGRATED into AdminReports.jsx
//   (specifically in the "Receipts" tab). This file is kept for backward
//   compatibility — if someone visits the old /admin/receipts URL, they'll
//   be redirected to /admin/reports by the App.jsx router.
//
// WHAT THIS PAGE DOES:
//   - Loads all student receipts for the admin's hall
//   - Lets the admin search by name, matric number, or room
//   - Shows student cards with avatar, basic info, and room details
//   - Lets the admin expand a receipt to see full details
//   - Lets the admin download any receipt as a PDF

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAdminReceipts } from '../services/auth'       // API function to fetch receipts
import { PDFDownloadLink } from '@react-pdf/renderer'      // Generates downloadable PDFs
import ReceiptDocument from './ReceiptDocument'             // The PDF template
import './adminReceipts.css'                                // Styles for this page

function AdminReceipts() {
    const navigate = useNavigate()

    // ===== STATE VARIABLES =====
    const [loading, setLoading] = useState(true)               // Are we still loading data?
    const [error, setError] = useState(null)                   // Did something go wrong?
    const [students, setStudents] = useState([])               // All receipt data from the server
    const [filteredStudents, setFilteredStudents] = useState([]) // Receipts after search filter
    const [searchTerm, setSearchTerm] = useState('')            // What the admin typed in search
    const [expandedReceipt, setExpandedReceipt] = useState(null) // Which receipt is expanded (null = none)

    // ===== LOAD RECEIPTS WHEN PAGE OPENS =====
    // This runs once when the component first appears
    useEffect(() => {
        const loadReceipts = async () => {
            try {
                // Step 1: Check if an admin is logged in
                const userString = localStorage.getItem('Admin')
                if (!userString) {
                    // Not logged in → redirect to login page
                    navigate('/adminlogin')
                    return
                }

                // Step 2: Get the admin's email and fetch their hall's receipts
                const admin = JSON.parse(userString)
                const data = await getAdminReceipts(admin.email)

                // Step 3: Save the data
                setStudents(data)
                setFilteredStudents(data)
                setLoading(false)
            } catch (err) {
                console.error('Error loading receipts:', err)
                setError('Failed to load student receipts.')
                setLoading(false)

                // If unauthorized (401), redirect to login
                if (err.response && err.response.status === 401) {
                    navigate('/adminlogin')
                }
            }
        }
        loadReceipts()
    }, [navigate])

    // ===== SEARCH HANDLER =====
    // Filters receipts as the admin types in the search box
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase()
        setSearchTerm(term)

        // If search is empty, show all receipts
        if (term === '') {
            setFilteredStudents(students)
            return
        }

        // Filter by name, matric number, or room number
        const results = students.filter(s =>
            s.full_name.toLowerCase().includes(term) ||
            s.matric_no.toLowerCase().includes(term) ||
            s.room_number.toLowerCase().includes(term)
        )
        setFilteredStudents(results)
    }

    // ===== TOGGLE RECEIPT EXPANSION =====
    // Click once to expand, click again to collapse
    const toggleReceipt = (receiptNo) => {
        setExpandedReceipt(prev => prev === receiptNo ? null : receiptNo)
    }

    // ===== GET INITIALS FOR AVATAR =====
    // e.g., "James Okeke" → "JO"
    const getInitials = (name) => {
        if (!name) return '?'
        const parts = name.trim().split(' ')
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0][0].toUpperCase()
    }

    // ===== LOADING & ERROR STATES =====
    if (loading) return <div className="ar-page"><p>Loading student receipts...</p></div>
    if (error) return <div className="ar-page"><p style={{ color: '#e11d48' }}>{error}</p></div>

    // ===== RENDER THE PAGE =====
    return (
        <div className="ar-page">
            {/* Link back to main admin dashboard */}
            <Link to="/admin" className="ar-back">← Back to Dashboard</Link>
            <h1 className="ar-title">Student Receipts</h1>

            {/* Search Bar — filters receipts in real time */}
            <input
                type="text"
                placeholder="Search by name, matric number, or room..."
                value={searchTerm}
                onChange={handleSearch}
                className="ar-search"
            />

            {/* Show message if no receipts match the search */}
            {filteredStudents.length === 0 ? (
                <p className="ar-no-data">No student receipts found.</p>
            ) : (
                <div className="ar-list">
                    {/* Loop through each student receipt */}
                    {filteredStudents.map(student => (
                        <div className="ar-card" key={student.receipt_no}>

                            {/* Card Header: avatar + student name/info */}
                            <div className="ar-card-header">
                                <div className="ar-avatar">{getInitials(student.full_name)}</div>
                                <div className="ar-student-info">
                                    <p className="ar-student-name">{student.full_name}</p>
                                    <div className="ar-student-meta">
                                        <span>{student.matric_no}</span>
                                        <span>{student.department}</span>
                                        <span>Lvl {student.level}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Info Row: Room, Hall, Gender */}
                            <div className="ar-info-row">
                                <div className="ar-info-item">
                                    <span className="ar-info-label">Room</span>
                                    <span className="ar-info-value">{student.room_number}</span>
                                </div>
                                <div className="ar-info-item">
                                    <span className="ar-info-label">Hall</span>
                                    <span className="ar-info-value">{student.hall_name}</span>
                                </div>
                                <div className="ar-info-item">
                                    <span className="ar-info-label">Gender</span>
                                    <span className="ar-info-value">{student.gender}</span>
                                </div>
                            </div>

                            {/* Action Buttons: View Receipt + Download PDF */}
                            <div className="ar-actions">
                                {/* Toggle button to expand/collapse receipt details */}
                                <button
                                    className="ar-btn ar-btn-view"
                                    onClick={() => toggleReceipt(student.receipt_no)}
                                >
                                    {expandedReceipt === student.receipt_no ? '▲ Hide Receipt' : '▼ View Receipt'}
                                </button>

                                {/* PDF download button
                                    Uses @react-pdf/renderer to generate real PDF files */}
                                <PDFDownloadLink
                                    document={<ReceiptDocument data={student} />}
                                    fileName={`BU-Receipt_${student.matric_no}.pdf`}
                                    className="ar-btn ar-btn-download"
                                >
                                    {({ loading: pdfLoading }) => pdfLoading ? 'Generating...' : '⬇ Download PDF'}
                                </PDFDownloadLink>
                            </div>

                            {/* Expanded Receipt Detail
                                Only shows when the admin clicks "View Receipt" */}
                            {expandedReceipt === student.receipt_no && (
                                <div className="ar-receipt-detail">
                                    <div className="ar-receipt-grid">
                                        {/* Each item shows a label and value */}
                                        <div className="ar-receipt-item">
                                            <span className="ar-receipt-label">Receipt No</span>
                                            <span className="ar-receipt-value">{student.receipt_no}</span>
                                        </div>
                                        <div className="ar-receipt-item">
                                            <span className="ar-receipt-label">Transaction Ref</span>
                                            <span className="ar-receipt-value">{student.transaction_reference}</span>
                                        </div>
                                        <div className="ar-receipt-item">
                                            <span className="ar-receipt-label">Amount Paid</span>
                                            <span className="ar-receipt-value">₦{student.amount_paid}</span>
                                        </div>
                                        <div className="ar-receipt-item">
                                            <span className="ar-receipt-label">Allocation Date</span>
                                            <span className="ar-receipt-value">
                                                {student.allocation_date
                                                    ? new Date(student.allocation_date).toLocaleDateString()
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="ar-receipt-item">
                                            <span className="ar-receipt-label">Status</span>
                                            <span className="ar-receipt-value" style={{ textTransform: 'capitalize' }}>
                                                {student.status}
                                            </span>
                                        </div>
                                        <div className="ar-receipt-item">
                                            <span className="ar-receipt-label">Email</span>
                                            <span className="ar-receipt-value">{student.email}</span>
                                        </div>
                                        <div className="ar-receipt-item">
                                            <span className="ar-receipt-label">Phone</span>
                                            <span className="ar-receipt-value">{student.phone_number || 'N/A'}</span>
                                        </div>
                                        <div className="ar-receipt-item">
                                            <span className="ar-receipt-label">Address</span>
                                            <span className="ar-receipt-value">{student.house_address || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Export so it can be used in App.jsx
export default AdminReceipts
