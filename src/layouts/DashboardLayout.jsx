
import { Outlet,NavLink } from "react-router-dom"
import Navbar from '../components/navbar/Navbar'
import {getProfile} from "../features/auth/authSlice"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
const DashboardLayout = () => {

  const dispatch=useDispatch();

  useEffect(()=>{
   const token=localStorage.getItem("access_token");
   
   if(token){
    dispatch(getProfile());
   }

  },[])

  return (
    <div className="dashboard-layout">
     <Navbar/>
     <main className="page-content max-w-7xl mx-auto min-h-screen bg-gray-50 p-4 md:p-6">
        <Outlet />
      </main>
        {/* FOOTER */}
        <footer className="footer text-center py-3 bg-(--color-surface) text-(--color-text)">
        © 2026 Solvonix
      </footer>
    </div>
  )
}

export default DashboardLayout
