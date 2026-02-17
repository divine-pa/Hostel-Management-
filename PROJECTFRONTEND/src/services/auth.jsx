// ==================================================
// AUTH.JSX - This file handles communication with the backend
// ==================================================
// Think of this as a messenger that talks to the server:
// - It sends login requests
// - It saves login information
// - It fetches dashboard data
// - It sends room booking requests

import axios from "axios"

// The base URL of our backend server (where the Django API is running)
const API_URL = "http://localhost:8000/api/"

// ==================================================
// STUDENT LOGIN FUNCTION
// ==================================================
// This function tries to log a student in
// Parameters: matriculation_number (the student's matric number), password (their secret code)
export const loginuser = async (matriculation_number, password) => {
    try {
        // Step 1: Send the matric number and password to the server
        const response = await axios.post(API_URL + 'student/login/', {
            matriculation_number,
            password
        });

        // Step 2: If login was successful (we got an access token)
        if (response.data.access) {
            // Save the user's information in browser storage (so they stay logged in)
            localStorage.setItem('user', JSON.stringify(response.data))
        }

        // Step 3: Return the response data (includes tokens and student info)
        return response.data;

    } catch (error) {
        // If something went wrong (wrong password, no internet, etc.), throw the error
        throw error;
    }
}

// ==================================================
// GET STUDENT DASHBOARD FUNCTION
// ==================================================
// This function fetches a student's dashboard information
// Parameter: matriculation_number (which student's data to get)
export const getStudentDashboard = async (matriculation_number) => {
    try {
        // Step 1: Ask the server for this student's dashboard data
        const response = await axios.get(`${API_URL}student/dashboard/?matriculation_number=${matriculation_number}`);

        // Step 2: Return the dashboard data
        return response.data;

    } catch (error) {
        // If something went wrong, throw the error
        throw error;
    }
}

// ==================================================
// ADMIN LOGIN FUNCTION
// ==================================================
// This function tries to log an admin in
// Parameters: email (the admin's email), password (their secret code)
export const loginadmin = async (email, password) => {
    try {
        // Step 1: Send the email and password to the server
        const response = await axios.post(API_URL + 'admin/login/', {
            email,
            password
        });

        // Step 2: If login was successful (we got an access token)
        if (response.data.access) {
            // Save the admin's information in browser storage
            localStorage.setItem('Admin', JSON.stringify(response.data))
        }

        // Step 3: Return the response data (includes tokens and admin info)
        return response.data;

    } catch (error) {
        // If something went wrong, throw the error
        throw error;
    }
}

// ==================================================
// GET ADMIN DASHBOARD FUNCTION
// ==================================================
// This function fetches an admin's dashboard information
// Parameter: email (which admin's data to get)
export const getAdminDashboard = async (email) => {
    try {
        // Step 1: Ask the server for this admin's dashboard data
        const response = await axios.get(`${API_URL}admin/dashboard/?email=${email}`);

        // Step 2: Return the dashboard data
        return response.data;

    } catch (error) {
        // If something went wrong, throw the error
        throw error;
    }
}



// ==================================================
// LOGOUT FUNCTION (Student)
// ==================================================
// This function logs a student out
export const logout = () => {
    // Remove the student's information from browser storage
    // (This makes them logged out)
    localStorage.removeItem('user');
}

// ==================================================
// LOGOUT FUNCTION (Admin)
// ==================================================
// This function logs an admin out
export const Adminlogout = () => {
    // Remove the admin's information from browser storage
    localStorage.removeItem('Admin')
}




// ==================================================
// BOOK ROOM FUNCTION
// ==================================================
// This function sends a request to book a room for a student
// Parameters: matriculation_number (which student), hall_id (which hall they want)
export const bookRoom = async (matriculation_number, hall_id) => {
    try {
        // Step 1: Send the booking request to the server
        const response = await axios.post(API_URL + 'bookRoom/', {
            matriculation_number: matriculation_number,
            hall_id: hall_id
        });

        // Step 2: Return the server's response (success or error message)
        return response.data;

    } catch (error) {
        // If something went wrong, throw the error
        throw error;
    }
}


// ==================================================
// GET RECEIPT DATA - Fetches student's allocation receipt
// ==================================================
// This function gets the receipt information for a student
export const RecipetData = async (matriculation_number) => {
    try {
        // Step 1: Send GET request to the server with matric number as a URL parameter
        // IMPORTANT: GET requests use "params", not a body!
        const response = await axios.get(API_URL + 'allocation/', {
            params: {
                matriculation_number: matriculation_number
            }
        });

        // Step 2: Return the server's response (receipt data)
        return response.data;

    } catch (error) {
        // If something went wrong, throw the error so the page can show it
        throw error;
    }
}

// ==================================================
// TOGGLE ROOM MAINTENANCE - Toggles maintenance status for a room
// ==================================================
// This function toggles the maintenance status of a room
// Parameters: roomId (which room), adminEmail (which admin is making the change)
export const toggleRoomMaintenance = async (roomId, adminEmail) => {
    try {
        // Send PATCH request to toggle the room's maintenance status
        const response = await axios.patch(
            `${API_URL}rooms/${roomId}/toggle-maintenance/?email=${adminEmail}`
        );

        // Return the server's response (success message and new status)
        return response.data;

    } catch (error) {
        // If something went wrong, throw the error
        throw error;
    }
}