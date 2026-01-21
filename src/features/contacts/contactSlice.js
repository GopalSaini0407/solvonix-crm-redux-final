import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import contactService from "./contactService";


  export const fetchContacts=createAsyncThunk("contacts/fetchContacts",async(params,thunkAPI)=>{
    try {
        return await contactService.getContacts(params);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
   });

  export const addContact=createAsyncThunk("contacts/addContact",async(Contactdata,thunkAPI)=>{
    
    try {
        return await contactService.addContact(Contactdata)
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
   })

  export const updateContact=createAsyncThunk("contacts/updateContacts",async({contactId,contactData},thunkAPI)=>{

    try{
        return await contactService.updateContact(contactId,contactData);
    } catch(err){
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
   })

  export const deleteContact=createAsyncThunk("contacts/deleteContacts",async(contactId,thunkAPI)=>{
   
    try {
        await contactService.deleteContact(contactId);
        return contactId;
        
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }

   })

  export const fetchContactFields=createAsyncThunk("contacts/getContactFields",async(_,thunkAPI)=>{
   
    try {
        return await contactService.getContactFields();
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
        
    }

   })

   export const fetchContactActivityLog=createAsyncThunk("contacts/fetchContactActivityLog",async(contactId,thunkAPI)=>
{
    try {
        return await contactService.contactActivityLog(contactId);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
})

   const initialState={
    contacts:[],
    pagination:{
        current_page:1,
        last_page:1,
        total:0,
        per_page:10,
    },
        fields:{},
        fieldValues:{},
        activities:[],
        loading: {
            fetch: false,
            create: false,
            update: false,
            delete:false,
            log:false
          },
          error: {
            fetch: null,
            create: null,
            update: null,
            delete:null,
            log:null
          }
   }




   const contactSlice=createSlice({
    name:"contacts",
    initialState,
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
    extraReducers:(builder)=>{
        builder

        // get contacts
        .addCase(fetchContacts.pending,(state)=>{
         state.loading.fetch=true;
         state.error.fetch=null;
        })
        .addCase(fetchContacts.fulfilled,(state,action)=>{
            state.loading.fetch=false;
            const pageData=action.payload?.data;
            state.contacts=pageData?.data || [];
            state.pagination.current_page=pageData?.current_page;
            state.pagination.last_page=pageData?.last_page;
            state.pagination.total=pageData?.total;
            state.pagination.per_page=pageData?.per_page;
        })
        .addCase(fetchContacts.rejected,(state,action)=>{
            state.loading.fetch=false;
            state.error.fetch=action.payload
        })

        // add contact

        .addCase(addContact.pending,(state)=>{
            state.loading.create=true;
            state.error.create=null;
        })
        .addCase(addContact.fulfilled,(state,action)=>{
            state.loading.create=false;
            state.contacts.push(action.payload?.data);
        })
        .addCase(addContact.rejected,(state,action)=>{
            state.loading.create=false;
            state.error.create=action.payload?.data || action.payload?.message;
        })

        // update contact
         
        .addCase(updateContact.pending,(state)=>{
            state.loading.update=true;
            state.error.update=null;
        })
        .addCase(updateContact.fulfilled,(state,action)=>{
            state.loading.update=false;
            const index=state.contacts.findIndex((contact)=>contact.id===action.payload?.data.id);
            if(index!==-1) state.contacts[index]=action.payload?.data;
        })
        .addCase(updateContact.rejected,(state,action)=>{
            state.loading.update=false;
            state.error.update=action.payload?.data || action.payload?.message;
        })

        // delete contact

        .addCase(deleteContact.pending,(state)=>{
          state.loading.delete=true;
          state.error.delete=null;
        })
        .addCase(deleteContact.fulfilled,(state,action)=>{
            state.loading.delete=false;
           state.contacts=state.contacts.filter((contact)=>contact.id!==action.payload?.data); 
        })
        .addCase(deleteContact.rejected,(state,action)=>{
            state.loading.delete=false;
            state.error.delete=action.payload?.data;
        })
          // Fetch Activity Log
           .addCase(fetchContactActivityLog.pending, (state) => {
             state.loading.log = true;
             state.error.log = null;
           })
           .addCase(fetchContactActivityLog.fulfilled, (state, action) => {
             state.loading.log = false;
             state.activities = action.payload?.data; // backend se return array of logs
           })
           .addCase(fetchContactActivityLog.rejected, (state, action) => {
             state.loading.log = false;
             state.error.log = action.payload?.data;
           })
        // fetchContactFields

        .addCase(fetchContactFields.pending,(state)=>{
         state.loading.fetch=true;
         state.error.fetch=null;
        })
        .addCase(fetchContactFields.fulfilled,(state,action)=>{
            state.loading.fetch=false;
            state.fields=action.payload.data;
        })
        .addCase(fetchContactFields.rejected,(state,action)=>{
            state.loading.fetch=false;
            state.error.fetch=action.payload;
        })

    }
   })
   
export const { setFieldValue,resetFieldValues } = contactSlice.actions;
export default contactSlice.reducer;