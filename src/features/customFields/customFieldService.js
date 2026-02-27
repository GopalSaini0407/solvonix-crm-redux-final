import api from "../../app/api";

const fetchContactCustomField=async()=>{
      const res=await api.get('user/get/contacts/fields')
      return res.data;
}

const fetchLeadCustomField=async()=>{
    const res=await api.get('user/get/leads/fields')
    return res.data;
}

const addCustomField=async(addedField)=>{
    const res= await api.post('/user/save/custom/field',addedField);
    return res.data;
}

const updateCustomField=async(updatedField)=>{
    const res=await api.post(`/user/update/custom/field`,updatedField);
    return res.data
}

const updateCustomFieldPriority=async(fieldId,updatedField)=>{
    const res=await api.post(`/user/custom/field/priority/update/${fieldId}`,updatedField);
    return res.data;
}

export default {
    fetchContactCustomField,
    fetchLeadCustomField,
    addCustomField,
    updateCustomField,
    updateCustomFieldPriority
}