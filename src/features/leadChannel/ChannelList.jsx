import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLeadChannel } from './leadChannelSlice';
function ChannelList({ value, onChange }) {
     const dispatch=useDispatch()
    const {leadChannel}=useSelector((state)=>state.leadChannel);
    
   useEffect(()=>{
     dispatch(getLeadChannel())
   },[dispatch])
   
  return (
    <div>
      <select 
        name="source" 
        id="source" 
        value={value || ""} 
        onChange={(e) => onChange && onChange(e.target.value)}
        className='w-full px-3 py-2 border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-blue-500'
      >
      <option value="">All Sources</option>
       {
        leadChannel?.map((channel)=>(
            <option value={channel.id} key={channel.id}>{channel.channel}</option>
        ))
       }
      </select>
    </div>
  )
}

export default ChannelList