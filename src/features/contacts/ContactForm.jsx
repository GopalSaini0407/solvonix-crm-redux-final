import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactFields } from "./contactSlice";

const ContactForm = () => {
  const dispatch = useDispatch();
  const { fields, error, loading } = useSelector(
    (state) => state.contacts
  );

  useEffect(() => {
    if (!Object.keys(fields).length) {
      dispatch(fetchContactFields());
    }
  }, [dispatch, fields]);

  if (loading.fetch)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Loading contact fields...</p>
      </div>
    );

  if (error.fetch)
    return (
      <p className="text-red-600 text-center">{error.fetch}</p>
    );

  const renderField = (field) => {
    const options = field.field_options
      ? field.field_options.split(",").map((o) => o.trim())
      : [];

    const baseInput =
      "w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

    switch (field.field_type) {
      case "String":
        return (
          <input
            type="text"
            className={baseInput}
            placeholder={field.placeholder}
          />
        );

      case "LargeText":
        return (
          <textarea
            rows="3"
            className={baseInput}
            placeholder={field.placeholder}
          />
        );

      case "List":
        return (
          <select className={baseInput}>
            <option value="">Select</option>
            {options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "Date":
        return <input type="date" className={baseInput} />;

      case "DateTime":
        return (
          <input
            type="datetime-local"
            className={baseInput}
          />
        );

      case "Integer":
        return <input type="number" className={baseInput} />;

      case "Decimal":
        return (
          <input
            type="number"
            step="0.01"
            className={baseInput}
          />
        );

      case "File":
        return (
          <input
            type="file"
            className="w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
          />
        );

      case "Options":
        return (
          <div className="space-y-2">
            {options.map((o, i) => (
              <label
                key={i}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type={
                    field.is_multiple === 1
                      ? "checkbox"
                      : "radio"
                  }
                  name={field.field_name}
                  value={o}
                  className="text-blue-600 focus:ring-blue-500"
                />
                {o}
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Contact Form
      </h1>

      {Object.entries(fields).map(
        ([groupName, groupFields]) => (
          <div
            key={groupName}
            className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="rounded-t-xl bg-gray-100 px-4 py-2 font-semibold text-gray-700">
              {groupName}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {groupFields.map((field) => (
                <div key={field.field_name}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {field.display_text}
                    {field.is_required === 1 && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </label>

                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>
        )
      )}

      <div className="mt-6 text-right">
        <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
          Submit
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
