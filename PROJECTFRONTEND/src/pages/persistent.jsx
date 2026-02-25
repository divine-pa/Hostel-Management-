function Persistent() {
    const savedData = localStorage.getItem('hostel_rooms_data');
    const rooms = savedData ? JSON.parse(savedData) : [];
    
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Room Persistence Test</h1>
            
            {rooms.length > 0 ? (
                rooms.map((room) => (
                    <div key={room.room_id} style={{ border: '1px solid #6F55E3', borderRadius: '10px', margin: '10px 0', padding: '15px' }}>
                        {/* 1. Use 'room_number' instead of 'room_name' to match your JSON */}
                        <h3>Room: {room.room_number}</h3>
                        <p>Status: <strong>{room.room_status}</strong></p>
                        <p>Capacity: {room.current_occupants} / {room.capacity}</p>

                        <div style={{ background: '#f9f9fb', padding: '10px', borderRadius: '5px' }}>
                            <h4>Residents:</h4>
                            {/* 2. Logic: occupants_list is an array, so we map it! */}
                            {room.occupants_list && room.occupants_list.length > 0 ? (
                                room.occupants_list.map((student, sIndex) => (
                                    <p key={sIndex} style={{ margin: '5px 0', fontSize: '14px' }}>
                                        👤 {student.full_name} ({student.matric_number}) - {student.department}
                                    </p>
                                ))
                            ) : (
                                <p style={{ color: '#999' }}>No residents yet.</p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No data found in storage. Try picking a room first!</p>
            )}
        </div>
    );
}