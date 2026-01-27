"use client";

import {
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeadStage,
  changeLeadStagePriority,
  reorderLeadStages,
  updateLeadStage
} from "./leadStageSlice";
import Loader from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import CustomButton from "../../components/ui/CustomButton";
import AddLeadStage from "./AddLeadStage";
import UpdateLeadStage from "./UpdateLeadSage";
import LeadStagePrev from "./LeadStagePrev";
import { useModal } from "../../context/ModalContext";
import PriorityDragDrop from "../../components/shared/PriorityDragDrop";

const LeadStageList = () => {
  const { openModal, closeModal } = useModal();
  const dispatch = useDispatch();

  const { leadStages, error, loading } = useSelector(
    (state) => state.leadStages
  );

  useEffect(() => {
    dispatch(fetchLeadStage());
  }, [dispatch]);

  // 🔹 DRAG & DROP
  const handleDragEnd = ({ source, destination }) => {
    if (!destination) return;

    const items = Array.from(leadStages);
    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);

    const updated = items.map((item, i) => ({
      ...item,
      priority: i + 1,
    }));

    // ✅ optimistic redux update
    dispatch(reorderLeadStages(updated));

    // ✅ backend sync
    updated.forEach((stage) => {
      dispatch(
        changeLeadStagePriority({
          leadStageId: stage.id,
          data: { priority: stage.priority },
        })
      );
    });
  };

  // 🔼 Move Up
  const moveUp = (index) => {
    if (index === 0) return;

    const items = [...leadStages];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];

    const updated = items.map((item, i) => ({
      ...item,
      priority: i + 1,
    }));

    dispatch(reorderLeadStages(updated));

    updated.forEach((stage) => {
      dispatch(
        changeLeadStagePriority({
          leadStageId: stage.id,
          data: { priority: stage.priority },
        })
      );
    });
  };

  // 🔽 Move Down
  const moveDown = (index) => {
    if (index === leadStages.length - 1) return;

    const items = [...leadStages];
    [items[index], items[index + 1]] = [items[index + 1], items[index]];

    const updated = items.map((item, i) => ({
      ...item,
      priority: i + 1,
    }));

    dispatch(reorderLeadStages(updated));

    updated.forEach((stage) => {
      dispatch(
        changeLeadStagePriority({
          leadStageId: stage.id,
          data: { priority: stage.priority },
        })
      );
    });
  };

  if (loading.fetch) {
    return <Loader text="Loading Lead Stages..." size="lg" />;
  }

  if (error.fetch) {
    return (
      <ErrorState
        title="Failed to load lead stages"
        message={error.fetch}
        onRetry={() => dispatch(fetchLeadStage())}
      />
    );
  }

const toggleActive = (item) => {
  const newStatus = item.is_active === 1 ? 0 : 1;

  // optimistic UI
  const updatedStages = leadStages.map(stage =>
    stage.id === item.id
      ? { ...stage, is_active: newStatus }
      : stage
  );
  dispatch(reorderLeadStages(updatedStages));

  dispatch(
    updateLeadStage({
      leadStageId: item.id,
      data: {
        stage_name: item.stage_name,
        priority: item.priority,
        is_default: item.is_default,
        color_code: item.color_code,
        is_active: newStatus, // number hi bhejo
      },
    })
  )
  .unwrap()
  .catch(() => {
    // rollback on failure
    dispatch(reorderLeadStages(leadStages));
  });
};


  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-2xl font-bold flex justify-between">
          Lead Stage Ordering
          <CustomButton
            variant="themePrimary"
            onClick={() =>
              openModal({
                title: "Add Lead Stage",
                size: "md",
                content: <AddLeadStage closeModal={closeModal} />,
              })
            }
          >
            Add Stage
          </CustomButton>
        </h1>

        <PriorityDragDrop
          grouped={false}
          data={leadStages}
          onDragEnd={handleDragEnd}
          getItemId={(item) => item.id.toString()}
          renderItem={(item) => {
              const index=leadStages.findIndex((i)=>i.id===item.id);

              return(
                <div className="flex items-center justify-between p-4 border rounded-xl bg-white hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color_code }}
                  />
  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">
                        {item.stage_name}
                      </h3>
  
                      {item.is_default === 1 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                          <Star size={12} /> Default
                        </span>
                      )}
                    </div>
  
                    <p className="text-xs text-gray-500 mt-1">
                      Priority: {item.priority}
                    </p>
                  </div>
                </div>
  
                <div className="flex items-center gap-2">
                  {/* Move buttons */}
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40"
                  >
                    <ArrowUp size={16} />
                  </button>
  
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === leadStages.length - 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40"
                  >
                    <ArrowDown size={16} />
                  </button>
  
                  <button
                    onClick={() => toggleActive(item)}
                    className={`p-2 rounded-lg ${
                      item.is_active
                        ? "text-green-600 hover:bg-green-100"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {item.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
  
                  <button
                    className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                    onClick={() =>
                      openModal({
                        title: "Update Lead Stage",
                        size: "md",
                        content: (
                          <UpdateLeadStage
                            item={item}
                            closeModal={closeModal}
                          />
                        ),
                      })
                    }
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
              )


          }}
        />

        <LeadStagePrev stages={leadStages} />
      </div>
    </div>
  );
};

export default LeadStageList;
