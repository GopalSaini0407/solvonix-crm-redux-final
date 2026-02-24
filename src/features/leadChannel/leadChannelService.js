import api from "../../app/api";

const getLeadChannel=async()=>{

    const res=await api.get('/user/lead-channels');
    return res.data;
}

const addLeadChannel=async(data)=>{

    const res=await api.post('/user/lead-channels/add',data);
    return res.data;
}

const updateLeadChannel=async(id,data)=>{
const res=await api.post(`/user/lead-channels/update/${id}`,data);
return res.data;
}



export default {getLeadChannel,addLeadChannel,updateLeadChannel};