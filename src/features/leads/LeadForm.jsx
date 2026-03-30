import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeads, createLead, updateLead, getLeadFields } from "./leadSlice";
import { fetchContacts } from "../contacts/contactSlice";
import { fetchLeadStage } from "../leadsStage/leadStageSlice";
import { getLeadChannel } from "../leadChannel/leadChannelSlice";

const LeadForm = ({ editLead = null, closeModal }) => {
  const dispatch = useDispatch();

  const { pagination, loading, error, fields } = useSelector((state) => state.leads);
  const { contacts } = useSelector((state) => state.contacts);
  const { leadStages } = useSelector((state) => state.leadStages);
  const { leadChannel } = useSelector((state) => state.leadChannel);
    console.log(contacts,"contacts")
  const [formData, setFormData] = useState({
    contact_id: "",
    lead_stage_id: "",
    lead_source_id: "",
    currency: "INR",
    lead_value: "",
    message: ""
  });

  const [contactSearch, setContactSearch] = useState("");
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    dispatch(fetchContacts({ page: 1, name: "" }));
    dispatch(fetchLeadStage());
    dispatch(getLeadChannel());
    dispatch(getLeadFields());
  }, [dispatch]);

  // Filter contacts based on search
  const filteredContacts = contacts.filter((contact) => {
    if (!contactSearch) return true; // if no search, show all
    
    const searchLower = contactSearch.toLowerCase();
    const contactName = (contact.name || `${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim()).toLowerCase();
    const contactEmail = (contact.email || "").toLowerCase();
    const contactPhone = (contact.phone || contact.mobile || "").toLowerCase();
    
    return (
      contactName.includes(searchLower) ||
      contactEmail.includes(searchLower) ||
      contactPhone.includes(searchLower)
    );
  });

  // Handle contact search with debounce (server-side)
  const handleContactSearch = (value) => {
    setContactSearch(value);
    setShowContactDropdown(true);

    // Clear previous timeout
    if (searchTimeout) clearTimeout(searchTimeout);

    // Set new timeout for API call (debounce 500ms)
    const timeout = setTimeout(() => {
      if (value.length > 0) {
        // Call API with name parameter (backend expects "name" not "search")
        dispatch(fetchContacts({ page: 1, name: value }));
      } else {
        // If search is empty, fetch all contacts
        dispatch(fetchContacts({ page: 1 }));
      }
    }, 500);

    setSearchTimeout(timeout);
  };

  useEffect(() => {
    if (editLead) {
      setFormData({
        contact_id: editLead.contact_id || "",
        lead_stage_id: editLead.lead_stage_id || "",
        lead_source_id: editLead.lead_source_id || "",
        currency: editLead.currency || "INR",
        lead_value: editLead.lead_value || "",
        message: editLead.message || ""
      });
      // Set contact search field with contact name
      const contactName = editLead.name || editLead.contact?.name || "";
      setContactSearch(contactName);
    }
  }, [editLead]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      contact_id: Number(formData.contact_id),
      lead_stage_id: Number(formData.lead_stage_id),
      lead_source_id: Number(formData.lead_source_id),
      currency: formData.currency,
      lead_value: formData.lead_value,
      message: formData.message
    };

    console.log(payload,"payload")
    try {
      if (editLead?.id) {
        await dispatch(updateLead({
          leadId: editLead.id,
          data: payload
        })).unwrap();
      } else {
        await dispatch(createLead(payload)).unwrap();
      }

      dispatch(getLeads({ page: pagination?.current_page || 1 }));
      closeModal();
    } catch (err) {
      console.log("Save failed", err);
    }
  };

  const currencies = [
    { code: "INR", symbol: "₹" },
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "JPY", symbol: "¥" },
    { code: "AUD", symbol: "A$" },
    { code: "CAD", symbol: "C$" },
    { code: "CHF", symbol: "CHF" },
    { code: "CNY", symbol: "¥" },
    { code: "NZD", symbol: "NZ$" },
    { code: "SGD", symbol: "S$" },
    { code: "MXN", symbol: "MX$" },
    { code: "ZAR", symbol: "R" },
    { code: "BRL", symbol: "R$" },
    { code: "RUB", symbol: "₽" },
    { code: "KRW", symbol: "₩" }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {editLead ? "Update Lead" : "Add New Lead"}
      </h2>

      {(error?.create || error?.update) && (
        <div className="mb-4 bg-red-50 p-3 text-red-700 rounded border border-red-200">
          {error?.create?.message || error?.update?.message || error?.create || error?.update}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Selection with Search - Full Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={contactSearch}
              onChange={(e) => handleContactSearch(e.target.value)}
              onFocus={() => setShowContactDropdown(true)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showContactDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
                {loading?.fetch ? (
                  <div className="px-3 py-2 text-gray-500 text-center">Loading contacts...</div>
                ) : filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => {
                    const displayName = contact.name || `${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim() || "Unnamed";
                    return (
                      <div
                        key={contact.id}
                        onClick={() => {
                          handleChange("contact_id", contact.id);
                          setContactSearch(displayName);
                          setShowContactDropdown(false);
                        }}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{displayName}</div>
                        <div className="text-xs text-gray-500">
                          {contact.email && <span>{contact.email}</span>}
                          {contact.email && (contact.phone || contact.mobile) && <span> • </span>}
                          {(contact.phone || contact.mobile) && <span>{contact.phone || contact.mobile}</span>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-3 py-2 text-gray-500 text-center">
                    {contactSearch ? "No contacts found matching your search" : "Type to search contacts"}
                  </div>
                )}
              </div>
            )}
          </div>
          {formData.contact_id && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
              ✓ Contact selected: {contactSearch}
            </div>
          )}
        </div>

        {/* Form Grid - 2 Columns for other fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lead Stage Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Stage <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.lead_stage_id}
              onChange={(e) => handleChange("lead_stage_id", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Stage</option>
              {leadStages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.stage_name}
                </option>
              ))}
            </select>
          </div>

          {/* Lead Source Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Source <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.lead_source_id}
              onChange={(e) => handleChange("lead_source_id", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Source</option>
              {leadChannel.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.channel}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} ({currency.code})
                </option>
              ))}
            </select>
          </div>

          {/* Lead Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Value <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.lead_value}
              onChange={(e) => handleChange("lead_value", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter lead value"
              required
            />
          </div>
        </div>

        {/* Message - Full Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter message"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading?.create || loading?.update}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editLead
              ? (loading?.update ? "Updating..." : "Update Lead")
              : (loading?.create ? "Saving..." : "Save Lead")
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;