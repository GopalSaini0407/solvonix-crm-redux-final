const DetailItem = ({ label, value, accentColor }) => (
  <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p
      className="mt-2 text-sm font-medium"
      style={accentColor ? { color: accentColor } : undefined}
    >
      {value || "N/A"}
    </p>
  </div>
);

const ViewOpportunityDetails = ({ opportunity }) => {
  const stageName =
    opportunity?.stage_name ||
    opportunity?.stage?.stage_name ||
    "N/A";

  const contactName =
    opportunity?.contact?.name ||
    opportunity?.contact_name ||
    (opportunity?.contact_id ? `Contact #${opportunity.contact_id}` : "N/A");

  const assigneeName =
    opportunity?.assigned_user?.name ||
    opportunity?.assigned_user?.email ||
    (opportunity?.assigned_to ? `User #${opportunity.assigned_to}` : "N/A");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {opportunity?.name || "Opportunity Details"}
        </h2>
        <p className="text-gray-600 mt-1">
          {opportunity?.description || "No description available."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailItem label="Stage" value={stageName} accentColor={opportunity?.color_code} />
        <DetailItem label="Status" value={opportunity?.status} />
        <DetailItem
          label="Value"
          value={
            opportunity?.value
              ? `${opportunity?.currency || ""} ${opportunity.value}`
              : "N/A"
          }
        />
        <DetailItem label="Probability" value={opportunity?.probability ? `${opportunity.probability}%` : "N/A"} />
        <DetailItem label="Contact" value={contactName} />
        <DetailItem label="Assigned To" value={assigneeName} />
        <DetailItem label="Expected Close Date" value={opportunity?.expected_close_date} />
        <DetailItem label="Active" value={Number(opportunity?.is_active ?? 0) === 1 ? "Yes" : "No"} />
      </div>
    </div>
  );
};

export default ViewOpportunityDetails;
