import api from "../../app/api";

const getOpportunities = async (params = {}) => {
  const res = await api.post("/user/opportunities", params);
  return res.data;
};

const createOpportunity = async (data) => {
  const res = await api.post("/user/save/opportunity", data);
  return res.data;
};

const updateOpportunity = async (opportunityId, data) => {
  const res = await api.post(`/user/update/opportunity/${opportunityId}`, data);
  return res.data;
};

const deleteOpportunity = async (opportunityId) => {
  const res = await api.get(`/user/delete/opportunity/${opportunityId}`);
  return res.data;
};

export default {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
