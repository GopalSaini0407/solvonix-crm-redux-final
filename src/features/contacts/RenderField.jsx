const RenderField = ({ field, value, onChange }) => {
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
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "LargeText":
      return (
        <textarea
          rows="3"
          className={baseInput}
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "List":
      return (
        <select
          className={baseInput}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case "Date":
      return (
        <input
          type="date"
          className={baseInput}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "DateTime":
      return (
        <input
          type="datetime-local"
          className={baseInput}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "Integer":
      return (
        <input
          type="number"
          className={baseInput}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "Decimal":
      return (
        <input
          type="number"
          step="0.01"
          className={baseInput}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "File":
      return (
        <input
          type="file"
          className="w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => onChange(e.target.files[0])}
        />
      );

    case "Options":
      return (
        <div className="space-y-2">
          {options.map((o, i) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <input
                type={field.is_multiple === 1 ? "checkbox" : "radio"}
                checked={
                  field.is_multiple === 1
                    ? (value || []).includes(o)
                    : value === o
                }
                onChange={(e) => {
                  if (field.is_multiple === 1) {
                    const prev = value || [];
                    onChange(
                      e.target.checked
                        ? [...prev, o]
                        : prev.filter((v) => v !== o)
                    );
                  } else {
                    onChange(o);
                  }
                }}
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

export default RenderField;
