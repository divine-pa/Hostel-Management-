import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginadmin } from "../services/auth"

function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handlesubmit = async (e) => {
        e.preventDefault()
        try {
            await loginadmin(email, password)
            navigate("/admindashboard")
        } catch (error) {
            alert("login failed , check your email or password")
        }
    }
    return (
        <div>
            <h1>Admin Login</h1>
            <button><Link to="/landingpage">Back</Link></button>
            <p>login to your account</p>
            <i>use your admin email and password</i>
            <form action="" method="post" onSubmit={handlesubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default AdminLogin