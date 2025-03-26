"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { fetchWeather } from "@/lib/features/weather/weatherSlice"
import { deleteTask, toggleTask } from "@/lib/features/tasks/tasksSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Cloud, Sun, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TaskList() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks)
  const weather = useSelector((state: RootState) => state.weather)
  const dispatch = useDispatch()

  useEffect(() => {
    // Check if there are any outdoor tasks
    const hasOutdoorTasks = tasks.some((task) => task.isOutdoor)

    if (hasOutdoorTasks) {
      dispatch(fetchWeather())
    }
  }, [tasks, dispatch])

  const handleToggleTask = (id: string) => {
    dispatch(toggleTask(id))
  }

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Tasks</CardTitle>
        <div className="flex items-center gap-2 text-sm">
          <span>Weather:</span>
          {weather.status === "loading" && <span className="text-muted-foreground">Loading...</span>}
          {weather.status === "succeeded" && weather.data && (
            <>
              {weather.data.weather[0].main === "Clear" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Cloud className="h-4 w-4 text-blue-500" />
              )}
              <span>{weather.data.main.temp}°C</span>
            </>
          )}
          {weather.status === "failed" && <span className="text-muted-foreground">Weather unavailable</span>}
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No tasks yet. Add some tasks to get started!</div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-md border ${
                  task.completed ? "bg-muted/50" : "bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    id={`task-${task.id}`}
                  />
                  <div>
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </label>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                      {task.isOutdoor && (
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        >
                          Outdoor
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} aria-label="Delete task">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

