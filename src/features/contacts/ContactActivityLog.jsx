import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { fetchContactActivityLog } from "./contactSlice";
import Loader from "../../components/ui/Loader";


const ContactActivityLog=({contactId})=>{

    const dispatch=useDispatch();
    const {activityLog,loading,error}=useSelector((state)=>state.contacts);

    useEffect(()=>{
    if(contactId){
        dispatch(fetchContactActivityLog(contactId));
    }
    },[dispatch,contactId])
      if (loading.log) return <Loader text="Loading activity log..." />;
    if (error.log) return <p className="text-red-500">{error.log}</p>;
     if (!activityLog.length) return <p>No activity found</p>;
     console.log(activityLog)
    return(
        <>
        <ul className="divide-y divide-gray-200">
      {activityLog.map((log, idx) => (
        <li key={idx} className="p-2">
          <span className="font-semibold">{log.action}</span> by {log.user_name} at {new Date(log.created_at).toLocaleString()}
        </li>
      ))}
    </ul>
        </>
    )
}

export default ContactActivityLog;