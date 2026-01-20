import api from '../../app/api';


const getLeadStage= async()=>{
    const res= await api.get(`/user/lead-stages`);
    return res.data;

}

const addLeadStage=async(data)=>{
    const res=await api.post(`user/lead-stage/add`,data);
    return res.data;
}

const updateLeadStage=async(leadStageId,data)=>{
    const res=await api.post(`/user/lead-stage/update/${leadStageId}`,data);
    return res.data;
}

const changeLeadStagePriority=async(leadStageId,data)=>{

    const res=await api.post(`/user/lead-stage/changePriority/${leadStageId}`,data);
    return res.data;

}

export default {
    getLeadStage,
    addLeadStage,
    updateLeadStage,
    changeLeadStagePriority}