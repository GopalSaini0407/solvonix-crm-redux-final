import { useState} from "react";
import { useDispatch } from "react-redux";
import {
  addCustomField,
  updateCustomField,
  fetchCustomField
} from "./customFieldSlice";

import { useModal } from "../../context/ModalContext";

const CustomFieldForm = ({ fieldData = {} }) => {
  const dispatch = useDispatch();
const {closeModal}=useModal()
  const isEditMode = Boolean(fieldData?.id);
  // 🧠 initial state
 const [field, setField] = useState({
  options_mode: "manual",
  is_multiple: 0,
  is_email: 0,
  is_required: 0,
  is_active: 0,
  consent:0,

  ...fieldData
});

console.log(fieldData)

  const baseClasses =
    "p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none";

  // 🔹 Build API payload
const buildPayload = () => {
  // console.log(field,"after")

  let payload = { ...field };

  // 🔐 force numeric values
  payload.is_required = payload.is_required ? 1 : 0;
  payload.is_email = payload.is_email ? 1 : 0;
  payload.is_multiple = payload.is_multiple ? 1 : 0;
  payload.is_active = payload.is_active ? 1 : 0;
  payload.consent = payload.consent ? 1 : 0;

 if (payload.field_type === "List" || payload.field_type === "Options") {
  if (payload.options_mode === "manual") {
    const optionsArray = payload.field_options
      ?.split(",")
      .map(o => o.trim())
      .filter(Boolean);
    //  console.log(optionsArray,"ram")
    // 🔥 validate non-empty
    if (!optionsArray || optionsArray.length === 0) {
      throw new Error("Manual field options cannot be empty");
    }

    payload.field_options = optionsArray;
  }
}

  payload.consent = payload.consent ?? 0; // 🔥 default 0 if missing
  delete payload.options_mode;
  return payload;
};


  // 🔥 ADD / UPDATE handler
  const submitHandler = async (e) => {
    e.preventDefault();

    const payload = buildPayload();
     console.log(payload,"before payload")
    try {
      if (isEditMode) {
        await dispatch(updateCustomField(payload)).unwrap();
        console.log(payload)
        alert("Field updated successfully");
        closeModal()
      } else {
        await dispatch(addCustomField(payload)).unwrap();
        console.log(payload,"after payload")
        console.log(addCustomField,"after add")
        alert("Field added successfully");

        closeModal()
      }

      dispatch(fetchCustomField());
    } catch (err) {
      alert(err?.message || "Operation failed");
      console.log(err)
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="grid grid-cols-1 md:grid-cols-2 gap-3"
    >
      {/* Display Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Text *
        </label>
        <input
          type="text"
          className={baseClasses}
          value={field.display_text || ""}
          onChange={(e) => {
            const display_text = e.target.value;
            const field_name = display_text
              ? display_text.toLowerCase().replace(/\s+/g, "_")
              : "";
            setField({ ...field, display_text, field_name });
          }}
        />
        <p className="text-xs text-gray-500 mt-1">
          Field name: {field.field_name || "-"}
        </p>
      </div>

      {/* Field Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Field Type
        </label>
        <input
          type="text"
          className={baseClasses}
          value={field.field_type || ""}
           onChange={(e) =>
            setField({ ...field, field_type: e.target.value })
          }
          readOnly
        />
      </div>

      {/* Field Group */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Field Group
        </label>
        <input
          type="text"
          className={baseClasses}
          value={field.field_group || ""}
          onChange={(e) =>
            setField({ ...field, field_group: e.target.value })
          }
        />
      </div>

      {/* Placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Placeholder
        </label>
        <input
          type="text"
          className={baseClasses}
          value={field.placeholder || ""}
          onChange={(e) =>
            setField({ ...field, placeholder: e.target.value })
          }
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <input
          type="number"
          className={baseClasses}
          value={field.priority || ""}
          onChange={(e) =>
            setField({ ...field, priority: Number(e.target.value) })
          }
        />
      </div>

      {/* Options */}
      {(field.field_type === "List" || field.field_type === "Options") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Options
          </label>

          <div className="flex gap-4 mb-2">
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="optionsMode"
                value="manual"
                checked={field.options_mode === "manual"}
                onChange={() =>
                  setField({
                    ...field,
                    options_mode: "manual",
                    field_options: ""
                  })
                }
              />
              Manual
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                 name="optionsMode"
          value="predefined"
                checked={field.options_mode === "predefined"}
                onChange={() =>
                  setField({
                    ...field,
                    options_mode: "predefined",
                    field_options: ""
                  })
                }
              />
              Predefined
            </label>
          </div>

          {field.options_mode === "manual" && (
            <input
              type="text"
              className={baseClasses}
              placeholder="Comma separated values"
              value={field.field_options || ""}
              onChange={(e) =>
                setField({ ...field, field_options: e.target.value })
              }
            />
          )}

          {field.options_mode === "predefined" && (
            <select
              className={baseClasses}
              value={field.field_options || ""}
              onChange={(e) =>
                setField({ ...field, field_options: e.target.value })
              }
            >
              <option value="">Select list</option>
              <option value="countries">Countries</option>
              <option value="states">States</option>
              <option value="cities">Cities</option>
            </select>
          )}

          {field.field_type === "Options" && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Option Style
              </label>
              <select
                className={baseClasses}
                value={field.is_multiple === 1 ? "checkbox" : "radio"}
                onChange={(e) =>
                  setField({
                    ...field,
                    is_multiple:
                      e.target.value === "checkbox" ? 1 : 0
                  })
                }
              >
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Required */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={Boolean(field.is_required)}
          onChange={(e) =>
  setField({ ...field, is_required: e.target.checked ? 1 : 0 })
          }
        />
        <label className="text-sm font-medium">Is Required</label>
      </div>
{/* is active */}
   <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={Boolean(field.is_active)}
          onChange={(e) =>
  setField({ ...field, is_active: e.target.checked ? 1 : 0 })
          }
        />
        <label className="text-sm font-medium">Is Active</label>
      </div>


{/* Consent */}
<div className="flex items-center gap-2 mt-2">
  <input
    type="checkbox"
    checked={Boolean(field.consent)}
    onChange={(e) =>
      setField({ ...field, consent: e.target.checked ? 1 : 0 })
    }
  />
  <label className="text-sm font-medium">
    Consent (user permission)
  </label>
</div>

      {/* Email */}
      {field.field_type === "String" && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(field.is_email)}
            onChange={(e) =>
  setField({ ...field, is_email: e.target.checked ? 1 : 0 })
            }
          />
          <label className="text-sm font-medium">Is Email</label>
        </div>
      )}

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          {isEditMode ? "Update Field" : "Save Field"}
        </button>
      </div>
    </form>
  );
};

export default CustomFieldForm;
