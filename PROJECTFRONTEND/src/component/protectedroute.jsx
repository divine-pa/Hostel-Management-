import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children, allowedRole}) =>{
    const userString = localStorage.getItem("user")
    const user = userString ? JSON.parse(userString) : null

    if(!user){
        return <Navigate to="/studentlogin"/>

    }
    if(allowedRole && user.role !== allowedRole) {
        return <Navigate to="/"/>
    }
    return children
}
export default ProtectedRoute