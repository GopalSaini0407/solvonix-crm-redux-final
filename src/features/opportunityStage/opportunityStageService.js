import api from '../../app/api';

const getOpportunityStage= async()=>{
    const res= await api.get(`/user/opportunity-stages`);
    return res.data;

}

const addOpportunityStage=async(data)=>{
    const res=await api.post(`user/opportunity-stage/add`,data);
    return res.data;
}

const updateOpportunityStage=async(opportunityStageId,data)=>{
    const res=await api.post(`/user/opportunity-stage/update/${opportunityStageId}`,data);
    return res.data;
}

const changeOpportunityStagePriority=async(opportunityStageId,data)=>{

    const res=await api.post(`/user/opportunity-stage/changePriority/${opportunityStageId}`,data);
    return res.data;

}

export default {
    getOpportunityStage,
    addOpportunityStage,
    updateOpportunityStage,
    changeOpportunityStagePriority} 