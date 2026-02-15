
{/* Students List (Your existing code) */ }
{
    room.occupants_list && room.occupants_list.length > 0 && (
        <div style={{
            background: 'var(--color-bg)',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            marginTop: 'var(--spacing-md)',
            display: 'none'
        }}  >
            <h5 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-md)' }}>
                Occupants:
            </h5>
            <div >
                {room.occupants_list.map((student) => (
                    <div
                        key={student.matric_number}
                        style={{
                            background: 'white',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '4px solid var(--color-primary)',
                            fontSize: 'var(--font-size-sm)'
                        }}
                    >
                        <p style={{ fontWeight: '700', marginBottom: 'var(--spacing-xs)' }}>
                            {student.full_name}
                        </p>
                        <p style={{ marginBottom: '0', fontSize: 'var(--font-size-xs)', color: '#666' }}>
                            {student.matric_number}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}