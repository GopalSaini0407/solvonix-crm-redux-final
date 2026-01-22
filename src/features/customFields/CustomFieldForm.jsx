

const CustomFieldForm=({field,closeModal})=>{


    const baseClasses = "p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none";

    return(<>
   <form onSubmit="" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Display Text *</label>
  <input
    type="text"
    placeholder="enter label name"
    className={baseClasses}
  />
  <p className="text-xs text-gray-500 mt-1">
    Field name:
  </p>
</div>

           <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
              <input type="text" 
              placeholder="enter field type"
              className={baseClasses}
              />
           </div>
           <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Field Group</label>
              <input type="text"
                className={baseClasses} 
                placeholder="enter field group"
                 />
           </div>
           <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
              <input type="text" 
              
              placeholder="enter Placeholder"
               className={baseClasses}
               />
           </div>
           <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <input type="text" 
              
              placeholder="enter priority"
               className={baseClasses}
                />
           </div>
  


         
           <div className="flex items-center gap-5">
           <label className="block m-2 text-sm  font-medium text-gray-700 mb-1">is required</label>
              <input type="checkbox"
               className={baseClasses} />
           </div>
        
           
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