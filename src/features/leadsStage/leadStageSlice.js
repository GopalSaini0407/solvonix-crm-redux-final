import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import leadStageService from './leadStageService';

// fetch lead stages
export const fetchLeadStage = createAsyncThunk(
  'leadStages/fetchLeadStage',
  async (_, thunkAPI) => {
    try {
      return await leadStageService.getLeadStage();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// add lead stage
export const addLeadStage = createAsyncThunk(
  'leadStages/addLeadStage',
  async (data, thunkAPI) => {
    try {
      return await leadStageService.addLeadStage(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// update lead stage
export const updateLeadStage = createAsyncThunk(
  'leadStages/updateLeadStage',
  async ({ leadStageId, data }, thunkAPI) => {
    try {
      return await leadStageService.updateLeadStage(leadStageId, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// change priority
export const changeLeadStagePriority = createAsyncThunk(
  'leadStages/changeLeadStagePriority',
  async ({ leadStageId, data }, thunkAPI) => {
    try {
      return await leadStageService.changeLeadStagePriority(leadStageId, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  leadStages: [],
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
};

const leadStageSlice = createSlice({
  name: 'leadStages',
  initialState,
  reducers: {
    
      reorderLeadStages(state, action) {
        state.leadStages = action.payload;
      },
    
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchLeadStage.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchLeadStage.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.leadStages = action.payload?.data || [];
      })
      .addCase(fetchLeadStage.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload;
      })

      // add
      .addCase(addLeadStage.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(addLeadStage.fulfilled, (state, action) => {
        state.loading.create = false;
        state.leadStages.push(action.payload?.data || action.payload.data);
      })
      .addCase(addLeadStage.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload;
      })

      // update
      .addCase(updateLeadStage.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateLeadStage.fulfilled, (state, action) => {
        state.loading.update = false;
        const updated = action.payload?.data || action.payload;
        const index = state.leadStages.findIndex(
          (item) => item.id === updated.id
        );
        if (index !== -1) {
          state.leadStages[index] = updated;
        }
      })
      .addCase(updateLeadStage.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload;
      })

      // priority
      .addCase(changeLeadStagePriority.pending, (state) => {
        state.loading.priority = true;
        state.error.priority = null;
      })
      .addCase(changeLeadStagePriority.fulfilled, (state, action) => {
        state.loading.priority = false;
        // state.leadStages = action.payload?.data || [];
      })
      .addCase(changeLeadStagePriority.rejected, (state, action) => {
        state.loading.priority = false;
        state.error.priority = action.payload;
      });
  },
});

export const { reorderLeadStages } = leadStageSlice.actions;

export default leadStageSlice.reducer;
