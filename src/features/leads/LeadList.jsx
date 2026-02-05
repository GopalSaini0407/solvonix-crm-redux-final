import React, { useEffect } from 'react'
import {getLeads} from './leadSlice';
import { useDispatch,useSelector } from 'react-redux';
function LeadList() {
   const dispatch=useDispatch();
   const {leads,error,loading}=useSelector((state)=>state)
   console.log(leads)

   useEffect(()=>{
     dispatch(getLeads())
   },[dispatch])

  return (
    <div>LeadList</div>
  )
}

export default LeadList