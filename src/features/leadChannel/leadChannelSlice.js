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

const sortLeadChannels = (channels = []) =>
  [...channels].sort((a, b) => {
    const activeDiff = Number(b?.is_active ?? 0) - Number(a?.is_active ?? 0);
    if (activeDiff !== 0) return activeDiff;
    return (a?.channel || "").localeCompare(b?.channel || "", undefined, { sensitivity: "base" });
  });


const createLeadChannel=createSlice({
    name:"leadChannel",
    initialState:{
    leadChannel:[],
     loading:{
        fetch:false,
        create:false,
        update:false,
     },
     error:{
        fetch:null,
        create:null,
        update:null,
     }

    },
    reducers:{},
    extraReducers:(builder)=>
        builder

    // fetch lead channel
      .addCase(getLeadChannel.pending,(state)=>{
        state.loading.fetch=true;
        state.error.fetch=null;
      })
      .addCase(getLeadChannel.fulfilled,(state,action)=>{
        state.loading.fetch=false;
        state.leadChannel=sortLeadChannels(action.payload?.data || []);
        state.error.fetch=null
      })
      .addCase(getLeadChannel.rejected,(state,action)=>{
        state.loading.fetch=false;
        state.error.fetch=action.payload;
      })

    //   add lead channel

    .addCase(addLeadChannel.pending,(state)=>{
        state.loading.create=true;
        state.error.create=null;
    })
    .addCase(addLeadChannel.fulfilled,(state,action)=>{
        state.loading.create=false;
        // state.leadChannel.push(action.payload?.data);
        state.error.create=null;
    })
    .addCase(addLeadChannel.rejected,(state,action)=>{
     state.loading.create=false;
     state.error.create=action.payload;
    })

    // update lead channel

    .addCase(updateLeadChannel.pending,(state)=>{
        state.loading.update=true;
        state.error.update=null;
    })
    .addCase(updateLeadChannel.fulfilled,(state,action)=>{
        state.loading.update = false;

        const fallbackUpdated = {
          id: action.meta.arg.id,
          ...action.meta.arg.data,
        };
        const updated = action.payload?.data || fallbackUpdated;

        const index = state.leadChannel.findIndex((item) => item.id === updated.id);

        if (index !== -1) {
            state.leadChannel[index] = {
              ...state.leadChannel[index],
              ...updated,
            };
        }

        state.leadChannel = sortLeadChannels(state.leadChannel);
        state.error.update = null;
    })
    .addCase(updateLeadChannel.rejected,(state,action)=>{
     state.loading.update=false;
     state.error.update=action.payload;
    })
})

export const selectActiveLeadChannels = (state) =>
  (state.leadChannel?.leadChannel || []).filter((channel) => Number(channel?.is_active ?? 0) === 1);

export default createLeadChannel.reducer;
