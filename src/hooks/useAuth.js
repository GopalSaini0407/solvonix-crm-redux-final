import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user } = useSelector((state) => state.auth);

  const isAuthenticated = !!token;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return {
    token,
    user,
    isAuthenticated,
    handleLogout,
  };
};

export default useAuth;
