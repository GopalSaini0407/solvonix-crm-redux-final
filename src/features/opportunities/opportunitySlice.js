import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import opportunityService from "./opportunityService";

export const getOpportunities = createAsyncThunk(
  "opportunities/getOpportunities",
  async (params, thunkAPI) => {
    try {
      return await opportunityService.getOpportunities(params);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err?.message);
    }
  }
);

export const createOpportunity = createAsyncThunk(
  "opportunities/createOpportunity",
  async (data, thunkAPI) => {
    try {
      return await opportunityService.createOpportunity(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err?.message);
    }
  }
);

export const updateOpportunity = createAsyncThunk(
  "opportunities/updateOpportunity",
  async ({ opportunityId, data }, thunkAPI) => {
    try {
      return await opportunityService.updateOpportunity(opportunityId, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err?.message);
    }
  }
);

export const deleteOpportunity = createAsyncThunk(
  "opportunities/deleteOpportunity",
  async (opportunityId, thunkAPI) => {
    try {
      await opportunityService.deleteOpportunity(opportunityId);
      return opportunityId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err?.message);
    }
  }
);

const initialState = {
  opportunities: [],
  pagination: {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  },
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
  },
  error: {
    fetch: null,
    create: null,
    update: null,
    delete: null,
  },
};

const opportunitySlice = createSlice({
  name: "opportunities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOpportunities.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(getOpportunities.fulfilled, (state, action) => {
        state.loading.fetch = false;
        const pageData = action.payload?.data;
        state.opportunities = pageData?.data || [];
        state.pagination.current_page = pageData?.current_page || 1;
        state.pagination.last_page = pageData?.last_page || 1;
        state.pagination.total = pageData?.total || 0;
        state.pagination.per_page = pageData?.per_page || 10;
      })
      .addCase(getOpportunities.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload;
      })
      .addCase(createOpportunity.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createOpportunity.fulfilled, (state, action) => {
        state.loading.create = false;
        if (action.payload?.data) {
          state.opportunities.unshift(action.payload.data);
        }
      })
      .addCase(createOpportunity.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload;
      })
      .addCase(updateOpportunity.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateOpportunity.fulfilled, (state, action) => {
        state.loading.update = false;
        const updated = {
          ...(action.payload?.data || action.payload || {}),
          ...(action.meta?.arg?.data || {}),
          id:
            action.payload?.data?.id ||
            action.payload?.id ||
            action.meta?.arg?.opportunityId,
        };

        const index = state.opportunities.findIndex(
          (item) => item.id === updated.id
        );

        if (index !== -1) {
          state.opportunities[index] = {
            ...state.opportunities[index],
            ...updated,
          };
        }
      })
      .addCase(updateOpportunity.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload;
      })
      .addCase(deleteOpportunity.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteOpportunity.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.opportunities = state.opportunities.filter(
          (item) => item.id !== action.payload
        );
        state.pagination.total = Math.max(0, (state.pagination.total || 0) - 1);
      })
      .addCase(deleteOpportunity.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload;
      });
  },
});

export default opportunitySlice.reducer;
