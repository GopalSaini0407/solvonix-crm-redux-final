import api from '../../app/api';


const getLeads=async()=>{
  const res=await api.post("/user/leads");
  return res.data;
}

const createLead=async(data)=>{
    const res=await api.post(`/user/create/lead`,data);
    return res.data;
}

const updateLead=async(leadId,data)=>{
    const res=await api.post(`/user/update/lead${leadId}`,data);
    return res.data;
}

const deleteLead=async(leadId)=>{
    const res=await api.post(`/user/delete/lead${leadId}`);
    return res.data;
}


export default {getLeads,createLead,updateLead,deleteLead};