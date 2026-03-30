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

export const getLeadFields=createAsyncThunk("leads/getLeadFields",async(_,thunkAPI)=>{
   
    try {
        return await leadService.getLeadFields();
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
        
    }

   })

export const leadActivityLog=createAsyncThunk("leads/leadActivityLog",async(leadId,thunkAPI)=>{
    try{
        return await leadService.leadActivityLog(leadId);
    }catch(err){
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
})

export const exportLeadCsv = createAsyncThunk(
    "leads/exportLeadCsv",
    async ({ filters, leadIds }, thunkAPI) => {
      try {
        return await leadService.exportLeadCsv(filters, leadIds);
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
      }
    }
  );

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
        fields:{},
        fieldValues:{},
        activities:[],
        loading:{
            fetch: false,
            create: false,
            fetchFeids:false,
            update: false,
            delete:false,
            log:false,
            export:false,
        },
        error:{
            fetch: null,
            create: null,
            fetchFeids:null,
            update: null,
            delete:null,
            log:null,
            export:null
        }
    },
    reducers:{
        setFieldValue:(state,action)=>{
          const {fieldName,value}=action.payload;
          state.fieldValues[fieldName]=value
        },
        resetFieldValues: (state) => {
      state.fieldValues = {};
    },
    clearContactActivity(state) {
        state.activities = [];
      },
    },
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
        const index=state.leads.findIndex((lead)=>lead.id===updated.id);
        if(index!==-1){
            state.leads[index]=updated;
        }
    })
    .addCase(updateLead.rejected,(state,action)=>{
        state.loading.update=false;
        state.error.update=action.payload;
    })

      // fetchContactFields
      .addCase(getLeadFields.pending,(state)=>{
        state.loading.fetchFeids=true;
        state.error.fetchFeids=null;
       })
       .addCase(getLeadFields.fulfilled,(state,action)=>{
           state.loading.fetchFeids=false;
           state.fields=action.payload.data;
       })
       .addCase(getLeadFields.rejected,(state,action)=>{
           state.loading.fetchFeids=false;
           state.error.fetchFeids=action.payload;
       })
   // Fetch Activity Log
   .addCase(leadActivityLog.pending, (state) => {
    state.loading.log = true;
    state.error.log = null;
  })
  .addCase(leadActivityLog.fulfilled, (state, action) => {
    state.loading.log = false;
    state.activities = action.payload?.data; // backend se return array of logs
  })
  .addCase(leadActivityLog.rejected, (state, action) => {
    state.loading.log = false;
    state.error.log = action.payload?.data;
  })

  // export lead CSV

  .addCase(exportLeadCsv.pending,(state)=>{
      state.loading.export=true;
      state.error.export=null;

  })
  .addCase(exportLeadCsv.fulfilled,(state)=>{
      state.loading.export = false;
  })
  .addCase(exportLeadCsv.rejected,(state,action)=>{
      state.loading.export = false;
       state.error.export=action.payload;
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

export const { setFieldValue,resetFieldValues } = leadSlice.actions;
export default leadSlice.reducer;