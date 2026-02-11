// ==================================================
// PROTECTEDROUTE.JSX - This guards pages from unauthorized access
// ==================================================
// Think of this as a security guard:
// - It checks if someone is logged in before showing them a page
// - If they're not logged in, it sends them to the login page
// - It protects sensitive pages like the dashboard

import React from "react";
import { Navigate } from "react-router-dom";

// ==================================================
// PROTECTED ROUTE COMPONENT
// ==================================================
// This component wraps around pages that should only be seen by logged-in users
// Parameters: 
//   - children: The page content to show if user is logged in
//   - allowedRole: (Optional) Specific role required to see this page
const ProtectedRoute = ({ children, allowedRole }) => {
    // Step 1: Check browser storage to see if a student is logged in
    const userString = localStorage.getItem("user");

    // Step 2: Check browser storage to see if an admin is logged in
    const adminString = localStorage.getItem("Admin");

    // Step 3: Convert the stored text back into usable data
    // If nothing is stored, set to null (meaning not logged in)
    const user = userString ? JSON.parse(userString) : null;
    const admin = adminString ? JSON.parse(adminString) : null;

    // Step 4: If NEITHER a student NOR an admin is logged in
    if (!user && !admin) {
        // Redirect them to the student login page
        // (You can't see protected pages without logging in!)
        return <Navigate to="/studentlogin" />
    }

    // Step 5: If a specific role is required for this page
    // Check if the logged-in person has the right role
    const currentUser = user || admin;  // Get whoever is logged in
    if (allowedRole && currentUser.role !== allowedRole) {
        // They don't have the right role - send them back home
        return <Navigate to="/" />
    }

    // Step 6: They passed all the checks! Show them the protected page
    return children;
}

// Export this component so it can be used to protect other pages
export default ProtectedRoute