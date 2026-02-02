import { Link } from "react-router-dom"
function LandingPage(){
    return(
        <div>
            <h1>Landing Page</h1>
            <button><Link to="/studentlogin">Student Login</Link></button>
            <button><Link to="/adminlogin">Admin Login</Link></button>
        </div>
    )
}

export default LandingPage