import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeadCustomField,
  fetchContactCustomField,
  reorderCustomFields,
  moveCustomField,
  updateCustomField,
  updateCustomFieldPriority,
} from "./customFieldSlice";
import CustomFieldForm from "./CustomFieldForm";
import { useEffect } from "react";
import { useModal } from "../../context/ModalContext";
import Loader from "../../components/ui/Loader";
import PriorityDragDrop from "../../components/shared/PriorityDragDrop";
import { Eye, EyeOff } from "lucide-react";

const buildTogglePayload = (field, moduleName) => {
  const payload = {
    ...field,
    field_for: moduleName,
    is_required: Number(field?.is_required ?? 0),
    is_email: Number(field?.is_email ?? 0),
    is_multiple: Number(field?.is_multiple ?? 0),
    is_active: Number(field?.is_active ?? 0) === 1 ? 0 : 1,
    consent: Number(field?.consent ?? 0),
  };

  if (Array.isArray(payload.field_options)) {
    payload.field_options = payload.field_options.join(",");
  }

  return payload;
};

const ViewFieldList = ({moduleName}) => {
  const { openModal, closeModal } = useModal();
  const dispatch = useDispatch();
  const { customFields, error, loading } = useSelector(
    (state) => state.customFields
  );
  const moduleFields = customFields[moduleName] || {};

  // console.log(customFields);
  useEffect(() => {
    if (moduleName === "Leads") {
      dispatch(fetchLeadCustomField());
    } else if (moduleName === "Contacts") {
      dispatch(fetchContactCustomField());
    }
  }, [dispatch, moduleName]);


  const handleDragEnd = ({ source, destination }) => {
    if (!destination) return;

    // 🔹 SAME GROUP
    if (source.droppableId === destination.droppableId) {
      const groupName = source.droppableId;

      const items = Array.from(moduleFields[groupName] || []);

      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);

      const updated = items.map((f, i) => ({
        ...f,
        priority: i + 1,
      }));

      dispatch(
        reorderCustomFields({
          moduleName,
          groupName,
          updatedFields: updated
        })
      );

      updated.forEach((field) => {
        dispatch(
          updateCustomFieldPriority({
            fieldId: field.id,
            updatedField: {
              priority: field.priority,
              field_group: groupName,
              field_for: moduleName,   // 🔥 ADD THIS
            },
          })
        );
      });
    }

    // 🔹 MOVE TO OTHER GROUP
    else {
      const sourceGroup = source.droppableId;
      const destGroup = destination.droppableId;

      const sourceItems = Array.from(moduleFields[sourceGroup] || []);
const destItems = Array.from(moduleFields[destGroup] || []);

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
          moduleName,
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
              field_for: moduleName,   // 🔥 ADD THIS
            },
          })
        );
      });
    }
  };

  if (loading.fetchLead || loading.fetchContact) {
    return <Loader text="Field loading..." size="lg" />;
  }
  
  if (error.fetchLead || error.fetchContact) {
    console.log(error);
  }

  const toggleActive = async (field) => {
    try {
      await dispatch(updateCustomField(buildTogglePayload(field, moduleName))).unwrap();
    } catch (err) {
      alert(err?.message || "Failed to update field status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-3 flex items-center gap-2">
        Dynamic Groups
      </h2>

      <PriorityDragDrop
        grouped
        data={moduleFields}
        onDragEnd={handleDragEnd}
        containerClass="grid gap-6"
        getItemId={(field, index) =>
          field.id ? field.id.toString() : `field-${index}`
        }
        renderItem={(field) => (
          <div className="flex mt-2 items-center justify-between text-gray-700 border-2 p-2 border-gray-100 rounded bg-gray-50 hover:bg-gray-100 transition">
            <div>
              <span>
                {field.display_text}{" "}
                <small className="text-xs text-gray-400">
                  (P : {field.priority})
                </small>
              </span>
              <p className={`text-xs mt-1 ${Number(field.is_active) === 1 ? "text-green-600" : "text-gray-500"}`}>
                Preview: {Number(field.is_active) === 1 ? "Active" : "Inactive"}
              </p>
            </div>
            <div>
   <button
                    onClick={() => toggleActive(field)}
                    disabled={loading.update}
                    title={Number(field.is_active) === 1 ? "Deactivate field" : "Activate field"}
                    className={`p-2 rounded-lg cursor-pointer ${
                      Number(field.is_active) === 1
                        ? "text-green-600 hover:bg-green-100"
                        : "text-gray-400 hover:bg-gray-100"
                    } ${loading.update ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {Number(field.is_active) === 1 ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
  
            <button
              className="text-blue-500 hover:text-blue-700 cursor-pointer ms-2"
              onClick={() =>
                openModal({
                  title: "Edit Field",
                  size: "lg",
                  content: (
                    <CustomFieldForm
                      fieldData={field}
                      moduleName={moduleName} 
                      closeModal={closeModal}
                    />
                  ),
                })
              }
            >
              <FaEdit />
            </button>
            </div>
           
          </div>
        )}
      />
    </div>
  );
};

export default ViewFieldList;
