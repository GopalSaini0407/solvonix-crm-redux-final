import { useState } from "react";


const CustomFieldForm=({fieldData})=>{

     const [field,setField]=useState(fieldData || {})

    console.log(fieldData)

const addHandler=(e)=>{
  e.preventDefault();
  console.log(field,"submit");
}

    const baseClasses = "p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none";
    return(<>
   <form onSubmit={addHandler} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Display Text *</label>
  <input
    type="text"
    placeholder="enter label name"
    className={baseClasses}
    value={field.display_text}
    onChange={(e)=>{
            const display_text=e.target.value
          // field_name generate from display_text
            const field_name=display_text ? display_text.toLowerCase().replace(/\s+/g,"_"):"_";
            setField({...field,display_text,field_name});
          }}
  />
  <p className="text-xs text-gray-500 mt-1">
    Field name:{field.field_name}
  </p>
</div>

           <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
              <input type="text" 
              placeholder="enter field type"
              className={baseClasses}
              value={field.field_type}
              onChange={(e)=>setField({...field,field_type:e.target.value})}
              readOnly
              required
              />
           </div>
           <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Field Group</label>
              <input type="text"
                className={baseClasses} 
                placeholder="enter field group"
                value={field.field_group}
                onChange={(e)=>setField({...field,field_group:e.target.value})}
                required
                 />
           </div>
           <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
              <input type="text" 
              placeholder="enter Placeholder"
               className={baseClasses}
               value={field.placeholder}
               onChange={(e)=>setField({...field,placeholder:e.target.value})}
             required
               />
           </div>
           <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <input type="text" 
              placeholder="enter priority"
               className={baseClasses}
                value={field.priority}
                onChange={(e)=>setField({...field,priority:e.target.value})}
                />
           </div>

           <div className="flex items-center gap-5">
           <label className="block m-2 text-sm  font-medium text-gray-700 mb-1">is required</label>
              <input type="checkbox"
               className={baseClasses}
               checked={field.is_required}
               onChange={(e)=>setField({...field,is_required:e.target.checked})}
               />
               
           </div>
           {
            field.field_type==="String"?<div className="flex items-center gap-5">
           <label className="block m-2 text-sm  font-medium text-gray-700 mb-1">is Email</label>
              <input type="checkbox"
               className={baseClasses}
               checked={field.is_email}
               onChange={(e)=>setField({...field,is_email:e.target.checked})}
               />
               
           </div>:null
           }
       
        
           
             <div>
             <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Field
            </button>
             </div>
         
            </form>
    
    </>)
}

export default CustomFieldForm