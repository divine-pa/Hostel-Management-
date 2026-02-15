// ==================================================
// STUDENTLOGINN.JSX - Student login page
// ==================================================
// This is where students enter their details to log in
// Think of this as the door where students show their ID card

import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { loginuser } from "../services/auth";


// ==================================================
// STUDENT LOGIN COMPONENT
// ==================================================
// This creates the login form for students
function studentlogin() {
   // ===== STATE VARIABLES =====
   // These are like empty boxes that will store what the student types

   // This box stores the matric number the student types
   const [matriculation_number, setMatriculation_number] = useState("")

   // This box stores the password the student types
   const [password, setPassword] = useState("")

   // This is a tool to navigate (move) to different pages
   const navigate = useNavigate()

   // ===== HANDLE LOGIN SUBMISSION =====
   // This function runs when the student clicks the "Login" button
   const handlesubmit = async (e) => {
      // Step 1: Stop the page from refreshing (normal form behavior)
      e.preventDefault()

      try {
         // Step 2: Try to login using the matric number and password
         await loginuser(matriculation_number, password)

         // Step 3: If login was successful, take them to their dashboard
         navigate("/studentdashboard")

      } catch (error) {
         // Step 4: If login failed (wrong matric number or password), show error message
         alert("login failed , check your matric number or password")
      }
   }

   return (
      // Main container for the page
      <div className="page-container">
         {/* Box to hold the login form */}
         <div style={{ width: '100%', maxWidth: '450px' }}>
            {/* Card (nice looking box) for the form */}
            <div className="card">
               {/* ===== HEADER SECTION ===== */}
               <div className="card-header">
                  {/* Title: "Student Login" */}
                  <h2 className="text-center" style={{ marginBottom: 'var(--spacing-sm)' }}>Student Login</h2>

                  {/* Subtitle */}
                  <p className="text-center text-secondary" style={{ marginBottom: '0' }}>
                     Login to your account
                  </p>

                  {/* Helpful hint for students */}
                  <p className="form-hint text-center">
                     Use your Babcock matric number and UMIS password
                  </p>
               </div>

               {/* ===== LOGIN FORM ===== */}
               {/* When submitted, run the handlesubmit function */}
               <form onSubmit={handlesubmit}>
                  {/* MATRIC NUMBER INPUT */}
                  <div className="form-group">
                     {/* Label (text above the input box) */}
                     <label htmlFor="matriculation_number" className="form-label">
                        Matriculation Number
                     </label>

                     {/* Input box where student types their matric number */}
                     <input
                        type="text"  // Type of input (regular text)
                        name="matriculation_number"
                        id="matriculation_number"
                        className="form-input"
                        placeholder="e.g., 19/0001"  // Example text shown in empty box
                        value={matriculation_number}  // What's currently in the box
                        onChange={(e) => setMatriculation_number(e.target.value)}  // Update the box when they type
                        required  // This field must be filled before submitting
                     />
                  </div>

                  {/* PASSWORD INPUT */}
                  <div className="form-group">
                     {/* Label for password */}
                     <label htmlFor="password" className="form-label">
                        Password
                     </label>

                     {/* Input box where student types their password */}
                     <input
                        type="password"  // Type "password" hides what they type (shows ••••)
                        name="password"
                        id="password"
                        className="form-input"
                        placeholder="Enter your password"
                        value={password}  // What's currently in the box
                        onChange={(e) => setPassword(e.target.value)}  // Update the box when they type
                        required  // This field must be filled
                     />
                  </div>

                  {/* LOGIN BUTTON */}
                  {/* When clicked, submit the form (which calls handlesubmit) */}
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                     Login
                  </button>
               </form>

               {/* ===== BACK BUTTON ===== */}
               {/* Link to go back to the home page */}
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

// Export this component so it can be used in App.jsx
export default studentlogin