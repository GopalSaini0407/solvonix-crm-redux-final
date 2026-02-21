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
        state.leadChannel=action.payload?.data;
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
        state.leadChannel.push(action.payload?.data);
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
        state.loading.update=false;
        const updated=action.payload?.data;
        const index=state.leadChannel.findIndex((leadChannel)=>leadChannel.id===updated.id);
        if(index!==-1){
            state.leadChannel[index]=action.payload?.data;
        }
    })
    .addCase(updateLeadChannel.rejected,(state,action)=>{
     state.loading.update=false;
     state.error.update=action.payload;
    })
})

export default createLeadChannel.reducer;