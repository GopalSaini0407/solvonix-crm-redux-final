import profileService from "./profileService";
import { createSlice,createAsyncThunk} from "@reduxjs/toolkit";

export const getProfile=createAsyncThunk("profile/getProfile",async(_,thunkAPI)=>{

    try {
         return await profileService.getProfile();

    } catch (err) {

        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }

})

export const createProfile=createAsyncThunk("profile/createProfile",async(data,thunkAPI)=>{

    try {
          return await profileService.createProfile(data);
          
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message)
    }
})

export const updateProfile=createAsyncThunk("profile/updateProfile", async({profileId,data},thunkAPI)=>{

    try {
        return await profileService.updateProfile(profileId,data);
    } catch (err) {
        
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
})

export const deleteProfile=createAsyncThunk("profile/deleteProfile",async(profileId,thunkAPI)=>{

    try {
         return await profileService.deleteProfile(profileId);
    } catch (err) {
        
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }

})


const profileSlice=createSlice({
    name:'profile',
    initialState:{
        loading:{
             fetch:false,
             create:false,
             update:false,
             delete:false
        },
        error:{
           fetch:null,
           create:null,
           update:null,
           delete:null
        }
    },
    reducers:{},
    extraReducers:(builder)=>
        builder

    // get profile

    .addCase(getProfile.pending,(state)=>{
        state.loading.fetch=true;
        state.error.fetch=null;
    })
    .addCase(getProfile.fulfilled,(state,action)=>{
        state.loading.fetch=false;
        state.profile=action.payload?.data;
    })
    .addCase(getProfile.rejected,(state,action)=>{
     state.loading.fetch=false;
     state.error.fetch=action.payload;
    })

    // create profile

    .addCase(createProfile.pending,(state)=>{
        state.loading.create=true;
        state.error.create=null;

    })
    .addCase(createProfile.fulfilled,(state,action)=>{
        state.loading.create=false;
        state.profile.push(action.payload?.data || action.payload.data);
    })
    .addCase(createProfile.rejected,(state,action)=>{
        state.loading.create=false;
        state.error.create=action.payload;
    })

    // update profile

    .addCase(updateProfile.pending,(state)=>{
        state.loading.update=true;
        state.error.update=null;
    })
    .addCase(updateProfile.fulfilled,(state,action)=>{
      state.loading.update=false;
      const updated=action.payload?.data || action.payload.data;
      const index=state.profile.findIndex((profile)=>profile.id===updated.id);
      if(index!==-1){
        state.profile[index]=updated;
      }
    })
    .addCase(updateProfile.rejected,(state,action)=>{
      state.loading.update=false;
      state.error.update=action.payload;
    })

    // delete profile

    .addCase(deleteProfile.pending,(state)=>{
        state.loading.delete=true;
        state.error.delete=null;
    })
    .addCase(deleteProfile.fulfilled,(state,action)=>{
        state.loading.delete=false;
        state.profile=state.profile.filter((profile)=>profile.id!==action.payload)
    })
    .addCase(deleteProfile.rejected,(state,action)=>{
        state.loading.delete=false;
        state.error=action.payload;

    })

})


export default profileSlice.reducer;