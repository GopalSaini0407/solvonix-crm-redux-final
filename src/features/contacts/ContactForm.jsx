import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContactFields,
  setFieldValue,
  addContact,
  updateContact,
  fetchContacts,
  resetFieldValues,
} from "./contactSlice";
import RenderField from "./RenderField";

const ContactForm = ({  editContact = null,closeModal }) => {
  const dispatch = useDispatch();

  const { fields, fieldValues,pagination, loading, error } = useSelector(
    (state) => state.contacts
  );

  // Fetch fields
  useEffect(() => {
    if (!Object.keys(fields).length) {
      dispatch(fetchContactFields());
    }
  }, [dispatch, fields]);

  // Prefill for edit
  useEffect(() => {
    if (editContact) {
      Object.entries(editContact).forEach(([key, value]) => {
        dispatch(setFieldValue({ fieldName: key, value }));
      });
    } else {
      dispatch(resetFieldValues());
    }
  }, [editContact, dispatch]);

  const handleChange = (field, value) => {
    dispatch(
      setFieldValue({
        fieldName: field.field_name,
        value,
      })
    );
  };

  const buildPayload = (values) => {
    const payload = {};
    Object.entries(values).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        payload[key] = value;
      }
    });
    return payload;
  };

  const handleSubmit = async () => {
    const payload = buildPayload(fieldValues);

    try {
      if (editContact) {
        await dispatch(
          updateContact({
            contactId: editContact.id,
            contactData: payload,
          })
        ).unwrap();
      } else {
        await dispatch(addContact(payload)).unwrap();
      }

      dispatch(fetchContacts({ page: pagination.current_page }));
      closeModal();
    } catch (err) {
      console.log("Save failed", err);
    }
  };

  if (loading.fetch) return <p>Loading...</p>;
 
 
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* <h2 className="text-xl font-bold mb-4">
        {editContact ? "Update Contact" : "Add Contact"}
      </h2> */}

      {(error.create || error.update) && (
        <div className="mb-4 bg-red-50 p-2 text-red-700 rounded">
          {error.create || error.update}
        </div>
      )}

      {Object.entries(fields || {}).map(([group, groupFields]) => (
        <div key={group} className="mb-6 border border-gray-200 rounded">
          <div className="bg-gray-100 px-4 py-2 font-semibold">{group}</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {groupFields.filter((field)=>{
              
              if(!editContact) return true;

              const value=editContact[field.field_name];

              return(
                value!==null && 
                value!==undefined &&
                value!=="" &&
                !(Array.isArray(value) && value.length===0)
              );

            }).map((field) => (
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
                  onChange={(value) => handleChange(field, value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-right">
        <button
          onClick={handleSubmit}
          disabled={loading.create || loading.update}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {editContact
            ? loading.update
              ? "Updating..."
              : "Update"
            : loading.create
            ? "Saving..."
            : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
