import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addEmployee,
  updateEmployee,
  fetchEmployees,
} from "./employeeSlice";

const EmployeeForm = ({  editEmployee = null,closeModal }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role_id: "",
    is_active: "",
    password: "",
    password_confirmation: "",
  });

  const { pagination, loading, error } = useSelector(
    (state) => state.employees
  );

  // Prefill for edit
  useEffect(() => {
    if (editEmployee) {
      setFormData({
        name: editEmployee.name || "",
        email: editEmployee.email || "",
        phone: editEmployee.phone || "",
        role_id: editEmployee.role_id ? String(editEmployee.role_id) : "",
        is_active: editEmployee.is_active != null ? String(editEmployee.is_active) : "",
        password: "",
        password_confirmation: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role_id: "",
        is_active: "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [editEmployee]);

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
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
        if (key === "role_id" || key === "is_active") {
          payload[key] = Number(value);
        } else {
          payload[key] = value;
        }
      }
    });
    return payload;
  };

  const handleSubmit = async () => {
    const payload = buildPayload(formData);
    try {
      if (editEmployee) {
        await dispatch(
          updateEmployee({
            employeeId: editEmployee.id,
            data: payload,
          })
        ).unwrap();
      } else {
        await dispatch(addEmployee(payload)).unwrap();
      }

      dispatch(fetchEmployees({ page: pagination?.current_page || 1 }));
      closeModal();
    } catch (err) {
      console.log("Save failed", err);
    }
  };

  const getErrorText = (err) => {
    if (!err) return "";
    if (typeof err === "string") return err;
    if (Array.isArray(err)) return err.join(", ");
    if (err.message) return err.message;
    if (err.errors) {
      const messages = Object.values(err.errors).flat();
      return messages.join(", ");
    }
    return JSON.stringify(err);
  };

  const formError = getErrorText(error?.create || error?.update);

  const baseInput =
    "w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-4xl mx-auto p-6">
      {formError && (
        <div className="mb-4 bg-red-50 p-2 text-red-700 rounded">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            className={baseInput}
            placeholder="Enter employee name"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            className={baseInput}
            placeholder="Enter email address"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            className={baseInput}
            placeholder="Enter phone number"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            className={baseInput}
            value={formData.role_id || ""}
            onChange={(e) => handleChange("role_id", e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="1">Admin</option>
            <option value="2">Manager</option>
            <option value="3">Sales</option>
            <option value="4">User</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className={baseInput}
            value={formData.is_active || ""}
            onChange={(e) => handleChange("is_active", e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        {!editEmployee && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className={baseInput}
                placeholder="Enter password"
                value={formData.password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className={baseInput}
                placeholder="Confirm password"
                value={formData.password_confirmation || ""}
                onChange={(e) => handleChange("password_confirmation", e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="text-right mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading?.create || loading?.update}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {editEmployee
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

export default EmployeeForm;