import { build } from "vite";
import customFieldService from "./customFieldService";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";


export const fetchCustomField=createAsyncThunk("customField/fetchCustomField",async(_,thunkAPI)=>{
   
    try {
        return await customFieldService.fetchCustomField();
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
})

export const addCustomField=createAsyncThunk("customField/addCustomField",async(addedField,thunkAPI)=>{

    try {
         return await customFieldService.addCustomField(addedField);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
})

export const updateCustomField=createAsyncThunk("customField/updateCustomField",async(updatedField,thunkAPI)=>{

    try{
           return await customFieldService.updateCustomField(updatedField);
    }catch(err){
          return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
})

export const updateCustomFieldPriority=createAsyncThunk("customField/updateCustomFieldPriority",async({fieldId,updatedField},thunkAPI)=>{

    try {
          return await customFieldService.updateCustomFieldPriority(fieldId,updatedField)
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }

})

const  initialState={
    customFields: [],
    loading:{
        fetch:false,
        create:false,
        update:false,
        priority:false
    },
    error:{
        fetch:null,
        create:null,
        update:null,
        priority:null
    },
       
}

const customFieldSlice=createSlice({
    name:"customFields",
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>
        builder
        
    //    fetch customfield
    .addCase(fetchCustomField.pending,(state)=>{
        state.loading.fetch=true;
        state.error.fetch=null;
    })
    .addCase(fetchCustomField.fulfilled,(state,action)=>{
        state.loading.fetch=false;
        state.customFields=action.payload?.data;
        state.error.fetch=null
    })
    .addCase(fetchCustomField.rejected,(state,action)=>{
        state.loading.fetch=false;
        state.error.fetch=action.payload;
    })

    // add custom field

    .addCase(addCustomField.pending,(state)=>{
        state.loading.create=true;
        state.error.create=null;
    })
    .addCase(addCustomField.fulfilled,(state,action)=>{
      state.loading.create=false;
      state.customFields.push(action.payload?.data);
      state.error.create=null
    })
    .addCase(addCustomField.rejected,(state,action)=>{
        state.loading.create=false;
        state.error.create=action.payload;

    })

    // update custom field

    .addCase(updateCustomField.pending,(state)=>{
    state.loading.update=true;
    state.error.update=null;
    })
    .addCase(updateCustomField.fulfilled,(state,action)=>{
      state.loading.update=false;
      const updated=action.payload?.data || action.payload;
      const index=state.customFields.findIndex((field)=>field.id===updated.id);
      if(index!==-1){
        state.customFields[index]=updated;
      }
      state.error.update=null;
    })
    .addCase(updateCustomField.rejected,(state,action)=>{
        state.loading.update=false;
        state.error.update=action.payload;

    })

    // update custom field priority

    .addCase(updateCustomFieldPriority.pending,(state)=>{
      state.loading.priority=true;
      state.error.priority=null;
    })
    .addCase(updateCustomFieldPriority.fulfilled,(state,action)=>{
        state.loading.priority=false;
        state.customFields=action.payload?.data;
        state.error.priority=null;
    })
    .addCase(updateCustomFieldPriority.rejected,(state,action)=>{
        state.loading.priority=false;
        state.error.priority=action.payload;
    })

})


export default customFieldSlice.reducer;
