import api from '../../app/api';


const getLeads=async(params={})=>{
  const res=await api.post("/user/leads",params);
  return res.data;
}

const createLead=async(data)=>{
    const res=await api.post(`user/save/lead`,data);
    return res.data;
}

const updateLead=async(leadId,data)=>{
    const res=await api.post(`/user/update/lead/${leadId}`,data);
    return res.data;
}
const deleteLead=async(leadId)=>{
    const res=await api.get(`/user/lead/delete/${leadId}`);
    return res.data;
}

// get contact fields

const getLeadFields=async()=>{
    const res=await api.get(`/user/get/leads/fields`);
    return res.data;
}



export default {getLeads,createLead,updateLead,deleteLead,getLeadFields};