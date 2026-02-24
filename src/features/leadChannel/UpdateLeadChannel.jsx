import React, { useEffect, useState } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { getLeadChannel,updateLeadChannel } from './leadChannelSlice';
import CustomButton from '../../components/ui/CustomButton';
function UpdateLeadChannel({closeModal,leadChannel}) {

    const dispatch=useDispatch();
    
      const {loading}=useSelector((state)=>state.leadChannel)

    const [form,setForm]=useState({
        channel:"",
    })
    console.log(leadChannel);
    
    const handleChange=(e)=>{
     const {name,value,type,checked}=e.target;
     setForm((prev)=>({
       ...prev,
       [name]:type==="checkbox"?(checked?1:0):value,
     }))
    }

    useEffect(()=>{
        setForm({
            channel:leadChannel.channel ?? ""
        })
    },[leadChannel])
      
    const handleSubmit=async(e)=>{
        e.preventDefault();

        if (!leadChannel.id) {
            alert("Invalid lead stage ID");
            return;
          }

        const trimdChannel=form.channel.trim();
        if(!trimdChannel){
            alert("channel required");
            return
        }

        try {
           await dispatch(updateLeadChannel({
            id: leadChannel.id,
            data: { channel: trimdChannel }
           }
            
           )).unwrap();
            dispatch(getLeadChannel());
            closeModal();

        } catch (err) {
            alert(err?.message || "update channel failed")
        }

    }
  return (
    <div className='add-lead-channel'>
    <form onSubmit={handleSubmit}>
        <div className='flex flex-col mb-3'>
        <label>Source Name</label>
        <input type="text"
         onChange={handleChange}
         name='channel'
         value={form.channel}
         className='py-2 px-3 border border-gray-300'
          placeholder='enter Source name' />
        </div>

        {/* <div>
            <input type="checkbox" 
               name='is_active'
               onChange={handleChange}
               checked={form.is_active === 1}
              className='p-2 me-3'
               id='active' />
            <label htmlFor="active">Active</label>
        </div> */}

        <div className='flex justify-end '>
        <CustomButton 
          disabled={loading.update}
        variant='themePrimary' type="submit">{loading.update ? "updating..." : "update Source"}</CustomButton>
        </div>
    </form>
</div>
  )
}

export default UpdateLeadChannel