import React, { useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import {getLeadChannel, updateLeadChannel} from '../leadChannel/leadChannelSlice';
import CustomButton from '../../components/ui/CustomButton';
import {
    Pencil,
    Eye,
    EyeOff
  } from "lucide-react";
import { useModal } from '../../context/ModalContext';
import AddLeadChannel from './AddLeadChannel';
import UpdateLeadChannel from './UpdateLeadChannel';
import Loader from '../../components/ui/Loader';

function LeadChannel() {

    const { openModal, closeModal } = useModal();

    const dispatch=useDispatch();
    const { leadChannel, loading } = useSelector(
        (state) => state.leadChannel
      );

    useEffect(()=>{
      dispatch(getLeadChannel())
    },[dispatch])

    const handleToggleActive = async (channel) => {
      try {
        await dispatch(
          updateLeadChannel({
            id: channel.id,
            data: {
              channel: channel.channel,
              is_active: Number(channel.is_active) === 1 ? 0 : 1,
            },
          })
        ).unwrap();
      } catch (err) {
        alert(err?.message || "Failed to update source status");
      }
    };

    if (loading.fetch) {
      return <Loader text="Loading Lead Channels..." size="lg" />;
    }
  return (
    <div className='lead-channel'>
     
        <div className="top-box flex justify-between items-center">
            <h1>Lead Channel</h1>
            <CustomButton onClick={()=>openModal({
              title:"Add Lead Source",
              size:"md",
              content:<AddLeadChannel closeModal={closeModal}/>,
            })
          } 
            
            variant='themePrimary'>Add Lead Channel</CustomButton>
        </div>
        <div className="lead-channel-parent-box mt-5">
            {
                leadChannel?.map((leadChannel)=>(
                    <div key={leadChannel.id} className="lead-channel-box mb-3 flex justify-between items-center border border-1 p-3 rounded border-gray-300">
                    <div>
                      <h1 className='text-black'>{leadChannel.channel}</h1>
                      <p className={`text-sm ${Number(leadChannel.is_active) === 1 ? "text-green-600" : "text-gray-500"}`}>
                        {Number(leadChannel.is_active) === 1 ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                    <button className='btn p-2'
                    onClick={()=>handleToggleActive(leadChannel)}
                    title={Number(leadChannel.is_active) === 1 ? "Deactivate source" : "Activate source"}
                    >
                        {Number(leadChannel.is_active) === 1 ? (
                          <Eye size={16} className="text-green-500"/>
                        ) : (
                          <EyeOff size={16} className="text-gray-500"/>
                        )}
                        </button>

                          <button onClick={()=>openModal({
                            title:"Update Lead Source",
                            size:"md",
                            content:<UpdateLeadChannel leadChannel={leadChannel} closeModal={closeModal}/>
                          })}>
                        <Pencil size={16} className="text-blue-500"/>
                        </button>
                    </div>
                  </div>
                ))
             
            }
        
        </div>
    </div>
  )
}

export default LeadChannel;
