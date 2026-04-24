import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { updateLeadStage,fetchLeadStage } from "./leadStageSlice";
import CustomButton from "../../components/ui/CustomButton";

const UpdateLeadStage=({item,closeModal})=>{
   
    const dispatch=useDispatch();

    const {loading} =useSelector((state)=>state.leadStages);

    const [form,setForm]=useState({
        stage_name:"",
        color_code:"",
        is_default:0,
        is_active:0,
        priority:null
    })

    const handleChange=(e)=>{

        const {name,value,type,checked}=e.target;

        setForm((prev)=>({
            ...prev,
            [name]:type==="checkbox"?(checked? 1:0):value,
        }))
    }

    // prefill data
    useEffect(()=>{
        if (!item) return;
        setForm({
            stage_name:item.stage_name ?? "",
            color_code:item.color_code ?? "",
            is_default:item.is_default ?? 0,
            is_active:item.is_active ?? 0,
            priority:item.priority ?? null
        })
        
    },[item])

    

// update stage
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if (loading?.update) return;
        
        if (!item.id) {
            alert("Invalid lead stage ID");
            return;
          }


        if(!form.stage_name.trim()){
            alert("stage name is required");
            return
        }

        try {
            await dispatch(updateLeadStage({leadStageId:item.id,data:form})).unwrap()
             dispatch(fetchLeadStage())
            closeModal();
            
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
          id="is_default"
        />
        <label className="text-sm" htmlFor="is_default">Set as Default Stage</label>
      </div>

      {/* Active */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active === 1}
          onChange={handleChange}
          id="is_active"
        />
        <label className="text-sm" htmlFor="is_active">Active</label>
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
          loading={loading.update}
          disabled={loading.update}

        >
          Update Stage
        </CustomButton>
      </div>
    </div>
  )

}

export default UpdateLeadStage;