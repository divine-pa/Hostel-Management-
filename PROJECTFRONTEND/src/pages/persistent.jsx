import './persistent.css'

function Persistence() {
    const data = localStorage.getItem("hostel_rooms_data")
    const result = JSON.parse(data)

    if (!result || !Array.isArray(result)) {
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
        </div>
    )
}

export default Persistence
