import axios from "axios"

const API_URL = "http://localhost:8000/api/"
//student login 
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
//get student dashboard
export const getStudentDashboard = async (matriculation_number) => {
    try {
        const response = await axios.get(`${API_URL}student/dashboard/?matriculation_number=${matriculation_number}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
//admin login 
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

//admin dashboard

export const logout = () => {
    localStorage.removeItem('user');
}

export const Adminlogout = () => {
    localStorage.removeItem('Admin')
}