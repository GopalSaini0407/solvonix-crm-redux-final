import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "./authService"

const token = localStorage.getItem("access_token");

const initialState = {
  token: token || null,
  user:null,
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

export const logout=createAsyncThunk("auth/logout",async(_,thunkAPI)=>{
   try {
    return await authService.logout();
   } catch (err) {
    localStorage.removeItem("access_token");
    return thunkAPI.rejectWithValue("Logout failed" || err.message)
    
   }
})

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

      // logout

      .addCase(logout.pending,(state)=>{
        state.isLoading=true;
      })
      .addCase(logout.fulfilled,(state)=>{
        state.isLoading=false;
        state.token=null;
        state.user=null;
        state.isSuccess=false;
        state.isError=false;
      })
      .addCase(logout.rejected,(state)=>{
        state.isLoading=false;
        state.token=null
      })






    //  get profile
     .addCase(getProfile.pending,(state)=>{
      state.isLoading=true
     })
     .addCase(getProfile.fulfilled,(state,action)=>{
      state.isLoading=false
      state.user=action.payload?.data;
     })
     .addCase(getProfile.rejected,(state)=>{
      state.isLoading=false
      state.isError=true
     })

  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
