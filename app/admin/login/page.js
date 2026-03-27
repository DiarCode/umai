"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminLogin() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (email === "admin@mail.com" && password === "1234") {
      localStorage.setItem("token", "admin-token")
      localStorage.setItem("role", "admin")
      router.push("/admin/dashboard")
    } else {
      setError("Неверный логин или пароль")
    }
  }

  return (
    <div style={{padding:"40px"}}>
      <h1>Admin Login</h1>

      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <br/><br/>

      <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
      <br/><br/>

      <button onClick={handleLogin}>Login</button>

      <p style={{color:"red"}}>{error}</p>

      <p>Forgot password?</p>
    </div>
  )
}