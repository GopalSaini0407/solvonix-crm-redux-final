import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEmployee, fetchEmployees } from "./employeeSlice";

const PasswordChangeForm = ({ employee, closeModal }) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { pagination, loading, error } = useSelector((state) => state.employees);

  const buildPayload = () => {
    const payload = {
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      role_id: employee.role_id || "",
      is_active: employee.is_active != null ? employee.is_active : "",
    };

    if (password) payload.password = password;
    if (passwordConfirmation) payload.password_confirmation = passwordConfirmation;

    return payload;
  };

  const handleSubmit = async () => {
    try {
      await dispatch(
        updateEmployee({
          employeeId: employee.id,
          data: buildPayload(),
        })
      ).unwrap();
      dispatch(fetchEmployees({ page: pagination?.current_page || 1 }));
      closeModal();
    } catch (err) {
      console.log("Password change failed", err);
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

  const formError = getErrorText(error?.update);

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
            New Password
          </label>
          <input
            type="password"
            className={baseInput}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            className={baseInput}
            placeholder="Confirm new password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>
      </div>
      <div className="text-right mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading?.update}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading?.update ? "Saving..." : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
