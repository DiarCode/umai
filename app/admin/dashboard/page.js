"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "admin") {
      router.push("/admin/login")
    }
  }, [])

  return (
    <div style={{padding:"40px"}}>
      <h1>Admin Dashboard</h1>
    </div>
  )
}