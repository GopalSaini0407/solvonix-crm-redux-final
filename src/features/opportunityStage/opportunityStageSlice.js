import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import opportunityStageService from './opportunityStageService';

const sortOpportunityStages = (stages = []) =>
  [...stages].sort((a, b) => {
    const activeDiff = Number(b?.is_active ?? 0) - Number(a?.is_active ?? 0);
    if (activeDiff !== 0) return activeDiff;
    return (a?.priority ?? 999) - (b?.priority ?? 999);
  });

// fetch opportunity stages
export const fetchOpportunityStage = createAsyncThunk(
  'opportunityStages/fetchOpportunityStage',
  async (_, thunkAPI) => {
    try {
      return await opportunityStageService.getOpportunityStage();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// add opportunity stage
export const addOpportunityStage = createAsyncThunk(
  'opportunityStages/addOpportunityStage',
  async (data, thunkAPI) => {
    try {
      return await opportunityStageService.addOpportunityStage  (data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);  

// update opportunity stage
export const updateOpportunityStage = createAsyncThunk(
  'opportunityStages/updateOpportunityStage',
  async ({ opportunityStageId, data }, thunkAPI) => {
    try {
      return await opportunityStageService.updateOpportunityStage(opportunityStageId, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// change priority
export const changeOpportunityStagePriority = createAsyncThunk(
  'opportunityStages/changeOpportunityStagePriority',
  async ({ opportunityStageId, data }, thunkAPI) => {
    try {
      return await opportunityStageService.changeOpportunityStagePriority(opportunityStageId, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState={
    opportunityStages:[],
    loading: {
    fetch: false,
    create: false,
    update: false,
    priority: false,
  },
    error: {
    fetch: null,
    create: null,
    update: null,
    priority: null,
  },
    errorMessage:''
}
                    
const opportunityStageSlice=createSlice({
    name:'opportunityStages',
    initialState,
    reducers:{
        reorderOpportunityStages(state, action) {
            state.opportunityStages = action.payload;
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchOpportunityStage.pending,(state)=>{
            state.loading.fetch=true;
            state.error.fetch=null;
            state.errorMessage='';
        })
        .addCase(fetchOpportunityStage.fulfilled,(state,action)=>{
            state.loading.fetch=false;
            state.opportunityStages=sortOpportunityStages(action.payload?.data || []);
        })
        .addCase(fetchOpportunityStage.rejected,(state,action)=>{
            state.loading.fetch=false;
            state.error.fetch=action.payload;
            state.errorMessage=action.payload || 'Failed to fetch opportunity stages';
        })
        // Handle add
        .addCase(addOpportunityStage.pending,(state)=>{
            state.loading.create=true;
            state.error.create=null;
            state.errorMessage='';
        })
        .addCase(addOpportunityStage.fulfilled,(state,action)=>{
            state.loading.create=false;
        })
        .addCase(addOpportunityStage.rejected,(state,action)=>{
            state.loading.create=false;
            state.error.create=action.payload;
            state.errorMessage=action.payload || 'Failed to add opportunity stage';
        })
        // Handle update
        .addCase(updateOpportunityStage.pending,(state)=>{
            state.loading.update=true;
            state.error.update=null;
            state.errorMessage='';
        })
        .addCase(updateOpportunityStage.fulfilled,(state,action)=>{
            state.loading.update=false;
            const updated = {
                ...(action.payload?.data || action.payload || {}),
                ...(action.meta?.arg?.data || {}),
                id:
                  action.payload?.data?.id ||
                  action.payload?.id ||
                  action.meta?.arg?.opportunityStageId,
            };
            const index = state.opportunityStages.findIndex(stage => stage.id === updated.id);
            if (index !== -1) {
                state.opportunityStages[index] = {
                    ...state.opportunityStages[index],
                    ...updated,
                };
                state.opportunityStages=sortOpportunityStages(state.opportunityStages);
            }
        })
        .addCase(updateOpportunityStage.rejected,(state,action)=>{
            state.loading.update=false;
            state.error.update=action.payload;
            state.errorMessage=action.payload || 'Failed to update opportunity stage';
        })
        // Handle change priority
        .addCase(changeOpportunityStagePriority.pending,(state)=>{
            state.loading.priority=true;
            state.error.priority=null;
            state.errorMessage='';
        })
        .addCase(changeOpportunityStagePriority.fulfilled,(state,action)=>{
            state.loading.priority=false;
        })
        .addCase(changeOpportunityStagePriority.rejected,(state,action)=>{
            state.loading.priority=false;
            state.error.priority=action.payload;
            state.errorMessage=action.payload || 'Failed to change opportunity stage priority'; 

    })
    }
});

export const { reorderOpportunityStages } = opportunityStageSlice.actions;

export const selectActiveOpportunityStages = (state) =>
    (state.opportunityStages?.opportunityStages || []).filter(
        (stage) => Number(stage?.is_active ?? 0) === 1
    );

export default opportunityStageSlice.reducer;
