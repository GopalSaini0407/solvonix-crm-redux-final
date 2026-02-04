import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user,isLoading } = useSelector((state) => state.auth);

  const isAuthenticated = !!token;

  const handleLogout = async() => {
   try {
       await dispatch(logout()).unwrap();
   } catch (err) {
    console.error("logout failed:",err);
   }finally{
    navigate("/login");
   }
  };

  return {
    token,
    user,
    isAuthenticated,
    isLoading,
    handleLogout,
  };
};

export default useAuth;
