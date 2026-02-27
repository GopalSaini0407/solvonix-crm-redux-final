import { Contact } from "lucide-react";
import customFieldService from "./customFieldService";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";


export const fetchContactCustomField=createAsyncThunk("contactCustomField/fetchContactCustomField",async(_,thunkAPI)=>{
   
    try {
        return await customFieldService.fetchContactCustomField();
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
})

export const fetchLeadCustomField=createAsyncThunk("leadCustomField/fetchLeadCustomField",async(_,thunkAPI)=>{

try{
  return await customFieldService.fetchLeadCustomField();

}catch(err){
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

export const updateCustomFieldPriority = createAsyncThunk(
  "customField/updateCustomFieldPriority",
  async ({ fieldId, updatedField }, thunkAPI) => {
    try {
      await customFieldService.updateCustomFieldPriority(fieldId, updatedField);

      // important: return original data
      return { fieldId, updatedField };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const  initialState={
    customFields: {
      Leads:{},
      Contacts:{}
    },
    loading:{
      fetchLead: false,
      fetchContact: false,
      create:false,
      update:false,
      priority:false
    },
    error:{
      fetchLead: null,
      fetchContact: null,
      create:null,
      update:null,
      priority:null
    }
       
}

const customFieldSlice=createSlice({
    name:"customFields",
    initialState,
    reducers: {
        reorderCustomFields(state, action) {
          const {moduleName, groupName, updatedFields } = action.payload;
           
          if(!state.customFields[moduleName]) return;

          state.customFields[moduleName][groupName] = updatedFields;
        },
      
        moveCustomField(state, action) {
          const {moduleName,sourceGroup, destGroup } = action.payload;
      
          state.customFields[moduleName][sourceGroup.name] = sourceGroup.fields;
          state.customFields[moduleName][destGroup.name] = destGroup.fields;
        }
      },
      
    extraReducers:(builder)=>
        builder
        
    //    fetch contact customfield
    .addCase(fetchContactCustomField.pending,(state)=>{
        state.loading.fetchContact=true;
        state.error.fetchContact=null;
    })
    .addCase(fetchContactCustomField.fulfilled,(state,action)=>{
        state.loading.fetchContact=false;
        state.customFields.Contacts=action.payload?.data;
        state.error.fetchContact=null
    })
    .addCase(fetchContactCustomField.rejected,(state,action)=>{
        state.loading.fetchContact=false;
        state.error.fetchContact=action.payload;
    })

    // fetch leads custom field
    .addCase(fetchLeadCustomField.pending,(state)=>{
      state.loading.fetchLead=true;
      state.error.fetchLead=null;
    })
    .addCase(fetchLeadCustomField.fulfilled,(state,action)=>{
      state.loading.fetchLead=false;
      state.customFields.Leads=action.payload?.data;
      state.error.fetchLead=null;
    })
    .addCase(fetchLeadCustomField.rejected,(state,action)=>{
     state.loading.fetchLead=false;
     state.error.fetchLead=action.payload;
    })

    // add custom field

    .addCase(addCustomField.pending,(state)=>{
        state.loading.create=true;
        state.error.create=null;
    })
   .addCase(addCustomField.fulfilled, (state, action) => {
  state.loading.create = false;

  const newField = action.payload?.data;
  const moduleName=newField.field_for;
  const group = newField.field_group;

  // agar group exist nahi karta
  if (!state.customFields[moduleName]) return;
  if (!state.customFields[moduleName][group]) {
    state.customFields[moduleName][group] = [];
  }

  state.customFields[moduleName][group].push(newField);
  state.error.create = null;
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
    .addCase(updateCustomField.fulfilled, (state, action) => {
      state.loading.update = false;
    
      const updatedField = action.meta.arg;   // 🔥 FIXED
      const moduleName = updatedField.field_for;
      const newGroup = updatedField.field_group;
    
      if (!state.customFields[moduleName]) return;
    
      let oldGroup = null;
      let oldIndex = -1;
    
      for (const group in state.customFields[moduleName]) {
        const idx = state.customFields[moduleName][group].findIndex(
          field => field.id === updatedField.id
        );
        if (idx !== -1) {
          oldGroup = group;
          oldIndex = idx;
          break;
        }
      }
    
      if (oldGroup !== null) {
        state.customFields[moduleName][oldGroup].splice(oldIndex, 1);
      }
    
      if (!state.customFields[moduleName][newGroup]) {
        state.customFields[moduleName][newGroup] = [];
      }
    
      state.customFields[moduleName][newGroup].push(updatedField);
    
      state.error.update = null;
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
    .addCase(updateCustomFieldPriority.fulfilled, (state, action) => {
      state.loading.priority = false;
    
      const { fieldId, updatedField } = action.payload;
    
      const moduleName = updatedField.field_for;
      const groupName = updatedField.field_group;
    
      const group = state.customFields[moduleName]?.[groupName];
      if (!group) return;
    
      const index = group.findIndex(f => f.id === fieldId);
    
      if (index !== -1) {
        group[index].priority = updatedField.priority;
      }
    
      group.sort((a, b) => a.priority - b.priority);
    })
    // .addCase(updateCustomFieldPriority.rejected,(state,action)=>{
    //     state.loading.priority=false;
    //     state.error.priority=action.payload;
    // })

})

export const { reorderCustomFields, moveCustomField } =
  customFieldSlice.actions;

export default customFieldSlice.reducer;
