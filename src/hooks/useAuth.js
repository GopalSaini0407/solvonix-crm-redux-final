import { useSelector, useDispatch } from "react-redux"
import { logout } from "../features/auth/authSlice"

const useAuth = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  const isAuthenticated = !!token

  const handleLogout = () => {
    dispatch(logout())
  }

  return { token, isAuthenticated, handleLogout }
}

export default useAuth
