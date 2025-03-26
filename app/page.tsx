"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/lib/store"
import LoginForm from "@/components/login-form"
import TaskDashboard from "@/components/task-dashboard"

export default function Home() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    // Check if user is authenticated in localStorage
    const storedAuth = localStorage.getItem("isAuthenticated")
    if (storedAuth === "true" && !isAuthenticated) {
      dispatch({ type: "auth/login", payload: { username: localStorage.getItem("username") || "User" } })
    }
  }, [dispatch, isAuthenticated])

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">{isAuthenticated ? <TaskDashboard /> : <LoginForm />}</div>
    </main>
  )
}

