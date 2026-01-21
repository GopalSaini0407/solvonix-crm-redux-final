import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "./authService"

const token = localStorage.getItem("access_token");
const storedUser=localStorage.getItem('user')

const initialState = {
  token: token || null,
  user:storedUser ? JSON.parse(storedUser):null,
  isLoading: false,
  isError: false,
  isSuccess: false,
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      return await authService.login(data)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      return await authService.register(data)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const getProfile=createAsyncThunk("auth/profile",async(_,thunkAPI)=>{
  try {
    return await authService.profile()
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data || "Profile failed"
    )
  }
  
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout()
      state.token = null
    },
    reset: (state) => {
      state.isError = false
      state.isSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.token = action.payload.access_token
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false
        state.isError = true
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false
        state.isError = true
      })
    //  get profile
     .addCase(getProfile.pending,(state)=>{
      state.isLoading=true
     })
     .addCase(getProfile.fulfilled,(state,action)=>{
      state.isLoading=false
      state.user=action.payload;
      localStorage.setItem("user",JSON.stringify(action.payload))
     })
     .addCase(getProfile.rejected,(state)=>{
      state.isLoading=false
      state.isError=true
     })

  },
})

export const { logout, reset } = authSlice.actions
export default authSlice.reducer
