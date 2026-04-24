import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/ui/CustomButton";
import { fetchContacts } from "../contacts/contactSlice";
import { fetchEmployees } from "../employees/employeeSlice";
import { getLeads } from "../leads/leadSlice";
import {
  fetchOpportunityStage,
  selectActiveOpportunityStages,
} from "../opportunityStage/opportunityStageSlice";
import {
  createOpportunity,
  getOpportunities,
  updateOpportunity,
} from "./opportunitySlice";

const defaultFormState = {
  name: "",
  description: "",
  contact_id: "",
  lead_id: "",
  stage_id: "",
  value: "",
  currency: "USD",
  expected_close_date: "",
  probability: 50,
  assigned_to: "",
  status: "open",
  is_active: 1,
};

const OpportunityForm = ({ editOpportunity = null, closeModal }) => {
  const dispatch = useDispatch();

  const { contacts } = useSelector((state) => state.contacts);
  const { employees } = useSelector((state) => state.employees);
  const { leads, pagination: leadPagination } = useSelector((state) => state.leads);
  const { pagination, loading, error } = useSelector((state) => state.opportunities);
  const stages = useSelector(selectActiveOpportunityStages);

  const [formData, setFormData] = useState(defaultFormState);

  useEffect(() => {
    dispatch(fetchContacts({ page: 1, search: "" }));
    dispatch(fetchEmployees({ page: 1, search: "" }));
    dispatch(fetchOpportunityStage());

    if (!leads?.length) {
      dispatch(getLeads({ page: 1, search: "" }));
    }
  }, [dispatch, leads?.length]);

  useEffect(() => {
    if (editOpportunity) {
      setFormData({
        name: editOpportunity.name ?? "",
        description: editOpportunity.description ?? "",
        contact_id: editOpportunity.contact_id ?? "",
        lead_id: editOpportunity.lead_id ?? "",
        stage_id:
          editOpportunity.stage_id ??
          editOpportunity.stage?.id ??
          "",
        value: editOpportunity.value ?? "",
        currency: editOpportunity.currency ?? "USD",
        expected_close_date: editOpportunity.expected_close_date ?? "",
        probability: editOpportunity.probability ?? 50,
        assigned_to:
          editOpportunity.assigned_to ??
          editOpportunity.assigned_user?.id ??
          "",
        status: editOpportunity.status ?? "open",
        is_active: Number(editOpportunity.is_active ?? 1),
      });
    } else {
      setFormData(defaultFormState);
    }
  }, [editOpportunity]);

  const leadsOptions = useMemo(() => {
    return (leads || []).map((lead) => ({
      id: lead.id,
      label:
        lead.name ||
        lead.email ||
        lead.phone ||
        `Lead #${lead.id}`,
    }));
  }, [leads]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : value,
    }));
  };

  const buildPayload = () => ({
    name: formData.name.trim(),
    description: formData.description.trim(),
    contact_id: formData.contact_id ? Number(formData.contact_id) : null,
    lead_id: formData.lead_id ? Number(formData.lead_id) : null,
    stage_id: formData.stage_id ? Number(formData.stage_id) : null,
    value: formData.value === "" ? null : Number(formData.value),
    currency: formData.currency,
    expected_close_date: formData.expected_close_date || null,
    probability:
      formData.probability === "" ? null : Number(formData.probability),
    assigned_to: formData.assigned_to ? Number(formData.assigned_to) : null,
    status: formData.status,
    is_active: Number(formData.is_active ?? 1),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Opportunity name is required");
      return;
    }

    if (!formData.stage_id) {
      alert("Opportunity stage is required");
      return;
    }

    const payload = buildPayload();

    try {
      if (editOpportunity?.id) {
        await dispatch(
          updateOpportunity({
            opportunityId: editOpportunity.id,
            data: payload,
          })
        ).unwrap();
      } else {
        await dispatch(createOpportunity(payload)).unwrap();
      }

      dispatch(
        getOpportunities({
          page: pagination?.current_page || 1,
          search: "",
          stage_id: "",
          status: "",
          is_active: "",
        })
      );
      closeModal();
    } catch (err) {
      console.log("Opportunity save failed", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {editOpportunity ? "Update Opportunity" : "Add Opportunity"}
      </h2>

      {(error?.create || error?.update) && (
        <div className="mb-4 bg-red-50 p-3 text-red-700 rounded border border-red-200">
          {error?.create?.message ||
            error?.update?.message ||
            error?.create ||
            error?.update}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opportunity Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter opportunity name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter description"
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact
          </label>
          <select
            name="contact_id"
            value={formData.contact_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select contact</option>
            {(contacts || []).map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name ||
                  `${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim() ||
                  `Contact #${contact.id}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lead
          </label>
          <select
            name="lead_id"
            value={formData.lead_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select lead</option>
            {leadsOptions.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.label}
              </option>
            ))}
          </select>
          {leadPagination?.total > leadsOptions.length && (
            <p className="text-xs text-gray-500 mt-1">
              Showing first {leadsOptions.length} leads from page 1.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stage <span className="text-red-500">*</span>
          </label>
          <select
            name="stage_id"
            value={formData.stage_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select stage</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.stage_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assigned To
          </label>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select employee</option>
            {(employees || []).map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name || employee.email || `Employee #${employee.id}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value
          </label>
          <input
            type="number"
            min="0"
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder="50000"
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Close Date
          </label>
          <input
            type="date"
            name="expected_close_date"
            value={formData.expected_close_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Probability (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            name="probability"
            value={formData.probability}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="open">Open</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="hold">Hold</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="opportunity_is_active"
            type="checkbox"
            name="is_active"
            checked={Number(formData.is_active) === 1}
            onChange={handleChange}
          />
          <label htmlFor="opportunity_is_active" className="text-sm text-gray-700">
            Active
          </label>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <CustomButton
            type="submit"
            variant="themePrimary"
            loading={loading.create || loading.update}
            disabled={loading.create || loading.update}
          >
            {editOpportunity ? "Update Opportunity" : "Save Opportunity"}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default OpportunityForm;
