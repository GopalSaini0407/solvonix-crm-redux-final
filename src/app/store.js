import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import contactsReducer from "../features/contacts/contactSlice";
import leadStageReducer from "../features/leadsStage/leadStageSlice";
import customFieldReducer from "../features/customFields/customFieldSlice";
import LeadsReducer from "../features/leads/leadSlice";
import LeadChannelReducer from "../features/leadChannel/leadChannelSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    contacts:contactsReducer,
    leadStages:leadStageReducer,
    customFields:customFieldReducer,
    leads:LeadsReducer,
    leadChannel:LeadChannelReducer,
  },
})
