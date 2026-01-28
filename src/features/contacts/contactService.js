import api from '../../app/api';

    // get contacts
const getContacts=async(params={})=>{
    const res=await api.post(`/user/contacts`,params);
    return res.data;
}

// save contact
const addContact=async(data)=>{
    const res=await api.post(`/user/save/contact`,data);
    return res.data;
}

// update contact details

const updateContact=async(contactId,data)=>{
    const res=await api.post(`/user/update/contact/${contactId}`,data);
    return res.data;
}

// get contact fields

const getContactFields=async()=>{
    const res=await api.get(`/user/get/contacts/fields`);
    return res.data;
}

// delete contact

const deleteContact=async(contactId)=>{
 const res=await api.get(`/user/contact/delete/${contactId}`);
 return res.data;
 
}


// contact activity log

const contactActivityLog=async(contactId)=>{
    const res=await api.get(`/user/contact/activity/log/${contactId}`);
    return res.data;
}

// export contact csv

const exportContactCsv = async (filters = {}, contactIds = []) => {
  const res = await api.get(
    "/user/contact/export/csv",
    {
      params: {
        filters: {
          search: filters.search,
          status: filters.status,
          date_from: filters.date_from,
          date_to: filters.date_to,
        },
        contact_ids: JSON.stringify(contactIds), // ⭐ IMPORTANT
      },
      responseType: "blob",
    }
  );

  return res.data;
};


export default {
    getContacts,
    addContact,
    updateContact,
    getContactFields,
    contactActivityLog,
    deleteContact,
    exportContactCsv
}