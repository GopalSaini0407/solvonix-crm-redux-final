import api from "../../app/api";

const getProfile=async()=>{
    const res=await api.get("/user/profile");
    return res.data
  }

const createProfile=async(data)=>{
    const res=await api.post(`/user/create`,data);
    return res.data;

}

const updateProfile=async(profileId,data)=>{
    const res=await api.post(`/user/profile${profileId}`,data)
    return res.data
}

const deleteProfile=async(profileId)=>{
    const res=await api.get(`/user/delete${profileId}`)

}


export default {
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile
}

