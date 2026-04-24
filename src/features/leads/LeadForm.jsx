import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeads, createLead, updateLead, getLeadFields, selectActiveLeadFields } from "./leadSlice";
import { fetchLeadStage, selectActiveLeadStages } from "../leadsStage/leadStageSlice";
import { getLeadChannel, selectActiveLeadChannels } from "../leadChannel/leadChannelSlice";
import RenderField from "./RenderField";

const LeadForm = ({ editLead = null, closeModal }) => {
  const dispatch = useDispatch();

  const { pagination, loading, error, fields: allFields } = useSelector((state) => state.leads);
  const fields = useSelector(selectActiveLeadFields);
  const activeLeadStages = useSelector(selectActiveLeadStages);
  const activeLeadChannels = useSelector(selectActiveLeadChannels);

  const [formData, setFormData] = useState({});

  // Field name detection (must be before useEffect that uses it)
  const allDynamicFields = fields ? Object.values(fields).flat() : [];

  const findFieldName = (aliases) =>
    allDynamicFields.find((f) => aliases.includes(f.field_name))?.field_name;

  const nameFieldName = findFieldName(["name", "full_name"]);
  const emailFieldName = findFieldName(["email"]);
  const mobileFieldName = findFieldName(["mobile", "phone", "mobile_number"]);
  const countryCodeFieldName = findFieldName(["country_code", "countryCode"]);
  const stageFieldName = findFieldName(["lead_stage", "lead_stage_id", "stage", "stage_id"]);
  const sourceFieldName = findFieldName(["lead_source", "lead_source_id", "source", "source_id"]);

  useEffect(() => {
    dispatch(fetchLeadStage());
    dispatch(getLeadChannel());
    if (!allFields || Object.keys(allFields).length === 0) {
      dispatch(getLeadFields());
    }
  }, [dispatch, allFields]);

  useEffect(() => {
    if (editLead) {
      const formDataObj = { ...editLead };

      const nameValue = editLead.name || `${editLead.first_name ?? ""} ${editLead.last_name ?? ""}`.trim();
      if (nameValue) {
        formDataObj.name = nameValue;
      }

      const emailValue = editLead.email || editLead[emailFieldName];
      if (emailValue) {
        formDataObj.email = emailValue;
      }

      const mobileValue = editLead.mobile || editLead.phone || editLead.mobile_number || editLead[mobileFieldName];
      if (mobileValue) {
        formDataObj.mobile = mobileValue;
      }

      const countryCodeValue = editLead.country_code || editLead[countryCodeFieldName];
      if (countryCodeValue) {
        formDataObj.country_code = countryCodeValue;
      }

      const stageValue = editLead.lead_stage_id || editLead.lead_stage || editLead.stage_id || editLead.stage || editLead[stageFieldName];
      if (stageValue) {
        formDataObj.lead_stage_id = stageValue;
      }

      const sourceValue = editLead.lead_source_id || editLead.lead_source || editLead.source_id || editLead.source || editLead[sourceFieldName];
      if (sourceValue) {
        formDataObj.lead_source_id = sourceValue;
      }

      if (nameFieldName && nameFieldName !== "name") {
        delete formDataObj[nameFieldName];
      }
      if (emailFieldName && emailFieldName !== "email") {
        delete formDataObj[emailFieldName];
      }
      if (mobileFieldName && mobileFieldName !== "mobile") {
        delete formDataObj[mobileFieldName];
        delete formDataObj.phone;
        delete formDataObj.mobile_number;
      }
      if (countryCodeFieldName && countryCodeFieldName !== "country_code") {
        delete formDataObj[countryCodeFieldName];
      }
      if (stageFieldName && stageFieldName !== "lead_stage_id") {
        delete formDataObj[stageFieldName];
        delete formDataObj.lead_stage;
        delete formDataObj.stage_id;
        delete formDataObj.stage;
      }
      if (sourceFieldName && sourceFieldName !== "lead_source_id") {
        delete formDataObj[sourceFieldName];
        delete formDataObj.lead_source;
        delete formDataObj.source_id;
        delete formDataObj.source;
      }

      setFormData(formDataObj);
    } else {
      setFormData({});
    }
  }, [editLead, nameFieldName, emailFieldName, mobileFieldName, countryCodeFieldName, sourceFieldName, stageFieldName]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    { code: "KRW", symbol: "₩" },
  ];

  const parseOptions = (optionsString) => {
    if (!optionsString) return [];
    if (["countries", "states", "genders"].includes(optionsString)) {
      const predefinedLists = {
        countries: ["United States", "Canada", "UK", "Australia", "Germany", "France", "Japan", "India", "Brazil", "Mexico"],
        states: ["California", "Texas", "New York", "Florida", "Illinois", "Pennsylvania", "Ohio", "Georgia", "North Carolina", "Michigan"],
        genders: ["Male", "Female", "Non-binary", "Prefer not to say"],
      };
      return predefinedLists[optionsString].map((v) => ({ label: v, value: v }));
    }
    return optionsString.split(",").map((v) => ({ label: v.trim(), value: v.trim() }));
  };

  const getFieldOptions = (field) => {
    if (["lead_stage", "lead_stage_id", "stage", "stage_id"].includes(field.field_name)) {
      return activeLeadStages.map((stage) => ({ label: stage.stage_name, value: stage.id }));
    }
    if (["lead_source", "lead_source_id", "source", "source_id"].includes(field.field_name)) {
      return activeLeadChannels.map((channel) => ({ label: channel.channel, value: channel.id }));
    }
    if (["currency", "currency_code"].includes(field.field_name)) {
      return currencies.map((c) => ({ label: `${c.symbol} (${c.code})`, value: c.code }));
    }
    return parseOptions(field.field_options);
  };

  const buildPayload = (values) => {
    const payload = {};
    Object.entries(values).forEach(([key, value]) => {
      if (sourceFieldName && key === sourceFieldName && key !== "lead_source_id") {
        return;
      }
      if (stageFieldName && key === stageFieldName && key !== "lead_stage_id") {
        return;
      }

      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        if (["lead_stage_id", "lead_source_id", "stage_id", "source_id"].includes(key)) {
          payload[key] = Number(value);
        } else {
          payload[key] = value;
        }
      }
    });

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = buildPayload(formData);

    try {
      if (editLead?.id) {
        await dispatch(
          updateLead({
            leadId: editLead.id,
            data: payload,
          })
        ).unwrap();
      } else {
        await dispatch(createLead(payload)).unwrap();
      }

      dispatch(getLeads({ page: pagination?.current_page || 1 }));
      closeModal();
    } catch (err) {
      console.log("Save failed", err);
    }
  };


  // dynamic form fields handled in grouped sections rendered below

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
        {/* Dynamic Fields from API */}
        {fields && Object.keys(fields).length > 0 ? (
          Object.entries(fields).map(([group, groupFields]) => {
            const sortedFields = [...groupFields].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
            return (
              <div key={group} className="mb-6 border border-gray-200 rounded">
                <div className="bg-gray-100 px-4 py-2 font-semibold">{group}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                  {sortedFields.map((field) => {
                    // For special fields, store to canonical backend names
                    let storageFieldName = field.field_name;
                    if (nameFieldName && field.field_name === nameFieldName) {
                      storageFieldName = "name";
                    } else if (emailFieldName && field.field_name === emailFieldName) {
                      storageFieldName = "email";
                    } else if (sourceFieldName && field.field_name === sourceFieldName) {
                      storageFieldName = "lead_source_id";
                    } else if (stageFieldName && field.field_name === stageFieldName) {
                      storageFieldName = "lead_stage_id";
                    } else if (mobileFieldName && field.field_name === mobileFieldName) {
                      storageFieldName = "mobile";
                    } else if (countryCodeFieldName && field.field_name === countryCodeFieldName) {
                      storageFieldName = "country_code";
                    }

                    return (
                      <div key={field.field_name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.display_text || field.field_name}
                          {field.is_required === 1 && <span className="text-red-500">*</span>}
                        </label>
                        <RenderField
                          field={field}
                          value={formData[storageFieldName] ?? ""}
                          onChange={(val) => handleChange(storageFieldName, val)}
                          fieldOptions={getFieldOptions(field)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-500">No form fields configured yet.</div>
        )}

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
