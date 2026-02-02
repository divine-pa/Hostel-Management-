import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { loginuser } from "../services/auth";


function studentlogin (){
   const [matriculation_number, setMatriculation_number] = useState("")
   const [password, setPassword] = useState("")
   const navigate = useNavigate()

   const handlesubmit = async (e)=>{
      e.preventDefault()
      try{
         
         await loginuser(matriculation_number, password)
         navigate("/studentdashboard")
      }catch(error){
         alert("login failed , check your matric number or password")
      }
   }
   return(
    <>
    <h1>Student Login</h1>
    <button><Link to="/landingpage">Back</Link></button>
   <p>Login to your account</p>
   <i>use your babcock matric number and umis password</i>

    <form action="" method="post" onSubmit={handlesubmit}>
        <label htmlFor="matriculation_number">Matriculation Number</label>
        <input type="text" name="matriculation_number" id="" value={matriculation_number} onChange={(e) => setMatriculation_number(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
    </form>
    </>
   )
}

export default studentlogin