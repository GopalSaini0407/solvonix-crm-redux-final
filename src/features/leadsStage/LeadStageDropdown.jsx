import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLeadStage } from './leadStageSlice';
function LeadStageDropdown() {
     const dispatch=useDispatch()
     const { leadStages} = useSelector(
        (state) => state.leadStages
      );    

   useEffect(()=>{
     dispatch(fetchLeadStage())
   },[dispatch])
   
  return (
    <div>
      <select name="channel" id="channel" className='w-full px-3 py-2 border border-gray-300 outline-none  rounded-lg focus:ring-2 focus:ring-blue-500'>
      <option value="all">All select</option>
       {
        leadStages?.map((stage)=>(
            <option value={stage.id} key={stage.id}>{stage.stage_name}</option>
        ))
       }
      </select>
    </div>
  )
}

export default LeadStageDropdown;