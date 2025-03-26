"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/features/auth/authSlice"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const dispatch = useDispatch()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    // Mock authentication - in a real app, this would validate against a backend
    if (password.length < 4) {
      setError("Password must be at least 4 characters")
      return
    }

    // Dispatch login action
    dispatch(login({ username }))

    // Store authentication in localStorage
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("username", username)
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to TaskMaster</CardTitle>
          <CardDescription>Login to manage your tasks with weather integration</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

