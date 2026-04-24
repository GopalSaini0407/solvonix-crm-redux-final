import {
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

const ViewEmployeeDetails = ({ employee, closeModal }) => {
  if (!employee) return null;

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Name" value={employee.name} />
              <InfoRow label="Email" value={employee.email} />
              <InfoRow label="Phone" value={employee.phone} />
              <InfoRow label="Role" value={employee.role} />
              <InfoRow label="Status" value={employee.status} />
              <InfoRow label="Employee ID" value={employee.id} />
              <InfoRow label="User ID" value={employee.user_id} />
              <InfoRow label="Role ID" value={employee.role_id} />
              <InfoRow label="Created At" value={new Date(employee.created_at).toLocaleDateString()} />
              <InfoRow label="Updated At" value={new Date(employee.updated_at).toLocaleDateString()} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {employee.name
                ?.split(" ")
                .map((n) => n[0])
                .join("").toUpperCase() || "?"}
            </div>
            <h3 className="font-semibold text-lg mb-1">
              {employee.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              ID: {employee.id}
            </p>
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
    </div>
  );
};

export default ViewEmployeeDetails;