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
  Pencil,
  Building2,MoreVertical,Edit,Menu
} from "lucide-react";
import { HiOutlineViewGrid } from "react-icons/hi";

import ContactForm from './ContactForm'
import {useModal} from "../../context/ModalContext";
import CustomButton from "../../components/ui/CustomButton";
import Loader from "../../components/ui/Loader";
// import ErrorState from "../../components/ui/ErrorState";
import ViewContactDetails from "./ViewContactDetails";
import { exportCSV } from "../../utils/exportCSV";
import { TabsList, TabsTrigger, TabsContent } from "../../components/shared/tabs";
import {TabsWithUrl} from '../../utils/TabsWithUrl'
const ContactList = () => {
  const dispatch = useDispatch();
  const {openModal,closeModal}=useModal();

  const { contacts, pagination, loading, error } = useSelector(
    (state) => state.contacts
  );
 
  useEffect(() => {
    dispatch(fetchContacts({ page: pagination.current_page }));
  }, [dispatch]);


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
    <div className="contact">
       {/* add contact model btn */}
       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Contacts</h1>
        <p className="text-gray-600 mt-1">Manage your business relationships</p>
        </div>
        <div>
        {/* Export Button */}
        <CustomButton
          onClick={handleExportContacts}
          variant="border"
          leftIcon={<Download className="w-4 h-4"/>}
          className="me-3"
        >
          Export
        </CustomButton>
            {/* add contact btn */}
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
       
       </div>
       {/* state */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className=" rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
              </div>
            </div>
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
              </div>
            </div>
            </div>

            <TabsWithUrl defaultValue="table">
        <TabsList className="flex justify-end mb-3">
          <TabsTrigger value="table">
                    <HiOutlineViewGrid size={22}/>
          </TabsTrigger>
          <TabsTrigger value="cards">
                    <Menu size={22} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          {/* contact table */}
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

       
      </div>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-4 gap-4">
          {
            contacts.map((contact)=>(
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <div className="flex justify-between">
                <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {
                        // (contact.first_name+" "+contact.last_name)
                        (`${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim() || "Unnamed Contact")
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("").toUpperCase() || "?"}
                      </div>
                     
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">                    
                     {contact.first_name+ " "+ (contact.last_name || "") || "Unnamed Contact"}
                    </h3>
                  </div>
                </div>
                <div className="relative group">
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-6 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <button
                onClick={""}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button
                onClick={""}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={""}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
            </div>
              </div>

                <div className="mt-1">
                <div className="flex items-center space-x-2 mb-1">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{contact.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{contact.mobile}</span>
        </div>
                </div>
              </div>
            </div>
            ))
          }
      
          </div>
      
    
        </TabsContent>
      </TabsWithUrl>

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
