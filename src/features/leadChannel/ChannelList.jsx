import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLeadChannel } from './leadChannelSlice';
function ChannelList() {
     const dispatch=useDispatch()
    const {leadChannel}=useSelector((state)=>state.leadChannel);
    console.log(leadChannel)
    
   useEffect(()=>{
     dispatch(getLeadChannel())
   },[dispatch])
   
  return (
    <div>
      <select name="channel" id="channel" className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'>
      <option value="all">All select</option>
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