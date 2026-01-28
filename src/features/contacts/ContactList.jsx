import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts,deleteContact,exportContactCsv } from "./contactSlice";
import {
  Eye,
  Phone,
  Mail,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  UserPlus,
  Download,
  Pencil
} from "lucide-react";
import ContactForm from './ContactForm'
import {useModal} from "../../context/ModalContext";
import CustomButton from "../../components/ui/CustomButton";
import Loader from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import ViewContactDetails from "./ViewContactDetails";
import { exportCSV } from "../../utils/exportCSV";
const ContactList = () => {
  const dispatch = useDispatch();
  const {openModal,closeModal}=useModal();

  const { contacts, pagination, loading, error } = useSelector(
    (state) => state.contacts
  );

  useEffect(() => {
    dispatch(fetchContacts({ page: pagination.current_page }));
  }, [dispatch]);

  // useEffect(() => {
  //   console.log("CONTACT LIST DATA:", contacts);
  // }, [contacts]);
  

  // ---------------- HANDLERS ----------------

  const handlePageChange = (page) => {
    dispatch(fetchContacts({ page }));
  };

  const handleContactClick = (contact) => {
    console.log("View contact", contact);
  };

  const handleCall = (contact) => {
    console.log("Call", contact.mobile);
  };

  const handleEmail = (contact) => {
    console.log("Email", contact.email);
  };

  const handleDeleteContact = async (contactId) => {
  if(window.confirm("Are you sure you want to delete this contact?")){
    try {
      await dispatch(deleteContact(contactId)).unwrap();
      // optional: refresh pagination data
      dispatch(fetchContacts({ page: pagination.current_page }));
    } catch(err) {
      console.log("Delete failed", err);
    }
  }
};

const handleExportContacts = async () => {
  await exportCSV({
    dispatch,
    action: exportContactCsv,
    params: {
      filters: {},       // later search / status yahin aayega
      contactIds: [],    // selected contacts ke ids
    },
    fileName: "contacts.csv",
    mimeType: "text/csv",
  });
};



  // ---------------- UI ----------------

  if (loading.fetch){
     return ( <Loader text="Contacts loading..." size="lg"/> )
  } 

// 🔹 Error
if (error.fetch) {
  console.log(error);
}

  return (
    <div className="sm:flex-1 w-full">
       {/* add contact model btn */}
       <div className="flex justify-end m-3">
         {/* Export Button */}
         <CustomButton
          onClick={handleExportContacts}
          variant="border"
          leftIcon={<Download className="w-4 h-4"/>}
          className="me-3"
        >
          Export
        </CustomButton>

       <CustomButton leftIcon={<UserPlus size={16}/>} variant="themePrimary"
          onClick={()=>openModal({
            title:"add contact",
            size:"xl",
            content:<ContactForm closeModal={closeModal}/>,
           })}
          >
          Add contact
        </CustomButton>
       </div>
      

       {/* add contact model btn close */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {
                        // (contact.first_name+" "+contact.last_name)
                        (`${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim() || "Unnamed Contact")
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("").toUpperCase() || "?"}
                      </div>
                      <div className="font-medium text-gray-900">
                        {contact.first_name+ " "+ (contact.last_name || "") || "Unnamed Contact"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {contact.email || "No email"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {contact.mobile || "No mobile"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {contact.id}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                     
                      {/* view contact details */}
                      <button
                        onClick={()=>openModal({
                          title:"View Contact Details",
                          size:"xl",
                          content:<ViewContactDetails contact={contact} closeModal={closeModal}/>,
                         })}

                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 p-1 rounded-lg cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
               

             {/* edit */}
                       <button
                       onClick={()=>openModal({
                        title:"Update Contact",
                        size:"xl",
                        content:<ContactForm editContact={contact} closeModal={closeModal}/>,
                       })}
                    className="p-1 rounded-lg hover:bg-blue-100 text-blue-600 cursor-pointer">
                    <Pencil size={16} />
                  </button>


                      <button
                        onClick={() => handleCall(contact)}
                        className="text-green-600 hover:text-green-700 p-1"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleEmail(contact)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-400 hover:text-red-600 p-1 cursor-pointer rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page{" "}
            <span className="font-medium">
              {pagination.current_page}
            </span>{" "}
            of{" "}
            <span className="font-medium">
              {pagination.last_page}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() =>
                handlePageChange(pagination.current_page - 1)
              }
              disabled={pagination.current_page === 1}
              className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {/* page number */}

            <div className="flex space-x-1">
              {
                Array.from(
                  {
                    length:pagination.last_page
                  },
                  (_,i)=>i+1
                ).map((page)=>
                  (
                  <button key={page}
                  onClick={()=>handlePageChange(page)}
                  className={`px-3 py-1 rounded-md text-sm font-medium border
                    ${
                      pagination.current_page===page ?
                      "bg-blue-600 text-white border-blue-600"
                      :"border-grey-300 text-gray-700 hover:bg-gray-50"
                    }
                    `}
                  >
                       {page}
                  </button>
                ))
              }
            </div>



            <button
              onClick={() =>
                handlePageChange(pagination.current_page + 1)
              }
              disabled={
                pagination.current_page === pagination.last_page
              }
              className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No contacts found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactList;
