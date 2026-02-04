import { getStudentDashboard } from "../services/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function StudentDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const userString = localStorage.getItem('user');
                if (!userString) {
                    navigate('/studentlogin')
                    return
                }
                const user = JSON.parse(userString);

                const matricparm = user.matriculation_number || user.matric_number
                const data = await getStudentDashboard(user.access, matricparm);
                setDashboardData(data);
                setLoading(false);
            } catch (error) {
                console.error("Dashboard Error:", error);
                setError("Failed to load dashboard data.");
                setLoading(false);
                if (error.response && error.response.status === 401) {
                    navigate('/studentlogin')
                }
            }
        };
        loadData();
    }, [navigate])
    // 2. LOADING & ERROR STATES
    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!dashboardData) return null;

    // Destructure for cleaner code
    const { profile, available_halls } = dashboardData;
    const { room_details } = profile; // Use the nested details from serializer

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto">

                    {/* --- HEADER SECTION --- */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {profile.full_name}</h1>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <p><strong>Matric No:</strong> {profile.matriculation_number}</p>
                            <p><strong>Department:</strong> {profile.department}</p>
                            <p><strong>Level:</strong> {profile.level}</p>
                            <p>
                                <strong>Payment Status: </strong>
                                <span className={`font-bold ${profile.payment_status === 'Verified' ? 'text-green-600' : 'text-red-500'}`}>
                                    {profile.payment_status}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* --- CONDITIONAL ACTION AREA --- */}
                    <div className="bg-white rounded-lg shadow-md p-6">

                        {/* SCENARIO A: Has a Room (Allocation Complete) */}
                        {room_details ? (
                            <div className="text-center border-l-4 border-green-500 pl-4">
                                <h2 className="text-xl font-bold text-green-700 mb-2">Allocated Room</h2>
                                <p className="text-lg">You have been assigned to:</p>
                                <div className="mt-4 p-4 bg-green-50 rounded-lg inline-block">
                                    <p className="text-2xl font-bold text-gray-800">{room_details.hall_name}</p>
                                    <p className="text-4xl font-extrabold text-blue-600 mt-2">{room_details.room_number}</p>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">Please present this ticket at the porter's lodge.</p>
                            </div>
                        )

                            /* SCENARIO B: Payment Not Verified */
                            : profile.payment_status !== 'Verified' ? (
                                <div className="text-center py-8">
                                    <h2 className="text-xl font-bold text-red-600 mb-2">Action Required</h2>
                                    <p>Your school fees payment has not been verified yet.</p>
                                    <p className="text-gray-500 text-sm mt-2">Please contact the bursary or wait for verification.</p>
                                </div>
                            )

                                /* SCENARIO C: Verified but No Room (Show Halls) */
                                : (
                                    <div>
                                        <h2 className="text-xl font-bold text-blue-800 mb-4">Select a Hall</h2>
                                        {available_halls.length === 0 ? (
                                            <p className="text-red-500">No halls are currently available for your gender.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {available_halls.map((hall) => (
                                                    <div key={hall.hall_id} className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer flex justify-between items-center">
                                                        <div>
                                                            <h3 className="font-bold text-lg">{hall.hall_name}</h3>
                                                            <p className="text-sm text-gray-500">{hall.available_rooms} rooms left</p>
                                                        </div>
                                                        <button
                                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                            onClick={() => alert(`Logic to book room in ${hall.hall_name} coming next!`)}
                                                        >
                                                            Select
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentDashboard