import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import contactsReducer from "../features/contacts/contactSlice";
import leadStageReducer from "../features/leadsStage/leadStageSlice";
import customFieldReducer from "../features/customFields/customFieldSlice";
import LeadsReducer from "../features/leads/leadSlice";
import LeadChannelReducer from "../features/leadChannel/leadChannelSlice"
import employeeReducer from "../features/employees/employeeSlice";
import opportunityStageReducer from "../features/opportunityStage/opportunityStageSlice";
import opportunityReducer from "../features/opportunities/opportunitySlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    contacts:contactsReducer,
    leadStages:leadStageReducer,
    opportunityStages:opportunityStageReducer,
    opportunities: opportunityReducer,
    customFields:customFieldReducer,
    leads:LeadsReducer,
    leadChannel:LeadChannelReducer,
    employees: employeeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})  
