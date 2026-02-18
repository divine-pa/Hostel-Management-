// ==================================================
// DISPLAYSTUDENT.JSX - View students in a specific room
// ==================================================
// This page shows all students living in a specific room.
// The admin gets here by clicking "View Students" on a room
// in the admin dashboard. The room data is passed via
// React Router's navigation state (no extra API call needed).

import { useLocation, useNavigate } from "react-router-dom";

function ViewStudent() {
    // useLocation gives us access to data passed during navigation
    // When the admin clicks "View Students", we pass the room object here
    const location = useLocation();
    const navigate = useNavigate();

    // Get the room data that was passed from the admin dashboard
    const room = location.state?.room;

    // If no room data was passed (e.g., user typed the URL directly),
    // show an error message with a back button
    if (!room) {
        return (
            <div style={{ minHeight: '100vh', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg)' }}>
                <div className="content-wrapper">
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <h2 style={{ color: 'var(--color-error)', marginBottom: 'var(--spacing-md)' }}>
                            No Room Selected
                        </h2>
                        <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            Please go back to the admin dashboard and click "View Students" on a room.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/admindashboard')}
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Get the list of students in this room (or empty array if none)
    const students = room.occupants_list || [];

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg)' }}>
            <div className="content-wrapper">

                {/* ===== HEADER CARD ===== */}
                <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>

                    {/* Back button + Page title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate('/admindashboard')}
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 style={{ marginBottom: '0' }}>Room {room.room_number}</h1>
                    </div>

                    {/* Room stats */}
                    <div className="grid grid-3" style={{ gap: 'var(--spacing-md)' }}>
                        {/* Occupancy */}
                        <div style={{
                            background: 'var(--color-bg)',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center'
                        }}>
                            <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>Occupancy</p>
                            <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: '0' }}>
                                {room.current_occupants} / {room.capacity}
                            </p>
                        </div>

                        {/* Status */}
                        <div style={{
                            background: 'var(--color-bg)',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center'
                        }}>
                            <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>Status</p>
                            <span className={room.room_status === 'Available' ? 'badge badge-success' : 'badge badge-error'}>
                                {room.room_status}
                            </span>
                        </div>

                        {/* Maintenance */}
                        <div style={{
                            background: 'var(--color-bg)',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center'
                        }}>
                            <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>Maintenance</p>
                            <span className="badge" style={{
                                background: room.is_under_maintenance ? '#f59e0b' : '#10b981',
                                color: 'white'
                            }}>
                                {room.is_under_maintenance ? '🔧 Yes' : '✓ No'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ===== STUDENTS LIST ===== */}
                <div className="card">
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-lg)' }}>
                        Students in this Room ({students.length})
                    </h2>

                    {students.length === 0 ? (
                        <p className="text-secondary" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                            No students are currently assigned to this room.
                        </p>
                    ) : (
                        <div className="grid grid-1" style={{ gap: 'var(--spacing-md)' }}>
                            {students.map((student) => (
                                <div
                                    key={student.matric_number}
                                    style={{
                                        background: 'white',
                                        padding: 'var(--spacing-lg)',
                                        borderRadius: 'var(--radius-lg)',
                                        borderLeft: '4px solid var(--color-primary)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: '1px solid var(--color-border)',
                                        transition: 'all var(--transition-base)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {/* Student info */}
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xs)' }}>
                                            {student.full_name}
                                        </p>
                                        <p style={{ marginBottom: '0', fontSize: 'var(--font-size-sm)', color: '#666' }}>
                                            Matric No: {student.matric_number}
                                        </p>
                                    </div>

                                    {/* Student badge */}
                                    <span className="badge badge-success">Active</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default ViewStudent