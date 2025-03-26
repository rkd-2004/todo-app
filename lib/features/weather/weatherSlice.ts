import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface WeatherData {
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  name: string
}

interface WeatherState {
  data: WeatherData | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: WeatherState = {
  data: null,
  status: "idle",
  error: null,
}

// Using a free weather API - in a real app, you would use your own API key
export const fetchWeather = createAsyncThunk("weather/fetchWeather", async (_, { rejectWithValue }) => {
  try {
    // Using a mock weather data response since we don't have a valid API key
    // In a real application, you would use a valid API key from environment variables
    const mockWeatherData = {
      main: {
        temp: 18.5,
        humidity: 65,
      },
      weather: [
        {
          main: "Clouds",
          description: "scattered clouds",
          icon: "03d",
        },
      ],
      name: "London",
    }

    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return mockWeatherData

    // When you have a valid API key, you would use this code instead:
    /*
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${YOUR_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error("Error fetching weather:", error)
    return rejectWithValue("Failed to fetch weather data. Using mock data instead.")
  }
})

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data = action.payload
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || "Failed to fetch weather data"
      })
  },
})

export default weatherSlice.reducer

