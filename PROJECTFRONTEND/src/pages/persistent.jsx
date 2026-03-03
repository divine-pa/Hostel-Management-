// ==================================================
// PERSISTENT.JSX — Offline Room Data Viewer (Legacy)
// ==================================================
// ⚠ NOTE: This page's functionality has been INTEGRATED into AdminStudents.jsx
//   (the "Offline Data" tab). This file is kept for backward compatibility.
//
// WHAT THIS PAGE DOES:
//   - Reads room data saved in localStorage (browser storage)
//   - localStorage keeps data even when the internet goes down
//   - This means admins can still see room info if the server is offline
//   - It re-reads localStorage every 10 seconds to pick up fresh data
//   - Shows each room with its occupants (name, matric, department, level)
//   - Has a "Print" button to print the offline data

import { useState, useEffect } from 'react'
import './persistent.css'

function Persistence() {
    // ===== STATE: room data from localStorage =====
    // useState with a function initializer (runs once on first render)
    // It reads the saved room data from the browser's localStorage
    const [result, setResult] = useState(() => {
        const data = localStorage.getItem("hostel_rooms_data")
        try {
            // Try to convert the saved text into a JavaScript array
            const parsed = JSON.parse(data)
            return Array.isArray(parsed) ? parsed : null
        } catch {
            // If the data is corrupted or not valid JSON, return null
            return null
        }
    })

    // ===== AUTO-REFRESH: re-read localStorage every 10 seconds =====
    // This picks up any new data that AdminLayout saved in the background
    useEffect(() => {
        const fetchInterval = setInterval(() => {
            const data = localStorage.getItem("hostel_rooms_data")
            try {
                const parsed = JSON.parse(data)
                setResult(Array.isArray(parsed) ? parsed : null)
            } catch {
                setResult(null)
            }
        }, 10000) // 10000 milliseconds = 10 seconds

        // Cleanup: stop the interval when the component is removed from the page
        return () => clearInterval(fetchInterval)
    }, [])

    // ===== SHOW "NO DATA" MESSAGE IF THERE'S NOTHING TO DISPLAY =====
    if (!result || result.length === 0) {
        return (
            <div className="persist-page">
                <h1 className="persist-title">Saved Room Data</h1>
                <p className="no-data">No saved room data found.</p>
            </div>
        )
    }

    // ===== RENDER THE ROOM LIST =====
    return (
        <div className="persist-page">
            <h1 className="persist-title">Offline Room Data</h1>
            <div className="room-list">
                {/* Loop through each room in the saved data */}
                {result.map(room => (
                    <div key={room.room_number}>
                        {/* Only show rooms that have occupants */}
                        {room.occupants_list && room.occupants_list.length > 0 && (
                            <div className="room-row">
                                {/* Room header: room number, occupancy count, status */}
                                <div className="room-top">
                                    <div className="room-badge">{room.room_number}</div>
                                    <div className="room-info">
                                        <span className="room-label">Occupancy</span>
                                        <span className="room-value">{room.current_occupants} / {room.capacity}</span>
                                    </div>
                                    <div className="room-info">
                                        <span className="room-label">Status</span>
                                        <span className={`room-status-pill ${room.room_status === 'available' ? 'pill-open' : 'pill-full'}`}>
                                            {room.room_status}
                                        </span>
                                    </div>
                                </div>

                                {/* Resident list: each student living in this room */}
                                <div className="room-residents">
                                    <span className="residents-heading">Residents</span>
                                    {room.occupants_list.map(student => (
                                        <div className="resident" key={student.matric_number}>
                                            <span className="res-name">{student.full_name}</span>
                                            <span className="res-detail">{student.matric_number}</span>
                                            <span className="res-detail">{student.department}</span>
                                            <span className="res-detail">Lvl {student.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Print button: opens the browser's print dialog */}
            <button onClick={() => window.print()} className="btn btn-primary">Print offline data</button>
        </div>
    )
}

// Export so it can be used in App.jsx
export default Persistence
