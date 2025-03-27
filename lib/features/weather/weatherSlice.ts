import { createSlice, createAsyncThunk, AsyncThunkPayloadCreator } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Type definitions
interface WeatherMain {
  temp: number;
  humidity: number;
}

interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

interface WeatherData {
  main: WeatherMain;
  weather: WeatherCondition[];
  name: string;
}

interface WeatherState {
  data: WeatherData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WeatherState = {
  data: null,
  status: "idle",
  error: null,
};

// Properly typed async thunk
export const fetchWeather = createAsyncThunk<
  WeatherData, // Return type
  void, // Argument type (none in this case)
  {
    rejectValue: string; // Type for rejectWithValue
  }
>(
  "weather/fetchWeather",
  async (_, { rejectWithValue }) => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return (await response.json()) as WeatherData;
    } catch (error) {
      let errorMessage = "Failed to fetch weather data";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action: PayloadAction<WeatherData>) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
      });
  },
});

export default weatherSlice.reducer;