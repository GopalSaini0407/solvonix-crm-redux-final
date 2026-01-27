import { FaEdit } from "react-icons/fa";
import { useDispatch,useSelector } from "react-redux";
import {fetchCustomField,reorderCustomFields,moveCustomField,updateCustomFieldPriority} from "./customFieldSlice";
import CustomFieldForm from './CustomFieldForm';
import { useEffect } from "react";
import { useModal } from '../../context/ModalContext';
import Loader from "../../components/ui/Loader";
import {DragDropContext,Droppable,Draggable} from "@hello-pangea/dnd"



const ViewFieldList=()=>{
   const {openModal,closeModal}=useModal();
const dispatch=useDispatch();
const {customFields,error,loading}=useSelector((state)=>state.customFields);

console.log(customFields)


const handleDragEnd = (result) => {
   const { source, destination } = result;
   if (!destination) return;
 
   // same group reorder
   if (source.droppableId === destination.droppableId) {
     const groupName = source.droppableId;
 
     const items = Array.from(customFields[groupName]);
     const [moved] = items.splice(source.index, 1);
     items.splice(destination.index, 0, moved);
 
     const updatedFields = items.map((f, i) => ({
       ...f,
       priority: i + 1,
     }));
 
     dispatch(
       reorderCustomFields({
         groupName,
         updatedFields,
       })
     );
 
     updatedFields.forEach((field) => {
       dispatch(
         updateCustomFieldPriority({
           fieldId: field.id,
           updatedField: {
             priority: field.priority,
             field_group: groupName,
           },
         })
       );
     });
   }
 
   // move to another group
   else {
     const sourceGroup = source.droppableId;
     const destGroup = destination.droppableId;
 
     const sourceItems = Array.from(customFields[sourceGroup]);
     const destItems = Array.from(customFields[destGroup]);
 
     const removed = sourceItems.splice(source.index, 1)[0];
     const moved = { ...removed, field_group: destGroup };
     
 
     destItems.splice(destination.index, 0, moved);
 
     const updatedSource = sourceItems.map((f, i) => ({
       ...f,
       priority: i + 1,
     }));
 
     const updatedDest = destItems.map((f, i) => ({
       ...f,
       priority: i + 1,
     }));
 
     dispatch(
       moveCustomField({
         sourceGroup: { name: sourceGroup, fields: updatedSource },
         destGroup: { name: destGroup, fields: updatedDest },
       })
     );
 
     [...updatedSource, ...updatedDest].forEach((field) => {
       dispatch(
         updateCustomFieldPriority({
           fieldId: field.id,
           updatedField: {
             priority: field.priority,
             field_group: field.field_group,
           },
         })
       );
     });
   }
 };
 

useEffect(()=>{
dispatch(fetchCustomField())
},[dispatch])

  // ---------------- UI ----------------

  if (loading.fetch){
     return ( <Loader text="Field loading..." size="lg"/> )
  } 

// 🔹 Error
if (error.fetch) {
  console.log(error);
}

return(
<>
<div className="max-w-6xl mx-auto px-4">
   <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
      Dynamic Groups
   </h2>
   <DragDropContext onDragEnd={handleDragEnd}>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Object.entries(customFields ||{}).map(([groupName, fields]) => (
      <Droppable droppableId={groupName} key={groupName}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="bg-white shadow-sm rounded-2xl border border-gray-100 p-5 hover:shadow-md transition min-h-[200px]"
          >
            <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b pb-2">
              {groupName}
            </h3>

            <ul className="space-y-2">
              {fields.filter(field=>field)
                .slice()
                .sort((a, b) => a.priority - b.priority)
                .map((field, index) => (
                  <Draggable
                  key={field.id ?? `${groupName}-${index}`}
                  draggableId={
                    field.id ? field.id.toString() : `${groupName}-${index}`
                  }
                  index={index}
                >
                
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between text-gray-700 border p-2 border-gray-100 rounded bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <span>
                          {field.display_text}{" "}
                          <small className="text-xs text-gray-400">
                            (P : {field.priority})
                          </small>
                        </span>

                        <button
                          className="text-blue-500 hover:text-blue-700 transition"
                          onClick={() =>
                            openModal({
                              title: "add field",
                              size: "lg",
                              content: (
                                <CustomFieldForm
                                  fieldData={field}
                                  closeModal={closeModal}
                                />
                              ),
                            })
                          }
                        >
                          <FaEdit />
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </ul>
          </div>
        )}
      </Droppable>
    ))}
  </div>
</DragDropContext>

</div>
</>
)
}
export default ViewFieldList