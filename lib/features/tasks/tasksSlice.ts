import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Task {
  id: string
  title: string
  priority: string
  isOutdoor: boolean
  completed: boolean
  createdAt: string
}

interface TasksState {
  tasks: Task[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: TasksState = {
  tasks: [],
  status: "idle",
  error: null,
}

// Async thunk to fetch tasks from localStorage
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const storedTasks = localStorage.getItem("tasks")
  return storedTasks ? JSON.parse(storedTasks) : []
})

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload)
      localStorage.setItem("tasks", JSON.stringify(state.tasks))
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload)
      if (task) {
        task.completed = !task.completed
        localStorage.setItem("tasks", JSON.stringify(state.tasks))
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
      localStorage.setItem("tasks", JSON.stringify(state.tasks))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch tasks"
      })
  },
})

export const { addTask, toggleTask, deleteTask } = tasksSlice.actions
export default tasksSlice.reducer

