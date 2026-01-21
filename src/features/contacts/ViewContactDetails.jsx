import {
    X,
    History,
    Phone,
    Mail,
    Calendar,
    Trash2,
  } from "lucide-react";
  import ContactActivityLog from "./ContactActivityLog";
  
  const ViewContactDetails = ({ contact, onClose }) => {
    if (!contact) return null;
  
    const fullName = `${contact.salutation || ""} ${contact.first_name || ""} ${contact.last_name || ""}`;
  
    const InfoRow = ({ label, value }) => {
      if (!value) return null;
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
            {value}
          </div>
        </div>
      );
    };
  
    return (
     <> 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Salutation" value={contact.salutation} />
                <InfoRow label="First Name" value={contact.first_name} />
                <InfoRow label="Last Name" value={contact.last_name} />
                <InfoRow label="Email" value={contact.email} />
                <InfoRow
                  label="Mobile"
                  value={
                    contact.mobile
                      ? `${contact.country_code || ""} ${contact.mobile}`
                      : null
                  }
                />
                <InfoRow label="Contact ID" value={contact.id} />
              </div>
            </div>
  
            {/* Activity Log */}
            {/* <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">
                  Activity Log
                </h3>
              </div>
  
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  No activity logs found for this contact
                </p>
              </div>
            </div> */}
         <ContactActivityLog contactId={contact.id} limit={3}/>

          </div>
  
          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {
                        // (contact.first_name+" "+contact.last_name)
                        (`${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim() || "Unnamed Contact")
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("").toUpperCase() || "?"}
              </div>
              <h3 className="font-semibold text-lg mb-1">
                {fullName}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                ID: {contact.id}
              </p>
  
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2 justify-center">
                <History className="w-4 h-4 text-gray-500" />
                <div>
                <ContactActivityLog contactId={contact.id} limit={1}/>

                </div>
              </div>
            </div>
  
            {/* Quick Actions */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">
                Quick Actions
              </h4>
  
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                  <Phone className="w-4 h-4" /> Call
                </button>
  
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                  <Mail className="w-4 h-4" /> Email
                </button>
  
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
                  <Calendar className="w-4 h-4" /> Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
  
     </>
    );
  };
  
  export default ViewContactDetails;
  