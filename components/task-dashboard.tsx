"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { logout } from "@/lib/features/auth/authSlice"
import { fetchTasks } from "@/lib/features/tasks/tasksSlice"
import TaskInput from "@/components/task-input"
import TaskList from "@/components/task-list"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LogOut, User, Cloud, CloudRain, Sun, Thermometer } from "lucide-react"

export default function TaskDashboard() {
  const username = useSelector((state: RootState) => state.auth.username)
  const dispatch = useDispatch()

  useEffect(() => {
    // Load tasks from localStorage on component mount
    dispatch(fetchTasks())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("isAuthenticated")
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold text-primary">TaskMaster</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{username}</span>
          </div>
          <ModeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskInput />
          <TaskList />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow p-4 border">
            <h2 className="text-xl font-semibold mb-4">Task Statistics</h2>
            <TaskStatistics />
          </div>
          <WeatherDisplay />
        </div>
      </div>
    </div>
  )
}

function TaskStatistics() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks)

  const highPriority = tasks.filter((task) => task.priority === "high").length
  const mediumPriority = tasks.filter((task) => task.priority === "medium").length
  const lowPriority = tasks.filter((task) => task.priority === "low").length

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span>Total Tasks:</span>
        <span className="font-semibold">{tasks.length}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            High Priority:
          </span>
          <span>{highPriority}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            Medium Priority:
          </span>
          <span>{mediumPriority}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            Low Priority:
          </span>
          <span>{lowPriority}</span>
        </div>
      </div>
    </div>
  )
}

function WeatherDisplay() {
  const weather = useSelector((state: RootState) => state.weather)

  return (
    <div className="bg-card rounded-lg shadow p-4 border mt-6">
      <h2 className="text-xl font-semibold mb-4">Weather Conditions</h2>

      {weather.status === "loading" && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse text-muted-foreground">Loading weather data...</div>
        </div>
      )}

      {weather.status === "failed" && (
        <div className="text-center py-4 text-muted-foreground">
          <Cloud className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p>Weather information unavailable</p>
          <p className="text-xs mt-1">Using default weather data for outdoor tasks</p>
        </div>
      )}

      {weather.status === "succeeded" && weather.data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {weather.data.weather[0].main === "Clear" ? (
                <Sun className="h-8 w-8 text-yellow-500" />
              ) : weather.data.weather[0].main === "Rain" ? (
                <CloudRain className="h-8 w-8 text-blue-500" />
              ) : (
                <Cloud className="h-8 w-8 text-blue-400" />
              )}
              <div>
                <div className="font-medium">{weather.data.weather[0].main}</div>
                <div className="text-sm text-muted-foreground">{weather.data.weather[0].description}</div>
              </div>
            </div>
            <div className="text-2xl font-bold flex items-center">
              {weather.data.main.temp}°C
              <Thermometer className="h-4 w-4 ml-1 text-red-500" />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Humidity: {weather.data.main.humidity}%</p>
            <p>Location: {weather.data.name}</p>
          </div>

          <div className="text-sm mt-2 p-2 bg-primary/10 rounded-md">
            <p className="font-medium">Outdoor Activity Recommendation:</p>
            <p>
              {weather.data.main.temp > 25
                ? "It's quite warm! Stay hydrated during outdoor tasks."
                : weather.data.main.temp < 10
                  ? "It's cold outside. Dress warmly for outdoor activities."
                  : "Good conditions for outdoor tasks."}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

