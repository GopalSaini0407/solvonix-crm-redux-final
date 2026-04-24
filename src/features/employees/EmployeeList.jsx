import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, deleteEmployee } from "./employeeSlice";
import {
  Eye,
  Phone,
  Mail,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  UserPlus,
  Pencil,
  Edit,
  Key,
  Menu,
} from "lucide-react";
import { HiOutlineViewGrid } from "react-icons/hi";
import EmployeeForm from './EmployeeForm'
import PasswordChangeForm from './PasswordChangeForm';
import { useModal } from "../../context/ModalContext";
import CustomButton from "../../components/ui/CustomButton";
import Loader from "../../components/ui/Loader";
import ViewEmployeeDetails from "./ViewEmployeeDetails";
import { TabsList, TabsTrigger, TabsContent } from "../../components/shared/tabs";
import { TabsWithUrl } from '../../utils/TabsWithUrl'

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { employees, pagination, loading, error } = useSelector(
    (state) => state.employees
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(
        fetchEmployees({
          page: currentPage,
          search,
          start_date: startDate,
          end_date: endDate,
        })
      );
    }, 500) // debounce
    return () => clearTimeout(delay);
  }, [dispatch, currentPage, search, startDate, endDate]);

  // Reset to page 1 when search or dates change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, startDate, endDate]);

  // ---------------- HANDLERS ----------------
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEmployeeClick = (employee) => {
    console.log("View employee", employee);
  };

  const handleCall = (employee) => {
    console.log("Call", employee.phone);
  };

  const handleEmail = (employee) => {
    console.log("Email", employee.email);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await dispatch(deleteEmployee(employeeId)).unwrap();
        // optional: refresh pagination data
        dispatch(fetchEmployees({ page: currentPage, search, start_date: startDate, end_date: endDate }));
      } catch (err) {
        console.log("Delete failed", err);
      }
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchLower = search.trim().toLowerCase();
    const fullName = (employee?.name || "").toLowerCase();
    const email = (employee?.email || "").toLowerCase();
    const phone = (employee?.phone || "").toString().replace(/[^0-9]/g, "");
    const searchDigits = search.replace(/[^0-9]/g, "");

    return (
      !searchLower ||
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      (searchDigits.length > 0 && phone.includes(searchDigits))
    );
  });

  // ---------------- UI ----------------
  if (loading.fetch) {
    return (
      <Loader text="Employees loading..." size="lg" />
    )
  }

  // 🔹 Error
  if (error.fetch) {
    console.log(error);
  }

  return (
    <div className="employee">
      {/* add employee model btn */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your team members</p>
        </div>
        <div>
          {/* add employee btn */}
          <CustomButton leftIcon={
            <UserPlus size={16} />
          } variant="themePrimary"
            onClick={() => openModal({
              title: "add employee",
              size: "xl",
              content:
                <EmployeeForm closeModal={closeModal} />
              ,
            })}
          >
            Add employee
          </CustomButton>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className=" rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.filter(e => e.is_active == 1).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Inactive Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.filter(e => e.is_active == 0).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* filter */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex gap-3">
        <div>
          <input
            type="text"
            placeholder="Enter mobile, email or name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="border border-gray-300 px-3 py-1 rounded outline-0"
          />
        </div>
        <div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 px-3 py-1 rounded outline-0 me-3"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 px-3 py-1 rounded outline-0"
          />
        </div>

      </div>

      <TabsWithUrl defaultValue="table">
        <TabsList className="flex justify-end mb-3">
          <TabsTrigger value="table">
            <HiOutlineViewGrid size={22} />
          </TabsTrigger>
          <TabsTrigger value="cards">
            <Menu size={22} />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          {/* employee table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Employee Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.is_active == 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.is_active == 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal({
                              title: "view employee",
                              size: "xl",
                              content: <ViewEmployeeDetails employee={employee} closeModal={closeModal} />
                            })}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openModal({
                              title: "edit employee",
                              size: "xl",
                              content: <EmployeeForm editEmployee={employee} closeModal={closeModal} />
                            })}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openModal({
                              title: "change password",
                              size: "xl",
                              content: <PasswordChangeForm employee={employee} closeModal={closeModal} />
                            })}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            <Key className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
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
          {/* employee cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.role}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {employee.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {employee.phone}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.is_active == 1
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.is_active == 1 ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal({
                        title: "view employee",
                        size: "xl",
                        content: <ViewEmployeeDetails employee={employee} closeModal={closeModal} />
                      })}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openModal({
                        title: "edit employee",
                        size: "xl",
                        content: <EmployeeForm editEmployee={employee} closeModal={closeModal} />
                      })}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openModal({
                        title: "change password",
                        size: "xl",
                        content: <PasswordChangeForm employee={employee} closeModal={closeModal} />
                      })}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      <Key className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </TabsWithUrl>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {pagination.from} to {pagination.to} of {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
              Page {currentPage} of {pagination.last_page}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.last_page}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;