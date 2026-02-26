import { useState, useEffect } from 'react'
import './persistent.css'

function Persistence() {
    // Use state so the component re-renders when data changes
    const [result, setResult] = useState(() => {
        const data = localStorage.getItem("hostel_rooms_data")
        try {
            const parsed = JSON.parse(data)
            return Array.isArray(parsed) ? parsed : null
        } catch {
            return null
        }
    })

    // Re-read localStorage every 10 seconds to pick up fresh data
    useEffect(() => {
        const fetchInterval = setInterval(() => {
            const data = localStorage.getItem("hostel_rooms_data")
            try {
                const parsed = JSON.parse(data)
                setResult(Array.isArray(parsed) ? parsed : null)
            } catch {
                setResult(null)
            }
        }, 10000)

        return () => clearInterval(fetchInterval)
    }, [])

    // Now the conditional return is AFTER all hooks — no rules violated
    if (!result || result.length === 0) {
        return (
            <div className="persist-page">
                <h1 className="persist-title">Saved Room Data</h1>
                <p className="no-data">No saved room data found.</p>
            </div>
        )
    }

    return (
        <div className="persist-page">
            <h1 className="persist-title">Offline Room Data</h1>
            <div className="room-list">
                {result.map(room => (
                    <div key={room.room_number}>
                        {room.occupants_list && room.occupants_list.length > 0 && (
                            <div className="room-row">
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

            <button onClick={() => window.print()} className="btn btn-primary">Print offline data</button>
        </div>
    )
}

export default Persistence
