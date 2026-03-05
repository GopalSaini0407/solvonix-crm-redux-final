import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
getLeads,
createLead,
updateLead,
deleteLead,
getLeadFields,
setFieldValue,
resetFieldValues,
} from "./leadSlice";
import RenderField from "./RenderField";
import { fetchContacts } from "../contacts/contactSlice";
const LeadForm = ({ editLead = null, closeModal }) => {
const dispatch = useDispatch();
const { fields, fieldValues, pagination, loading, error } =
useSelector((state) => state.leads);
const { contacts } = useSelector((state) => state.contacts);
/* ===============================
FETCH CONTACTS
=============================== */
useEffect(() => {
dispatch(fetchContacts({ page: 1 }));
}, [dispatch]);
/* ===============================
FETCH LEAD FIELDS
=============================== */
useEffect(() => {
if (!Object.keys(fields || {}).length) {
dispatch(getLeadFields());
}
}, [dispatch, fields]);
/* ===============================
PREFILL EDIT DATA
=============================== */
useEffect(() => {
if (editLead) {
Object.entries(editLead).forEach(([key, value]) => {
dispatch(setFieldValue({ fieldName: key, value }));
});
} else {
dispatch(resetFieldValues());
}
}, [editLead, dispatch]);
/* ===============================
HANDLE CHANGE
=============================== */
const handleChange = (field, value) => {
dispatch(
setFieldValue({
fieldName: field.field_name,
value,
})
);
};
/* ===============================
CLEAN PAYLOAD BUILDER
=============================== */
const buildPayload = (values) => {
const payload = {};
Object.entries(values).forEach(([key, value]) => {
if (
value !== null &&
value !== undefined &&
!(typeof value === "string" && value.trim() === "") &&
!(Array.isArray(value) && value.length === 0)
) {
payload[key] = value;
}
});
return payload;
};
/* ===============================
SUBMIT HANDLER
=============================== */
const handleSubmit = async () => {
// 1️⃣ Build clean payload
const rawPayload = buildPayload(fieldValues);
// 2️⃣ Fix key name (contacts → contact_id)
const payload = {
...rawPayload,
contact_id: rawPayload.contacts ?? rawPayload.contact_id,
};
// 3️⃣ Remove wrong key if exists
delete payload.contacts;
// 4️⃣ Debug logs
console.log("===== RAW FIELD VALUES =====");
console.log(fieldValues);
console.log("===== FIXED FINAL PAYLOAD =====");
console.log(payload);
try {
if (editLead) {
console.log("Updating Lead With:", {
leadId: editLead.id,
leadData: payload,
});
await dispatch(
updateLead({
leadId: editLead.id,
leadData: payload,
})
).unwrap();
} else {
console.log("Creating Lead With:", payload);
await dispatch(createLead(payload)).unwrap();
}
dispatch(getLeads({ page: pagination?.current_page || 1 }));
closeModal();
} catch (err) {
console.log("Save failed", err);
}
};
/* ===============================
OPTION PARSER
=============================== */
const parseOptions = (optionsString) => {
if (!optionsString) return [];
if (["countries", "states", "genders"].includes(optionsString)) {
const predefinedLists = {
countries: [
"United States",
"Canada",
"UK",
"Australia",
"Germany",
"France",
"Japan",
"India",
"Brazil",
"Mexico",
],
states: [
"California",
"Texas",
"New York",
"Florida",
"Illinois",
"Pennsylvania",
"Ohio",
"Georgia",
"North Carolina",
"Michigan",
],
genders: ["Male", "Female", "Non-binary", "Prefer not to say"],
};
return predefinedLists[optionsString].map((v) => ({
label: v,
value: v,
}));
}
if (optionsString === "contacts") {
return contacts.map((c) => ({
label:
c.name ||
`${c.firstName ?? ""} ${c.lastName ?? ""}`.trim(),
value: c.id,
}));
}
return optionsString.split(",").map((v) => ({
label: v.trim(),
value: v.trim(),
}));
};
if (loading?.fetchFields) return 
<p>Loading...</p>
;
return (
<div className="max-w-4xl mx-auto p-6">
   {(error?.create || error?.update) && (
   <div className="mb-4 bg-red-50 p-2 text-red-700 rounded">
      {error.create || error.update}
   </div>
   )}
   {Object.entries(fields || {}).map(([group, groupFields]) => {
   const sortedFields = [...groupFields].sort(
   (a, b) => (a.priority ?? 999) - (b.priority ?? 999)
   );
   return (
   <div key={group} className="mb-6 border border-gray-200 rounded">
      <div className="bg-gray-100 px-4 py-2 font-semibold">
         {group}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
         {sortedFields.map((field) => (
         <div key={field.field_name}>
            <label className="text-sm font-medium">
            {field.display_text}
            {field.is_required === 1 && (
            <span className="text-red-500">*</span>
            )}
            </label>
            <RenderField
               field={field}
               value={fieldValues[field.field_name]}
               onChange={(value) =>
            handleChange(field, value)
            }
            fieldOptions={parseOptions(field.field_options)}
            />
         </div>
         ))}
      </div>
   </div>
   );
   })}
   <div className="text-right">
      <button
      onClick={handleSubmit}
      disabled={loading?.create || loading?.update}
      className="bg-blue-600 text-white px-6 py-2 rounded"
      >
      {editLead
      ? loading?.update
      ? "Updating..."
      : "Update"
      : loading?.create
      ? "Saving..."
      : "Submit"}
      </button>
   </div>
</div>
);
};
export default LeadForm;
