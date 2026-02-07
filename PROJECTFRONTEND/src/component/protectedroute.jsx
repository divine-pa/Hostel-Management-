import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
    // Check for both student and admin authentication
    const userString = localStorage.getItem("user");
    const adminString = localStorage.getItem("Admin");

    const user = userString ? JSON.parse(userString) : null;
    const admin = adminString ? JSON.parse(adminString) : null;

    // If neither user nor admin is logged in, redirect based on context
    if (!user && !admin) {
        // You can make this smarter by checking the current path
        return <Navigate to="/studentlogin" />
    }

    // If checking for specific role and it doesn't match, redirect to home
    const currentUser = user || admin;
    if (allowedRole && currentUser.role !== allowedRole) {
        return <Navigate to="/" />
    }

    return children;
}

export default ProtectedRoute