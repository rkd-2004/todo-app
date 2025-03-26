import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  isAuthenticated: boolean
  username: string
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: "",
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string }>) => {
      state.isAuthenticated = true
      state.username = action.payload.username
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.username = ""
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer

