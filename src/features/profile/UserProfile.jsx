"use client"

import { useEffect, useState } from 'react'
import { User, Mail, Phone, Lock, Building, Settings, LogOut, Edit } from 'lucide-react'
import { useDispatch,useSelector } from 'react-redux';
import { getProfile } from '../auth/authSlice';
import Loader from '../../components/ui/Loader';
import useAuth from '../../hooks/useAuth';

export default function UserProfile() {

    // const dispatch=useDispatch();
    const {user,isError,isLoading}=useSelector((state)=>state.auth)
    
    const {handleLogout}=useAuth();
     
     
  const [editMode, setEditMode] = useState(false)
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc.",
    role: "Administrator",
    tenant: "acme-corp",
    password: "********"
  })

//    useEffect(()=>{
//     dispatch(getProfile())
//    },[dispatch])

   if (isLoading){
    return ( <Loader text="Contacts loading..." size="lg"/> )
 } 

// 🔹 Error
if (isError) {
 console.log(isError);
}

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Here you would typically make an API call to save changes
    setEditMode(false)
    // Add your save logic here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <div className="flex space-x-4">
            {editMode ? (
              <>
                <button 
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-(--color-primary) text-(--color-bg) border border-(--color-text)"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button 
                onClick={() => setEditMode(true)}
                className="px-4 py-2 rounded-md text-sm font-medium bg-(--color-primary) text-(--color-bg) border border-(--color-text) flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 text-center">
                <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-pink-100">
                  <img 
                    src="https://randomuser.me/api/portraits/men/1.jpg" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                  {editMode && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <button className="p-2 bg-pink-600 rounded-full text-white">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-800">{user?.name||userData.name}</h2>
                <p className="text-(--color-text)">{user?.role||userData.role}</p>
                <p className="text-gray-500 text-sm mt-1">{user?.company|| userData.company}</p>
              </div>
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Tenant ID</span>
                  <span className="text-sm text-gray-900">{user?.tenant || userData.tenant}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 px-6 py-4">
                <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <Settings className="w-5 h-5 mr-2 text-gray-500" />
                  Account Settings
                </button>
                <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 mt-2">
                  <LogOut className="w-5 h-5 mr-2 text-red-500" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
              </div>
              <div className="px-6 py-5 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={user?.name || userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  ) : (
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{user?.name || userData.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={user?.email || userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{user?.email || userData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={user?.phone || userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{user?.phone || userData.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={user?.compnay || userData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Building className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{user?.compnay || userData.company}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  {editMode ? (
                    <div className="relative">
                      <input
                        type="password"
                        value={user?.password || userData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 pl-10"
                      />
                      <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 text-gray-400 mr-2" />
                      <span>••••••••</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tenant Information Section */}
            <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Tenant Information</h3>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tenant ID</label>
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-2 rounded-md text-sm font-mono">{user?.tenant ||userData.tenant}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 rounded-md text-sm bg-green-100 text-green-800">Premium</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                    <div className="flex items-center">
                      <span>Monthly</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Billing Date</label>
                    <div className="flex items-center">
                      <span>May 15, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}