import React, { useState } from 'react';
import CustomButton from '../../components/ui/CustomButton';
import { useDispatch,useSelector } from 'react-redux';
import {getLeadChannel,addLeadChannel} from '../leadChannel/leadChannelSlice'

function AddLeadChannel({closeModal}) {
  
  const dispatch=useDispatch();
  const { loading } = useSelector(state => state.leadChannel)

  console.log(loading)
  const [form,setForm]=useState({
    channel:"",
    // is_active:0,
  })

  const handleChange=(e)=>{
    const { name, value, type, checked } = e.target;

    setForm((prev)=>({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
  
    const trimmedChannel = form.channel.trim()
  
    if (!trimmedChannel) {
      alert("Source name is required")
      return;
    }
  
    try {
      await dispatch(addLeadChannel({
        ...form,
        channel: trimmedChannel
      })).unwrap()
  
      dispatch(getLeadChannel())
      closeModal()
  
    } catch (err) {
      alert(err?.message || "Failed to add source")
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
              disabled={loading.create}
            variant='themePrimary' type="submit">{loading.create ? "Adding..." : "Add Source"}</CustomButton>
            </div>
        </form>
    </div>
  )
}

export default AddLeadChannel;