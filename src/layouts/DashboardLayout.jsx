
import { Outlet,NavLink } from "react-router-dom"
import Navbar from '../components/navbar/Navbar'
const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
     <Navbar/>
     <main className="page-content">
        <Outlet />
      </main>
        {/* FOOTER */}
        <footer className="footer">
        © 2026 Solvonix
      </footer>
    </div>
  )
}

export default DashboardLayout
