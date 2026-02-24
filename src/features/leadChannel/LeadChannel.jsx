import React, { useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import {getLeadChannel} from '../leadChannel/leadChannelSlice';
import CustomButton from '../../components/ui/CustomButton';
import {
    Pencil,
    Star,
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
    const { leadChannel, loading, error } = useSelector(
        (state) => state.leadChannel
      );

    useEffect(()=>{
      dispatch(getLeadChannel())
    },[dispatch])

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
                    <h1 className='text-black'>{leadChannel.channel}</h1>
                    <div>
                    <button className='btn p-2'
                    onClick={()=>alert(leadChannel.id)}
                    >
                        <Eye size={16} className="text-green-500"/>
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