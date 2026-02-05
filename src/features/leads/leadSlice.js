import leadService from "./leadService";
import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';

export const getLeads=createAsyncThunk("leads/getLeads",async(params,thunkAPI)=>{

    try {
        return await leadService.getLeads(params);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err?.message)
    }
})

export const createLead=createAsyncThunk("leads/createLead",async(data,thunkAPI)=>{
    try{
        return await leadService.createLead(data);
    }catch (err){
        return thunkAPI.rejectWithValue(err.response?.data || err?.message);
    }
})

export const updateLead=createAsyncThunk("leads/updateLead",async({leadId,data},thunkAPI)=>{
    try {
        return await leadService.updateLead(leadId,data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err?.message);
    }
})

export const deleteLead=createAsyncThunk("leads/deleteLead",async(leadId,thunkAPI)=>{

    try {
        return await leadService.deleteLead(leadId);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err?.message);
    }
})


const leadSlice=createSlice({
    name:"leads",
    initialState:{
        leads:[],
        pagination:{
        current_page:1,
        last_page:1,
        total:0,
        per_page:10,
        },

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
            delete:null,
        }
    },
    reducers:{},
    extraReducers:(builder)=>
        builder

    // get leads
    .addCase(getLeads.pending,(state)=>{
     state.loading.fetch=true;
     state.error.fetch=null;
    })
    .addCase(getLeads.fulfilled,(state,action)=>{
        state.loading.fetch=false;
        const pageData=action.payload?.data;
        state.leads=pageData?.data || [];
        state.pagination.current_page=pageData?.current_page;
        state.pagination.last_page=pageData?.last_page;
        state.pagination.total=pageData?.total;
        state.pagination.per_page=pageData?.per_page;
    })
    .addCase(getLeads.rejected,(state,action)=>{
        state.loading.fetch=false;
        state.error.fetch=action.payload;
    })
    // create lead

    .addCase(createLead.pending,(state)=>{
        state.loading.create=true;
        state.error.create=null;
    })
    .addCase(createLead.fulfilled,(state,action)=>{
        state.loading.create=false;
        state.leads.push(action.payload?.data);
    })
    .addCase(createLead.rejected,(state,action)=>{
        state.loading.create=false;
        state.error.create=action.payload;
    })

    // update lead

    .addCase(updateLead.pending,(state)=>{
        state.loading.update=true;
        state.error.update=null;
    })
    .addCase(updateLead.fulfilled,(state,action)=>{
        state.loading.update=false;
        const updated=action.payload?.data || action.payload;
        const index=state.leads.findIndex((lead)=>lead.id=updated.id);
        if(index!==-1){
            state.leads[index]=updated;
        }
    })
    .addCase(updateLead.rejected,(state,action)=>{
        state.loading.update=false;
        state.error.update=action.payload;
    })
    // delete leads

    .addCase(deleteLead.pending,(state)=>{
        state.loading.delete=true;
        state.error.delete=null;
    })
    .addCase(deleteLead.fulfilled,(state,action)=>{
        state.loading.delete=false;
      state.leads= state.leads.filter((lead)=>lead.id!==action.payload);
    })
    .addCase(deleteLead.rejected,(state,action)=>{
        state.loading.delete=false;
        state.error.delete=action.payload;
    })
})


export default leadSlice.reducer;