import api from "../../app/api";

 //get employees
 const getEmployees = async (params={}) => {
    const res = await api.post(`/user/employees`, params);
    return res.data;
 }

 // add employee
  const addEmployee = async (data) => {
    const res = await api.post(`/user/save/employee`,data);
    return res.data;
  }

  // update employee details
  const updateEmployee = async (employeeId, data)=>{
    const res = await api.post(`/user/update/employee/${employeeId}`, data);
    return res.data;
  }

  // delete employee
    const deleteEmployee = async (employeeId) => {
        const res = await api.post(`/user/delete/employee`, { id: employeeId });
        return res.data;
    }


    export default {
        getEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee
    }