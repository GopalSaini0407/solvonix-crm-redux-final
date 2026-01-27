import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomField,
  reorderCustomFields,
  moveCustomField,
  updateCustomFieldPriority,
} from "./customFieldSlice";
import CustomFieldForm from "./CustomFieldForm";
import { useEffect } from "react";
import { useModal } from "../../context/ModalContext";
import Loader from "../../components/ui/Loader";
import PriorityDragDrop from "../../components/shared/PriorityDragDrop";

const ViewFieldList = () => {
  const { openModal, closeModal } = useModal();
  const dispatch = useDispatch();
  const { customFields, error, loading } = useSelector(
    (state) => state.customFields
  );

  useEffect(() => {
    dispatch(fetchCustomField());
  }, [dispatch]);

  const handleDragEnd = ({ source, destination }) => {
    if (!destination) return;

    // 🔹 SAME GROUP
    if (source.droppableId === destination.droppableId) {
      const groupName = source.droppableId;

      const items = Array.from(customFields[groupName]);
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);

      const updated = items.map((f, i) => ({
        ...f,
        priority: i + 1,
      }));

      dispatch(reorderCustomFields({ groupName, updatedFields: updated }));

      updated.forEach((field) => {
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

    // 🔹 MOVE TO OTHER GROUP
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

  if (loading.fetch) {
    return <Loader text="Field loading..." size="lg" />;
  }

  if (error.fetch) {
    console.log(error);
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        Dynamic Groups
      </h2>

      <PriorityDragDrop
        grouped
        data={customFields}
        onDragEnd={handleDragEnd}
        containerClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        getItemId={(field, index) =>
          field.id ? field.id.toString() : `field-${index}`
        }
        renderItem={(field) => (
          <div className="flex mt-2 items-center justify-between text-gray-700 border-2 p-2 border-gray-100 rounded bg-gray-50 hover:bg-gray-100 transition">
            <span>
              {field.display_text}{" "}
              <small className="text-xs text-gray-400">
                (P : {field.priority})
              </small>
            </span>

            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() =>
                openModal({
                  title: "Edit Field",
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
          </div>
        )}
      />
    </div>
  );
};

export default ViewFieldList;
