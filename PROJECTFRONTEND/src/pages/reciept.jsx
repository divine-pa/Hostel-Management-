// ==================================================
// RECIEPT.JSX - Student's official room allocation receipt
// ==================================================
// This page shows a student's official receipt after they've been allocated a room
// It displays all the important information they need to show at the porter's lodge

import { RecipetData } from "../services/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReceiptDocument from './ReceiptDocument';
// ==================================================
// RECEIPT PAGE COMPONENT
// ==================================================
function ReceiptPage() {
    // ===== STATE VARIABLES =====
    // These are like boxes that hold information while the page is running
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recieptData, setRecieptData] = useState(null);

    // ===== LOAD RECEIPT DATA WHEN PAGE OPENS =====
    useEffect(() => {
        const loadData = async () => {
            try {
                // Step 1: Check if the student is logged in
                const userString = localStorage.getItem('user');

                if (!userString) {
                    // If not logged in, send them back to student dashboard
                    navigate('/studentdashboard')
                    return
                }

                // Step 2: Get the student's matric number from storage
                const user = JSON.parse(userString);
                const matricparm = user.matriculation_number || user.matric_number

                // Step 3: Fetch the receipt data from the server
                const data = await RecipetData(matricparm);
                setRecieptData(data);
                setLoading(false);

            } catch (error) {
                // If something went wrong, show error
                console.error(error)
                setError("Failed to load receipt data")
                setLoading(false)

                // If they're not authorized, send them to login
                if (error.response && error.response.status === 401) {
                    navigate('/studentlogin')
                }
            }
        }
        loadData();
    }, [navigate])

    // ===== LOADING & ERROR STATES =====
    // If still loading, show "Loading..." message
    if (loading) return <div>Loading receipt...</div>;

    // If there's an error, show the error message
    if (error) return <div>{error}</div>;

    // If no data, don't show anything
    if (!recieptData) return null;

    return (
        <div>
            <h1>OFFICIAL RECEIPT</h1>
            <p>Room Allocation Receipt</p>
            <p>Receipt No: {recieptData.receipt_no}</p>

            <hr />

            <h2>Student Information</h2>
            <p><strong>Full Name:</strong> {recieptData.full_name}</p>
            <p><strong>Matric Number:</strong> {recieptData.matric_no}</p>
            <p><strong>Department:</strong> {recieptData.department}</p>
            <p><strong>Level:</strong> {recieptData.level}</p>
            <p><strong>Gender:</strong> {recieptData.gender}</p>
            <p><strong>Email:</strong> {recieptData.email}</p>
            <p><strong>Phone:</strong> {recieptData.phone_number}</p>
            <p><strong>Address:</strong> {recieptData.house_address}</p>

            <hr />

            <h2>Allocation Information</h2>
            <p><strong>Hall:</strong> {recieptData.hall_name}</p>
            <p><strong>Room Number:</strong> {recieptData.room_number}</p>
            <p><strong>Allocation Date:</strong> {new Date(recieptData.allocation_date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {recieptData.status}</p>
            <p><strong>Transaction Reference:</strong> {recieptData.transaction_reference}</p>
            <p><strong>Amount Paid:</strong> {recieptData.amount_paid}</p>
            
            <hr />

            <p><strong>Instructions:</strong></p>
            <p>Please present this receipt at the porter's lodge to access your room.</p>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={() => navigate('/studentdashboard')}>Back to Dashboard</button>

                {recieptData && (
                    <PDFDownloadLink document={<ReceiptDocument data={recieptData} />}
                        fileName={`BU-Receipt_${recieptData.matric_no}.pdf`}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#003366',
                            color: 'white',
                            borderRadius: '8px',
                            textDecoration: 'none'
                        }}>
                        {({ loading }) => loading ? 'Generating...' : 'Download E-receipt'}

                    </PDFDownloadLink>
                )}
            </div>
        </div>

    )
}

// Export this component so it can be used in App.jsx
export default ReceiptPage;