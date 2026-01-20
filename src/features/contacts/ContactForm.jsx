import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactFields,setFieldValue,addContact,fetchContacts } from "./contactSlice";
import RenderField from "./RenderField";
const ContactForm = ({closeModal}) => {
  const dispatch = useDispatch();

  const { fields,fieldValues, error, loading } = useSelector(
    (state) => state.contacts
  );


const handleChange=(field,value)=>{
  dispatch(setFieldValue({
    fieldName:field.field_name,
    value,
  }))
}


const buildPayload=(value)=>{
  const payload={};

  Object.entries(value).forEach(([key,value])=>{
    if(
      value !=="" &&
      value!==null &&
      value !==undefined &&
      !(Array.isArray(value) && value.length===0)
    ){
      payload[key]=value;
    }
  })
  return payload;
}

const handleSubmit= async()=>{
  const payload=buildPayload(fieldValues);

  try{
    await dispatch(addContact(payload)).unwrap();
    dispatch(fetchContacts());

    closeModal();
  }catch(err){
     console.log("add contact failed",err);
  }
}


  useEffect(() => {
    if (!Object.keys(fields).length) {
      dispatch(fetchContactFields());
    }
  }, [dispatch, fields]);


  // useEffect(() => {
  //   console.log("FORM DATA:", fieldValues);
  // }, [fieldValues]);
  
  // if (error.create)
  //   return (
  //     <p className="text-red-600 text-center">{error.create}</p>
  //   );

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

  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Contact Form
      </h1>

 {error?.create && (
  <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-red-700">
    {typeof error.create === "string"
      ? error.create
      : error.create.message}
  </div>
)}

      {Object.entries(fields || {}).map(
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
                  <RenderField
                     field={field}
                     value={fieldValues[field.field_name]}
                     onChange={(value) => handleChange(field, value)}
                      />
                </div>
              ))}
            </div>
          </div>
        )
      )}

      <div className="mt-6 text-right">
        <button onClick={handleSubmit}
        disabled={loading.create}
        className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
          {loading.create ? "Saving...":"Submit"}
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
