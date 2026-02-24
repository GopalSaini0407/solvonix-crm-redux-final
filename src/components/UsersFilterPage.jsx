import React, { useState } from "react";

const dummyUsers = [
  { id: 1, name: "Vivek", age: 22, role: "Admin", status: "active", date: "2026-02-01" },
  { id: 2, name: "Rahul", age: 30, role: "User", status: "inactive", date: "2026-02-10" },
  { id: 3, name: "Amit", age: 25, role: "Manager", status: "active", date: "2026-02-15" },
  { id: 4, name: "Suresh", age: 28, role: "User", status: "active", date: "2026-01-20" },
  { id: 5, name: "Ankit", age: 35, role: "Admin", status: "inactive", date: "2026-02-18" },
  { id: 6, name: "Priya", age: 27, role: "Manager", status: "active", date: "2026-02-05" },
  { id: 7, name: "Neha", age: 24, role: "User", status: "active", date: "2026-01-28" },
  { id: 8, name: "Rohit", age: 32, role: "Admin", status: "inactive", date: "2026-02-12" },
  { id: 9, name: "Karan", age: 29, role: "User", status: "active", date: "2026-02-20" },
  { id: 10, name: "Simran", age: 26, role: "Manager", status: "inactive", date: "2026-02-08" },
];

function UsersFilterPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [minAge, setMinAge] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");



  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">User Filter Dashboard</h2>


        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Age</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.age}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          user.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3">{user.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-5 text-gray-500">
                    No Users Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default UsersFilterPage;