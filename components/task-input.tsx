"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { addTask } from "@/lib/features/tasks/tasksSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { v4 as uuidv4 } from "uuid"

export default function TaskInput() {
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("medium")
  const [isOutdoor, setIsOutdoor] = useState(false)
  const dispatch = useDispatch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      priority,
      isOutdoor,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    dispatch(addTask(newTask))
    setTitle("")
    setPriority("medium")
    setIsOutdoor(false)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task">Task Description</Label>
            <Input
              id="task"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority Level</Label>
            <RadioGroup value={priority} onValueChange={setPriority} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-red-500 font-medium">
                  High
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-yellow-500 font-medium">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-green-500 font-medium">
                  Low
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="outdoor"
              checked={isOutdoor}
              onCheckedChange={(checked) => setIsOutdoor(checked as boolean)}
            />
            <Label htmlFor="outdoor">This is an outdoor activity</Label>
          </div>

          <Button type="submit" className="w-full">
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

