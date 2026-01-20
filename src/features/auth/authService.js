import api from "../../app/api"

const login =async (credential)=>{

    const res=await api.post("/user/login",credential);

    if(res.data?.access_token){
        localStorage.setItem("access_token",res.data.access_token)
    }
    return res.data
}

const register = async (data) => {
    const res = await api.post("/user/register", data)
    return res.data
  }

  const profile=async()=>{
    const res=await api.get("/user/profile");
    return res.data
  }

const logout = () => {
    localStorage.removeItem("access_token")
  }

  export default {
    login,
    register,
    profile,
    logout,
  }