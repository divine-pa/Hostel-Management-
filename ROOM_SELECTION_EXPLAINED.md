# 🏠 Room Selection Feature — Code Explained

This document explains ALL the new code we added to let students **pick their own room**.
Every piece of syntax is broken down so you understand exactly what's happening.

---

## Table of Contents
1. [The Big Picture (How It Works)](#the-big-picture)
2. [Backend: StudentRoomSerializer](#1-studentroomserializer)
3. [Backend: available_rooms Endpoint](#2-available_rooms-endpoint)
4. [Backend: Updated book_room View](#3-updated-book_room-view)
5. [Frontend: getAvailableRooms Service](#4-getavailablerooms-service)
6. [Frontend: State Variables](#5-new-state-variables)
7. [Frontend: handleSelectHall Function](#6-handleselecthall-function)
8. [Frontend: Block Grouping Logic](#7-block-grouping-logic)
9. [Frontend: The JSX (UI) Code](#8-the-jsx-ui-code)

---

## The Big Picture

**Before:** Student clicks "Select" on a hall → system auto-assigns a random room.

**After:** Student clicks "Select" on a hall → sees rooms grouped by block (A, B, C, D) → picks a specific room → clicks "Book".

```
Hall List  →  Block Tabs (A Block, B Block...)  →  Room Cards  →  Book Button
```

---

## 1. StudentRoomSerializer

**File:** `serializers.py`

```python
class StudentRoomSerializer(serializers.ModelSerializer):
    room_status = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ['room_id', 'room_number', 'capacity', 'current_occupants', 'room_status']

    def get_room_status(self, obj):
        if obj.is_under_maintenance:
            return 'Maintenance'
        if obj.current_occupants >= obj.capacity:
            return 'Full'
        return 'Available'
```

### What each part means:

| Code | Meaning |
|------|---------|
| `serializers.ModelSerializer` | Automatically creates fields from the Room model |
| `serializers.SerializerMethodField()` | Creates a custom field that calls a function (get_room_status) |
| `fields = [...]` | Only these fields are sent to the frontend — **NO student names** (privacy!) |
| `get_room_status(self, obj)` | `obj` is the current Room. It checks conditions and returns a status string |
| `obj.is_under_maintenance` | Checks if this room's maintenance flag is True |
| `obj.current_occupants >= obj.capacity` | Checks if room is full (e.g., 4/4 beds taken) |

### Why it matters:
Without this serializer, we'd send ALL room data (including student names) to the frontend.
This serializer acts as a **filter** — only safe data gets through.

---

## 2. available_rooms Endpoint

**File:** `views.py`

```python
@api_view(['GET'])
@permission_classes([AllowAny])
def available_rooms(request):
    hall_id = request.query_params.get('hall_id')

    if not hall_id:
        return Response({"error": "hall_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    rooms = Room.objects.filter(
        hall_id=hall_id,
        current_occupants__lt=F('capacity'),
        is_under_maintenance=False
    ).order_by('room_number')

    serializer = StudentRoomSerializer(rooms, many=True)
    return Response(serializer.data)
```

### Breaking it down:

| Code | What it does |
|------|-------------|
| `@api_view(['GET'])` | This endpoint only accepts GET requests (fetching data, not changing it) |
| `request.query_params.get('hall_id')` | Reads `hall_id` from the URL: `/api/available-rooms/?hall_id=5` → gets `5` |
| `Room.objects.filter(...)` | Searches the database for rooms matching ALL these conditions |
| `hall_id=hall_id` | Room must be in the specified hall |
| `current_occupants__lt=F('capacity')` | **This is the key line!** See below ⬇️ |
| `is_under_maintenance=False` | Skip rooms that are broken/being repaired |
| `.order_by('room_number')` | Sort results alphabetically (A101, A102, B101...) |
| `many=True` | Tells the serializer "this is a LIST of rooms, not just one" |

### The `__lt` and `F()` explained:

```python
current_occupants__lt=F('capacity')
```

- `__lt` means "less than" (it's a Django lookup — double underscore + operator)
- `F('capacity')` means "the value of the capacity column in the SAME row"
- Together: "give me rooms where current_occupants < capacity" (i.e., NOT full)

Other Django lookups you might see:
- `__gt` = greater than
- `__gte` = greater than or equal
- `__lte` = less than or equal
- `__exact` = exactly equals (default)
- `__contains` = text contains substring

---

## 3. Updated book_room View

**File:** `views.py` — only the NEW parts explained:

```python
room_id = serializer.validated_data['room_id']    # NEW: Get the room the student picked

room = Room.objects.select_for_update().get(
    room_id=room_id,        # Must match the specific room
    hall_id=hall_id,        # Must be in the correct hall (security check!)
)
```

### Why `hall_id=hall_id` in the room lookup?

**Security!** Without this, a hacker could send `hall_id=1` but `room_id=999` (a room in a different hall).
By requiring BOTH to match, we make sure the room actually belongs to the hall they selected.

### What is `select_for_update()`?

```python
Room.objects.select_for_update().get(...)
```

Imagine two students trying to book the LAST bed at the exact same time:
- Without `select_for_update()`: Both see 1 bed available → both book it → crash!
- With `select_for_update()`: First student LOCKS the row → second student waits → first finishes → second sees it's full

It's like putting a "RESERVED" sign on the database row while you're working with it.

---

## 4. getAvailableRooms Service

**File:** `auth.jsx`

```javascript
export const getAvailableRooms = async (hall_id) => {
    try {
        const response = await axios.get(`${API_URL}available-rooms/?hall_id=${hall_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
```

### Template literal syntax: `` ` ` ``

```javascript
`${API_URL}available-rooms/?hall_id=${hall_id}`
```

- Backticks `` ` `` create a **template literal** (a special string)
- `${...}` inserts a variable's value into the string
- If `API_URL = "http://localhost:8000/api/"` and `hall_id = 5`, this becomes:
  `"http://localhost:8000/api/available-rooms/?hall_id=5"`

This is MUCH cleaner than the old way:
```javascript
// Old way (ugly):
API_URL + "available-rooms/?hall_id=" + hall_id
// New way (clean):
`${API_URL}available-rooms/?hall_id=${hall_id}`
```

---

## 5. New State Variables

**File:** `studentdashboard.jsx`

```javascript
const [selectedHall, setSelectedHall] = useState(null);
const [rooms, setRooms] = useState([]);
const [roomsLoading, setRoomsLoading] = useState(false);
const [selectedBlock, setSelectedBlock] = useState(null);
```

### How useState works (quick refresher):

```javascript
const [value, setValue] = useState(initialValue);
//     ↑           ↑                    ↑
//  current     function to         starting
//  value       change it           value
```

| State | Purpose | Initial Value |
|-------|---------|---------------|
| `selectedHall` | Which hall card they clicked (or `null` if viewing hall list) | `null` |
| `rooms` | Array of room objects from the API | `[]` (empty array) |
| `roomsLoading` | Show "Loading..." while fetching rooms | `false` |
| `selectedBlock` | Which block tab is active ("A", "B", etc.) | `null` |

---

## 6. handleSelectHall Function

```javascript
const handleSelectHall = async (hall) => {
    try {
        setRoomsLoading(true)           // Show loading spinner
        setSelectedHall(hall)           // Remember which hall was clicked
        const roomData = await getAvailableRooms(hall.hall_id)   // Fetch rooms
        setRooms(roomData)              // Store the rooms
    } catch (error) {
        console.error("Error fetching rooms:", error)
        alert("Failed to load rooms. Please try again.")
        setSelectedHall(null)           // Go back to hall list on error
    } finally {
        setRoomsLoading(false)          // Hide loading spinner (always runs)
    }
}
```

### try / catch / finally:

```
try {
    // Code that MIGHT fail (like network requests)
}
catch (error) {
    // Runs ONLY if something went wrong
}
finally {
    // Runs ALWAYS (whether it worked or failed)
    // Perfect for hiding loading spinners!
}
```

---

## 7. Block Grouping Logic

This is the most complex new code. Let's break it down piece by piece:

```javascript
// Step 1: Create an empty object to hold our groups
const blocks = {};

// Step 2: Loop through every room and sort them into blocks
rooms.forEach((room) => {
    const blockLetter = room.room_number.charAt(0).toUpperCase();
    if (!blocks[blockLetter]) blocks[blockLetter] = [];
    blocks[blockLetter].push(room);
});

// Step 3: Get the block letters sorted alphabetically
const blockKeys = Object.keys(blocks).sort();

// Step 4: Determine which block tab to show
const activeBlock = selectedBlock && blocks[selectedBlock] ? selectedBlock : blockKeys[0];
```

### Step-by-step example:

Imagine these rooms come from the API:
```
B101, B102, B103, A101, A102, C101
```

**After Step 1:** `blocks = {}`

**After Step 2 (the forEach loop):**
```javascript
blocks = {
    "B": [B101, B102, B103],   // 3 rooms
    "A": [A101, A102],         // 2 rooms
    "C": [C101]                // 1 room
}
```

How? Let's trace room `B101`:
```javascript
room.room_number           // "B101"
   .charAt(0)              // "B" (first character)
   .toUpperCase()          // "B" (already uppercase, but just in case)

// blockLetter = "B"

if (!blocks["B"])          // blocks["B"] doesn't exist yet → true
    blocks["B"] = [];      // Create empty array: blocks = { "B": [] }

blocks["B"].push(room);   // Add room: blocks = { "B": [B101] }
```

**After Step 3:** `blockKeys = ["A", "B", "C"]` (sorted)

**After Step 4:** If user clicked "B Block" tab → `activeBlock = "B"`.
If user hasn't clicked anything → `activeBlock = "A"` (first one).

### Syntax explained:
/
| Code | What it does |
|------|-------------|
| `room.room_number.charAt(0)` | Gets the first character of the string |
| `.toUpperCase()` | Converts to uppercase (handles "b101" → "B") |
| `!blocks[blockLetter]` | Check if this block doesn't exist yet |
| `blocks[blockLetter] = []` | Create a new empty array for this block |
| `.push(room)` | Add the room to the end of the array |
| `Object.keys(blocks)` | Get all the keys: `["B", "A", "C"]` |
| `.sort()` | Sort alphabetically: `["A", "B", "C"]` |
| `condition ? valueIfTrue : valueIfFalse` | Ternary operator (inline if/else) |

---

## 8. The JSX (UI) Code

### The IIFE Pattern: `(() => { ... })()`

```jsx
{(() => {
    // JavaScript logic here
    const blocks = { ... };
    return ( <div>...</div> );
})()}
```

**What is this?** An **Immediately Invoked Function Expression (IIFE)**.
- `(() => { ... })` creates a function
- `()` at the end calls it immediately
- We need this because JSX `{}` expects an **expression** (a value), not statements (logic).
- The function lets us write multi-line logic and then return JSX.

### The Block Tabs:

```jsx
<button
    className={`btn ${activeBlock === block ? 'btn-primary' : 'btn-secondary'}`}
    onClick={() => setSelectedBlock(block)}
>
    {block} Block
    <span>({blocks[block].length})</span>
</button>
```

| Code | What it does |
|------|-------------|
| `` className={`btn ${...}`} `` | Dynamic CSS class using template literal |
| `activeBlock === block ? 'btn-primary' : 'btn-secondary'` | If this tab is active, use primary color; otherwise secondary |
| `onClick={() => setSelectedBlock(block)}` | When clicked, set this as the active block |
| `{block} Block` | Displays "A Block", "B Block", etc. |
| `blocks[block].length` | Number of rooms in this block |

### The Room Cards:

```jsx
{blocks[activeBlock].map((room) => (
    <div key={room.room_id} ...>
        <h3>Room {room.room_number}</h3>
        <p>{room.current_occupants}/{room.capacity} beds taken</p>
        <button onClick={() => handleBooking(selectedHall.hall_id, room.room_id, room.room_number)}>
            Book
        </button>
    </div>
))}
```

| Code | What it does |
|------|-------------|
| `blocks[activeBlock]` | Get the rooms array for the currently selected block |
| `.map((room) => (...))` | Loop through each room and create a card |
| `key={room.room_id}` | React needs a unique key for each item in a list |
| `{room.current_occupants}/{room.capacity}` | Shows like "2/4 beds taken" |

---

## Quick Reference: Full User Flow

```
1. Student logs in
2. Dashboard loads → API returns available halls
3. Student clicks "Select" on a hall
   → handleSelectHall() runs
   → Calls GET /api/available-rooms/?hall_id=5
   → Rooms arrive, grouped into blocks
4. Block tabs appear: [A Block (25)] [B Block (30)] [C Block (20)]
5. Student clicks "B Block" tab
   → setSelectedBlock("B")
   → Only B Block rooms show
6. Student clicks "Book" on Room B101
   → handleBooking() runs
   → Confirmation popup
   → Calls POST /api/bookRoom/ with {hall_id, room_id, matriculation_number}
   → Backend validates → Books the room → Dashboard refreshes
```
