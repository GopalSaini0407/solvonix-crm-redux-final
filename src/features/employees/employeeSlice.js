import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import employeeService from "./employeeService";

export const fetchEmployees=createAsyncThunk("employees/fetchEmployees",async(params,thunkAPI)=>{
  try{
    return await employeeService.getEmployees(params);
  }catch(err){
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
})

export const addEmployee=createAsyncThunk("employees/addEmployee",async(data,thunkAPI)=>{
  try{
    return await employeeService.addEmployee(data);
  }catch(err){
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
})

export const updateEmployee=createAsyncThunk("employees/updateEmployee",async({employeeId,data},thunkAPI)=>{
  try{
   return await employeeService.updateEmployee(employeeId,data);
  }catch(err){
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
})

export const deleteEmployee=createAsyncThunk("employees/deleteEmployee",async(employeeId,thunkAPI)=>{
  try{
    await employeeService.deleteEmployee(employeeId);
    return employeeId;
  }   catch(err){
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
})

export const employeeSlice=createSlice({
  name:"employees",
  initialState:{
    employees:[],
    pagination:{
        current_page:1,
        last_page:1,
        total:0,
        per_page:10
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
      delete:null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.employees = action.payload.data.data;
        state.pagination = {
          current_page: action.payload.data.current_page,
          last_page: action.payload.data.last_page,
          total: action.payload.data.total,
          per_page: action.payload.data.per_page,
        };
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload;
      })
      .addCase(addEmployee.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(addEmployee.fulfilled, (state) => {
        state.loading.create = false;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload;
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload;
      });
  }
});

export default employeeSlice.reducer;

