import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeads } from "./leadSlice";
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

// import {useModal} from "../../context/ModalContext";
import CustomButton from "../../components/ui/CustomButton";
import Loader from "../../components/ui/Loader";
// import ErrorState from "../../components/ui/ErrorState";
// import { exportCSV } from "../../utils/exportCSV";
import { TabsList, TabsTrigger, TabsContent } from "../../components/shared/tabs";
import {TabsWithUrl} from '../../utils/TabsWithUrl'
const LeadList = () => {
  const dispatch = useDispatch();
  // const {openModal,closeModal}=useModal();

  const { leads, pagination, loading, error } = useSelector(
    (state) => state.leads
  );
 
  useEffect(() => {
    dispatch(getLeads({ page: pagination.current_page }));
  }, [dispatch]);


  // ---------------- HANDLERS ----------------

  const handlePageChange = (page) => {
    dispatch(getLeads({ page }));
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
  // if(window.confirm("Are you sure you want to delete this contact?")){
  //   try {
  //     await dispatch(deleteContact(contactId)).unwrap();
  //     // optional: refresh pagination data
  //     dispatch(fetchContacts({ page: pagination.current_page }));
  //   } catch(err) {
  //     console.log("Delete failed", err);
  //   }
  // }
};

const handleExportContacts = async () => {
  // await exportCSV({
  //   dispatch,
  //   action: exportContactCsv,
  //   params: {
  //     filters: {},       // later search / status yahin aayega
  //     contactIds: [],    // selected contacts ke ids
  //   },
  //   fileName: "contacts.csv",
  //   mimeType: "text/csv",
  // });
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
    <div className="leads">
       {/* add contact model btn */}
       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Leads Management</h1>
        <p className="text-gray-600 mt-1">Track and manage your sales pipeline</p>
        </div>
        <div>
        {/* Export Button */}
        <CustomButton
          // onClick={handleExportContacts}
          variant="border"
          leftIcon={<Download className="w-4 h-4"/>}
          className="me-3"
        >
          Export
        </CustomButton>
            {/* add contact btn */}
       <CustomButton leftIcon={<UserPlus size={16}/>} variant="themePrimary"
          // onClick={()=>openModal({
          //   title:"add contact",
          //   size:"xl",
          //   content:<ContactForm closeModal={closeModal}/>,
          //  })}
          >
          Add lead
        </CustomButton>
        </div>
       
       </div>
       {/* state */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className=" rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total leads</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
              </div>
            </div>
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total leads</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total leads</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
              </div>
            </div>
            </div>

            <TabsWithUrl defaultValue="table">
        <TabsList className="flex justify-end mb-3">
          <TabsTrigger value="table">
          <Menu size={22} />
          </TabsTrigger>
          <TabsTrigger value="cards">
                    <HiOutlineViewGrid size={22}/>

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
                   Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Created    
               </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {
                        (`${lead.name ?? ""}`.trim() || "Unnamed Contact")
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("").toUpperCase() || "?"}
                      </div>
                      <div className="font-medium text-gray-900">
                        {lead.name || "Unnamed Contact"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {lead.email || "No email"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {lead.mobile || "No mobile"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {lead.lead_value || "No value"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {lead.lead_stage || "no lead stage"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {lead.lead_source || "no lead source"}

                  </td>  <td className="px-6 py-4 text-sm text-gray-900">
                    {lead.created_at || "no lead date"}
                  </td>
                  <td className="px-6 py-4">
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
            leads.map((lead)=>(
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <div className="flex justify-between">
                <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {
                        // (contact.first_name+" "+contact.last_name)
                        (`${lead.first_name ?? ""} ${lead.last_name ?? ""}`.trim() || "Unnamed Contact")
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("").toUpperCase() || "?"}
                      </div>
                     
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">                    
                     {lead.first_name+ " "+ (lead.last_name || "") || "Unnamed Contact"}
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
          <span className="text-sm text-gray-600">{lead.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{lead.mobile}</span>
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

      {leads.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No Leads found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadList;
