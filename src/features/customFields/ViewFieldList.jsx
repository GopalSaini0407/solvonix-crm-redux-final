import { FaEdit } from "react-icons/fa";
import { useDispatch,useSelector } from "react-redux";
import {fetchCustomField} from "./customFieldSlice";
import { useEffect } from "react";

const ViewFieldList=()=>{
const dispatch=useDispatch();
const {customFields,error,loading}=useSelector((state)=>state.customFields);

console.log(customFields);

useEffect(()=>{
dispatch(fetchCustomField())
},[dispatch])

return(
<>
<div className="max-w-6xl mx-auto px-4">
   <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
      Dynamic Groups
   </h2>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {
      Object.entries(customFields).map(([groupName,field])=>(
      <div key={groupName} className="bg-white shadow-sm rounded-2xl border border-gray-100 p-5 hover:shadow-md transition min-h-[200px]">
         <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b pb-2">
            {groupName}
         </h3>
         {
         field.slice().sort((a,b)=>a.priority-b.priority).map((field,index)=>(
         <ul className="space-y-2" key={index}>
            <li 
               className="flex mb-2 items-center justify-between text-gray-700 border p-2 border-gray-100 rounded bg-gray-50 hover:bg-gray-100 transition"
               >
               <span>
               {field.display_text} {" "}
               <small className="text-xs text-gray-400">(P :{field.priority})</small>
               </span>
               <button className="text-blue-500 hover:text-blue-700 transition">
                  <FaEdit />
               </button>
            </li>
         </ul>
         ))
         }
      </div>
      ))
      }
      <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-5 hover:shadow-md transition min-h-[200px]">
         <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b pb-2">
            group name
         </h3>
         <ul className="space-y-2">
            <li 
               className="flex items-center justify-between text-gray-700 border p-2 border-gray-100 rounded bg-gray-50 hover:bg-gray-100 transition"
               >
               <span>
               display text {" "}
               <small className="text-xs text-gray-400">(P :1)</small>
               </span>
               <button className="text-blue-500 hover:text-blue-700 transition">
                  <FaEdit />
               </button>
            </li>
         </ul>
      </div>
   </div>
</div>
</>
)
}
export default ViewFieldList