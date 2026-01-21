import api from "../../app/api";

const fetchCustomField=async()=>{
      const res=await api.get('/get/contacts/fields')
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
    fetchCustomField,
    addCustomField,
    updateCustomField,
    updateCustomFieldPriority
}