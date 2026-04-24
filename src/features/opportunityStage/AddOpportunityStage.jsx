"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/ui/CustomButton";
import {
  addOpportunityStage,
  fetchOpportunityStage,
} from "./opportunityStageSlice";

const AddOpportunityStage = ({ closeModal }) => {
  const dispatch = useDispatch();
  const { opportunityStages, loading } = useSelector(
    (state) => state.opportunityStages
  );

  const [form, setForm] = useState({
    stage_name: "",
    color_code: "#3b82f6",
    is_default: 0,
    is_active: 0,
    priority: opportunityStages.length + 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading?.create) return;

    if (!form.stage_name.trim()) {
      alert("Stage name is required");
      return;
    }

    try {
      await dispatch(addOpportunityStage(form)).unwrap();
      dispatch(fetchOpportunityStage());
      closeModal();
    } catch (err) {
      alert(err?.message || "Failed to add opportunity stage");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Stage Name</label>
        <input
          type="text"
          name="stage_name"
          value={form.stage_name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter stage name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <input
          type="color"
          name="color_code"
          value={form.color_code}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_default"
          checked={form.is_default === 1}
          onChange={handleChange}
        />
        <span className="text-sm">Set as Default Stage</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active === 1}
          onChange={handleChange}
        />
        <span className="text-sm">Active</span>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={closeModal}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>

        <CustomButton
          variant="themePrimary"
          onClick={handleSubmit}
          loading={loading.create}
          disabled={loading.create}
        >
          Add Stage
        </CustomButton>
      </div>
    </div>
  );
};

export default AddOpportunityStage;
