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


// lead activity log

const leadActivityLog=async(leadId)=>{
    const res=await api.get(`/user/lead/activity/log/${leadId}`);
    return res.data;
}

// get lead fields

const getLeadFields=async()=>{
    const res=await api.get(`/user/get/leads/fields`);
    return res.data;
}

// export lead csv

const exportLeadCsv = async (filters = {}, leadIds = []) => {
  const res = await api.get(
    "/user/lead/export/csv",
    {
      params: {
        filters: {
          search: filters.search,
          status: filters.status,
          date_from: filters.date_from,
          date_to: filters.date_to,
        },
        lead_ids: JSON.stringify(leadIds), // ⭐ IMPORTANT
      },
      responseType: "blob",
    }
  );

  return res.data;
};


export default {getLeads,createLead,updateLead,deleteLead,getLeadFields,leadActivityLog,exportLeadCsv};