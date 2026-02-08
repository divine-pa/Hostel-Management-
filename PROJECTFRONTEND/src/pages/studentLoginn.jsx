import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { loginuser } from "../services/auth";


function studentlogin() {
   const [matriculation_number, setMatriculation_number] = useState("")
   const [password, setPassword] = useState("")
   const navigate = useNavigate()

   const handlesubmit = async (e) => {
      e.preventDefault()
      try {
         await loginuser(matriculation_number, password)
         navigate("/studentdashboard")
      } catch (error) {
         alert("login failed , check your matric number or password")
      }
   }

   return (
      <div className="page-container">
         <div style={{ width: '100%', maxWidth: '450px' }}>
            <div className="card">
               {/* Header */}
               <div className="card-header">
                  <h2 className="text-center" style={{ marginBottom: 'var(--spacing-sm)' }}>Student Login</h2>
                  <p className="text-center text-secondary" style={{ marginBottom: '0' }}>
                     Login to your account
                  </p>
                  <p className="form-hint text-center">
                     Use your Babcock matric number and UMIS password
                  </p>
               </div>

               {/* Login Form */}
               <form onSubmit={handlesubmit}>
                  <div className="form-group">
                     <label htmlFor="matriculation_number" className="form-label">
                        Matriculation Number
                     </label>
                     <input
                        type="text"
                        name="matriculation_number"
                        id="matriculation_number"
                        className="form-input"
                        placeholder="e.g., 19/0001"
                        value={matriculation_number}
                        onChange={(e) => setMatriculation_number(e.target.value)}
                        required
                     />
                  </div>

                  <div className="form-group">
                     <label htmlFor="password" className="form-label">
                        Password
                     </label>
                     <input
                        type="password"
                        name="password"
                        id="password"
                        className="form-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                     />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                     Login
                  </button>
               </form>

               {/* Back Button */}
               <div className="text-center" style={{ marginTop: 'var(--spacing-lg)' }}>
                  <Link to="/landingpage" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                     ← Back to Home
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}

export default studentlogin