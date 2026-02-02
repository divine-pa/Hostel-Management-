import axios from "axios"

const API_URL = "http://localhost:8000/api/"

export const loginuser = async (matriculation_number, password) => {
    try {
        const response = await axios.post(API_URL + 'student/login/', {
            matriculation_number,
            password
        });
        if (response.data.access) {
            localStorage.setItem('user', JSON.stringify(response.data))
        }
        return response.data;
    } catch (error) {
        throw error;
    }


}

export const loginadmin = async (email, password) => {
    try {
        const response = await axios.post(API_URL + 'admin/login/', {
            email,
            password
        });
        if (response.data.access) {
            localStorage.setItem('Admin', JSON.stringify(response.data))
        }
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const logout = () => {
    localStorage.removeItem('user');
}

export const Adminlogout = () => {
    localStorage.removeItem('Admin')
}