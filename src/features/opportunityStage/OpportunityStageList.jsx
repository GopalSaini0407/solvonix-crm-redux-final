"use client";

import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Star,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PriorityDragDrop from "../../components/shared/PriorityDragDrop";
import ErrorState from "../../components/ui/ErrorState";
import Loader from "../../components/ui/Loader";
import CustomButton from "../../components/ui/CustomButton";
import { useModal } from "../../context/ModalContext";
import AddOpportunityStage from "./AddOpportunityStage";
import OpportunityPrev from "./OpportunityPrev";
import UpdateOpportunityStage from "./UpdateOpportunityStage";
import {
  changeOpportunityStagePriority,
  fetchOpportunityStage,
  reorderOpportunityStages,
  updateOpportunityStage,
} from "./opportunityStageSlice";

const OpportunityStageList = () => {
  const { openModal, closeModal } = useModal();
  const dispatch = useDispatch();

  const { opportunityStages, error, loading } = useSelector(
    (state) => state.opportunityStages
  );

  useEffect(() => {
    dispatch(fetchOpportunityStage());
  }, [dispatch]);

  const syncPriorities = (updated) => {
    updated.forEach((stage) => {
      dispatch(
        changeOpportunityStagePriority({
          opportunityStageId: stage.id,
          data: { priority: stage.priority },
        })
      );
    });
  };

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) return;

    const items = Array.from(opportunityStages);
    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);

    const updated = items.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));

    dispatch(reorderOpportunityStages(updated));
    syncPriorities(updated);
  };

  const moveUp = (index) => {
    if (index === 0) return;

    const items = [...opportunityStages];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];

    const updated = items.map((item, orderIndex) => ({
      ...item,
      priority: orderIndex + 1,
    }));

    dispatch(reorderOpportunityStages(updated));
    syncPriorities(updated);
  };

  const moveDown = (index) => {
    if (index === opportunityStages.length - 1) return;

    const items = [...opportunityStages];
    [items[index], items[index + 1]] = [items[index + 1], items[index]];

    const updated = items.map((item, orderIndex) => ({
      ...item,
      priority: orderIndex + 1,
    }));

    dispatch(reorderOpportunityStages(updated));
    syncPriorities(updated);
  };

  const toggleActive = (item) => {
    const newStatus = item.is_active === 1 ? 0 : 1;

    const updatedStages = opportunityStages.map((stage) =>
      stage.id === item.id ? { ...stage, is_active: newStatus } : stage
    );
    dispatch(reorderOpportunityStages(updatedStages));

    dispatch(
      updateOpportunityStage({
        opportunityStageId: item.id,
        data: {
          stage_name: item.stage_name,
          priority: item.priority,
          is_default: item.is_default,
          color_code: item.color_code,
          is_active: newStatus,
        },
      })
    )
      .unwrap()
      .catch(() => {
        dispatch(reorderOpportunityStages(opportunityStages));
      });
  };

  if (loading.fetch) {
    return <Loader text="Loading Opportunity Stages..." size="lg" />;
  }

  if (error.fetch) {
    return (
      <ErrorState
        title="Failed to load opportunity stages"
        message={error.fetch}
        onRetry={() => dispatch(fetchOpportunityStage())}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-2xl font-bold flex justify-between">
          Opportunity Stages
          <CustomButton
            variant="themePrimary"
            onClick={() =>
              openModal({
                title: "Add Opportunity Stage",
                size: "md",
                content: <AddOpportunityStage closeModal={closeModal} />,
              })
            }
          >
            Add Stage
          </CustomButton>
        </h1>

        <PriorityDragDrop
          grouped={false}
          data={opportunityStages}
          onDragEnd={handleDragEnd}
          getItemId={(item) => item.id.toString()}
          renderItem={(item) => {
            const index = opportunityStages.findIndex((i) => i.id === item.id);

            return (
              <div className="flex items-center justify-between p-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50">
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
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40"
                  >
                    <ArrowUp size={16} />
                  </button>

                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === opportunityStages.length - 1}
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
                        title: "Update Opportunity Stage",
                        size: "md",
                        content: (
                          <UpdateOpportunityStage
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
            );
          }}
        />

        <OpportunityPrev stages={opportunityStages} />
      </div>
    </div>
  );
};

export default OpportunityStageList;
