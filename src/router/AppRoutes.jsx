import { Routes, Route, Navigate } from "react-router-dom"

// Layouts
import AuthLayout from "../layouts/AuthLayout"
import DashboardLayout from "../layouts/DashboardLayout"

// Auth pages
import Login from "../features/auth/Login"
import Register from "../features/auth/Register"

// Protected
import ProtectedRoute from "./ProtectedRoute"

// CRM Pages
import ContactList from "../features/contacts/ContactList"
import LeadStageList from "../features/leadsStage/LeadStageList"

// later: Leads, Deals, Dashboard etc.
import Dashboard from "../pages/Dashboard"
import SettingsPage from "../pages/Settings"

import CustomField from "../features/customFields/CustomField"

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= AUTH ROUTES ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= PROTECTED DASHBOARD ROUTES ================= */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect */}
        
  <Route index element={<Dashboard />} />
  <Route path="settings" element={<SettingsPage />} />
  <Route path="contacts" element={<ContactList />} />
  <Route path="leadstage" element={<LeadStageList />} />
  <Route path="custom-field" element={<CustomField/>}/>
  <Route path="*" element={<Navigate to="/" replace />} />

      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
