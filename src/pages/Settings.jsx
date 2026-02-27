"use client"

import { useState,useEffect } from "react"
import {
  Settings,
  Palette,
  Globe,
  ToggleLeft,
  LayoutDashboard,
  PieChart,
  Users,
  Building,
  Menu,
  Megaphone
} from "lucide-react"

import LeadStages from "../features/leadsStage/LeadStageList";
import CustomFields from "../features/customFields/CustomField";
import LeadChannel from "../features/leadChannel/LeadChannel";
import {useSearchParams,useNavigate} from "react-router-dom"
import ThemeSelect from '../components/shared/ThemeSelect'
import Button from '../components/ui/Button'
import UsersFilterPage from '../components/UsersFilterPage'


export default function SettingsPage() {

  const [searchParams,setSearchParams]=useSearchParams()
  const navigate=useNavigate();

  const urlTab=searchParams.get("tab") || "general"

  const [activeTab, setActiveTab] = useState(urlTab)
  
  const [sidebar,setSidebar]=useState(false)

  useEffect(()=>{
    setSearchParams({tab:activeTab})
    
  },[activeTab,setSearchParams])

  const handleTabChange=(tabId)=>{
    setActiveTab(tabId)

    navigate(`?tab=${tabId}`,{replace:true})
  }

  return (
    <div className="min-h-screen bg-gray-50 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-300">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-600">Manage your application preferences</p>
            </div>
            <div className="sm:hidden">
            <Menu size={24} color="blue" onClick={()=>setSidebar(!sidebar)} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row relative overflow-auto">
          {/* Sidebar */}
         
          <div className={`w-full lg:w-64 ${sidebar?"absolute":"hidden"} top-0 left-0 z-10 sm:relative sm:block border-b lg:border-b-0 bg-(--color-sidebar-bg) border border-(--color-text) lg:border-r p-4`}>
            <h3 className="font-semibold text-(--color-text) mb-4 px-2">Categories</h3>
            <div className="space-y-1">
              {[
                { id: "general", name: "General", icon: Settings },
                { id: "appearance", name: "Appearance", icon: Palette },
                { id: "localization", name: "Localization", icon: Globe },
                { id: "features", name: "Features", icon: ToggleLeft },
                { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
                { id: "contacts", name: "Contacts", icon: Users},
                { id: "lead-channel", name: "LeadChannel", icon: Megaphone },
                { id: "pipeline", name: "Pipeline", icon: PieChart },
                { id: "leads", name: "Leads", icon: Users },
                { id: "accounts", name: "Accounts", icon: Building },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleTabChange(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-(--color-sidebar-text) flex items-center gap-2 text-sm ${
                    activeTab === category.id
                      ? "bg-(--color-nav-active-bg) text-white font-medium"
                      : "hover:text-(--color-nav-hover-text) hover:bg-(--color-nav-hover-bg)"
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>
              <ThemeSelect/>
              <Button/>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Appearance</h2>
                <UsersFilterPage/>
              </div>
            )}

            {/* Localization Settings */}
            {activeTab === "localization" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Localization Settings</h2>
              </div>
            )}

            {/* Features Settings */}
            {activeTab === "features" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Feature Settings</h2>
              </div>
            )}

            {/* Dashboard Settings */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Settings</h2>
              </div>
            )}

  {/* Dashboard Settings */}
  {activeTab === "contacts" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contacts Settings</h2>
                <div className="space-y-6">
                 <CustomFields FieldType="Contacts"/>
                </div>
              </div>
            )}
  {/* Dashboard Settings */}
  {activeTab === "lead-channel" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Lead Channel Settings</h2>
                <div className="space-y-6">
                 <LeadChannel/>
                </div>
              </div>
            )}
            {/* Enhanced Pipeline Settings */}
            {activeTab === "pipeline" && (
                                <div className="space-y-6">
                                <LeadStages/>
                                                    </div>
            )}

            {/* Simple Leads Settings */}
            {activeTab === "leads" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Leads Settings</h2>
                <div className="space-y-6">
                 <CustomFields FieldType="leads"/>
                </div>
              </div>
            )}

            {/* Accounts Settings */}
            {activeTab === "accounts" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}