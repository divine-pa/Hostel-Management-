const data = localStorage.getItem("hostel_rooms_data")
console.log(data)

const result = JSON.parse(data)
console.log(result)

const result2 = result.map(room => {
    return {
        room_number: room.room_number,
        current_occupants: room.current_occupants,
        capacity: room.capacity,
        room_status: room.room_status,
        occupants_list: room.occupants_list
    }
})
console.log(result2)