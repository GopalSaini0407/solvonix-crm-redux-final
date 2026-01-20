import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* yaha logo / branding / bg bhi laga sakte ho */}
      <Outlet />
    </div>
  )
}

export default AuthLayout
