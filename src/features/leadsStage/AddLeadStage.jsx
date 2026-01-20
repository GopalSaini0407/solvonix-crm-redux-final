"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addLeadStage } from "./leadStageSlice"
import CustomButton from "../../components/ui/CustomButton"
import {fetchLeadStage} from './leadStageSlice';

const AddLeadStage = ({closeModal}) => {
  const dispatch = useDispatch()
  const { leadStages, loading } = useSelector((state) => state.leadStages)
  
  
  const [form, setForm] = useState({
    stage_name: "",
    color_code: "#3b82f6",
    is_default: 0,
    is_active: 0,
    priority: leadStages.length + 1, // 👈 next priority auto
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }))
  }

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    if (loading?.create) return;

    if (!form.stage_name.trim()) {
      alert("Stage name is required")
      return
    }

    try {
      await dispatch(addLeadStage(form)).unwrap()
      dispatch(fetchLeadStage())   // 🔥 always correct
      closeModal() // modal close
      console.log("add")
    } catch (err) {
      alert(err?.message || "Failed to add lead stage");
      console.log(err?.message || "Failed to add lead stage");

    }
  }

  return (
    <div className="space-y-4">
      {/* Stage Name */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Stage Name
        </label>
        <input
          type="text"
          name="stage_name"
          value={form.stage_name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter stage name"
        />
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Color
        </label>
        <input
          type="color"
          name="color_code"
          value={form.color_code}
          onChange={handleChange}
        />
      </div>

      {/* Default */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_default"
          checked={form.is_default === 1}
          onChange={handleChange}
        />
        <span className="text-sm">Set as Default Stage</span>
      </div>

      {/* Active */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active === 1}
          onChange={handleChange}
        />
        <span className="text-sm">Active</span>
      </div>

      {/* Footer */}
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
  )
}

export default AddLeadStage
