import { createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import leadChannelService from "./leadChannelService";


export const getLeadChannel=createAsyncThunk('leadChannel/getLeadChannel',async(_,thunkAPI)=>{
 
    try {
        return await leadChannelService.getLeadChannel();
    } catch (err) {
        
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
})

export const addLeadChannel=createAsyncThunk('leadChannel/addLeadChannel',async(data,thunkAPI)=>{
   try {

    return await leadChannelService.addLeadChannel(data);
    
   } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
   }
})

export const updateLeadChannel=createAsyncThunk('leadChannel/updateChannel',async({id,data},thunkAPI)=>{
    try{
        return await leadChannelService.updateLeadChannel(id,data);
    }catch (err){
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
})


const createLeadChannel=createSlice({
    name:"leadChannel",
    initialState:{
     

    },
    reducers:{},
    extraReducers:(builder)=>
        builder
      .addCase(getLeadChannel.pending,(state)=>{
        
      })

})