import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCustomField, fetchCustomField } from "./customFieldSlice";

const CustomFieldForm = ({ fieldData }) => {
  const dispatch = useDispatch();

  // UI + data state
  const [field, setField] = useState({
    options_mode: "manual", // UI ONLY
    is_multiple: 0,
    ...fieldData
  });

  const baseClasses =
    "p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none";

  const addHandler = async (e) => {
    e.preventDefault();

    // 🔹 Build API payload
    let payload = { ...field };

    // Handle options fields
    if (payload.field_type === "List" || payload.field_type === "Options") {
      if (payload.options_mode === "manual") {
        payload.field_options = payload.field_options
          ?.split(",")
          .map((o) => o.trim())
          .filter(Boolean);
      }
      // predefined → field_options already string (countries / states / cities)
    }

    // 🚨 Remove UI-only keys
    delete payload.options_mode;

    try {
      await dispatch(addCustomField(payload)).unwrap();
      dispatch(fetchCustomField());
      alert("Added successfully");
    } catch (err) {
      alert(err?.message || "Failed to add custom field");
    }
  };

  return (
    <form
      onSubmit={addHandler}
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
            setField({ ...field, priority: e.target.value })
          }
        />
      </div>

      {/* Options (only for List / Options) */}
      {(field.field_type === "List" || field.field_type === "Options") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Options
          </label>

          {/* Mode */}
          <div className="flex gap-4 mb-2">
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                checked={field.options_mode === "manual"}
                onChange={() =>
                  setField({ ...field, options_mode: "manual", field_options: "" })
                }
              />
              Manual
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
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

          {/* Manual */}
          {field.options_mode === "manual" && (
            <input
              type="text"
              className={baseClasses}
              placeholder="Enter options (comma separated)"
              value={field.field_options || ""}
              onChange={(e) =>
                setField({ ...field, field_options: e.target.value })
              }
            />
          )}

          {/* Predefined */}
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

          {/* Option Style */}
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
                    is_multiple: e.target.value === "checkbox" ? 1 : 0
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
          checked={field.is_required || false}
          onChange={(e) =>
            setField({ ...field, is_required: e.target.checked })
          }
        />
        <label className="text-sm font-medium">Is Required</label>
      </div>

      {/* Email */}
      {field.field_type === "String" && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={field.is_email || false}
            onChange={(e) =>
              setField({ ...field, is_email: e.target.checked })
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
          Save Field
        </button>
      </div>
    </form>
  );
};

export default CustomFieldForm;
