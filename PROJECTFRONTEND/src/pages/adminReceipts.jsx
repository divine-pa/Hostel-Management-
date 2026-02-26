// ==================================================
// ADMINRECEIPTS.JSX - Admin view of all student receipts
// ==================================================
// This page lets admins see every allocated student in their hall
// with basic info, view the full receipt, and download it as PDF

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAdminReceipts } from '../services/auth'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ReceiptDocument from './ReceiptDocument'
import './adminReceipts.css'

function AdminReceipts() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [students, setStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedReceipt, setExpandedReceipt] = useState(null) // tracks which receipt is expanded

    useEffect(() => {
        const loadReceipts = async () => {
            try {
                const userString = localStorage.getItem('Admin')
                if (!userString) {
                    navigate('/adminlogin')
                    return
                }

                const admin = JSON.parse(userString)
                const data = await getAdminReceipts(admin.email)
                setStudents(data)
                setFilteredStudents(data)
                setLoading(false)
            } catch (err) {
                console.error('Error loading receipts:', err)
                setError('Failed to load student receipts.')
                setLoading(false)

                if (err.response && err.response.status === 401) {
                    navigate('/adminlogin')
                }
            }
        }
        loadReceipts()
    }, [navigate])

    // Search handler
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase()
        setSearchTerm(term)

        if (term === '') {
            setFilteredStudents(students)
            return
        }

        const results = students.filter(s =>
            s.full_name.toLowerCase().includes(term) ||
            s.matric_no.toLowerCase().includes(term) ||
            s.room_number.toLowerCase().includes(term)
        )
        setFilteredStudents(results)
    }

    // Toggle receipt detail expansion
    const toggleReceipt = (receiptNo) => {
        setExpandedReceipt(prev => prev === receiptNo ? null : receiptNo)
    }

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return '?'
        const parts = name.trim().split(' ')
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0][0].toUpperCase()
    }

    if (loading) return <div className="ar-page"><p>Loading student receipts...</p></div>
    if (error) return <div className="ar-page"><p style={{ color: '#e11d48' }}>{error}</p></div>

    return (
        <div className="ar-page">
            <Link to="/admindashboard" className="ar-back">← Back to Dashboard</Link>
            <h1 className="ar-title">Student Receipts</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name, matric number, or room..."
                value={searchTerm}
                onChange={handleSearch}
                className="ar-search"
            />

            {filteredStudents.length === 0 ? (
                <p className="ar-no-data">No student receipts found.</p>
            ) : (
                <div className="ar-list">
                    {filteredStudents.map(student => (
                        <div className="ar-card" key={student.receipt_no}>
                            {/* Card Header */}
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

                            {/* Basic Info Row */}
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

                            {/* Action Buttons */}
                            <div className="ar-actions">
                                <button
                                    className="ar-btn ar-btn-view"
                                    onClick={() => toggleReceipt(student.receipt_no)}
                                >
                                    {expandedReceipt === student.receipt_no ? '▲ Hide Receipt' : '▼ View Receipt'}
                                </button>

                                <PDFDownloadLink
                                    document={<ReceiptDocument data={student} />}
                                    fileName={`BU-Receipt_${student.matric_no}.pdf`}
                                    className="ar-btn ar-btn-download"
                                >
                                    {({ loading: pdfLoading }) => pdfLoading ? 'Generating...' : '⬇ Download PDF'}
                                </PDFDownloadLink>
                            </div>

                            {/* Expanded Receipt Detail */}
                            {expandedReceipt === student.receipt_no && (
                                <div className="ar-receipt-detail">
                                    <div className="ar-receipt-grid">
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

export default AdminReceipts
