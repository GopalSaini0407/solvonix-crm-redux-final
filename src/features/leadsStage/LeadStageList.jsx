"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import ReusableDragDropList from "../../components/shared/ReusableDragDropList";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLeadStage,
  changeLeadStagePriority,
} from "./leadStageSlice";
import Loader from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import CustomButton from "../../components/ui/CustomButton";
import AddLeadStage from "./AddLeadStage";
import { useModal } from "../../context/ModalContext";
import UpdateLeadStage from "./UpdateLeadSage";
import LeadStagePrev from "./LeadStagePrev";

const LeadStageList = () => {
  const [stages, setStages] = useState([]);
  const { openModal, closeModal } = useModal();
  const dispatch = useDispatch();

  const { leadStages, error, loading } = useSelector(
    (state) => state.leadStages
  );

  useEffect(() => {
    dispatch(fetchLeadStage());
  }, [dispatch]);

  useEffect(() => {
    setStages(leadStages);
  }, [leadStages]);

  const persistPriority = async (orderedStages) => {
    try {
      for (let i = 0; i < orderedStages.length; i++) {
        await dispatch(
          changeLeadStagePriority({
            leadStageId: orderedStages[i].id,
            data: { priority: i + 1 },
          })
        ).unwrap();
      }
      dispatch(fetchLeadStage());
    } catch (err) {
      console.error("Priority update failed", err);
      dispatch(fetchLeadStage());
    }
  };

  const changePriority = async (newOrder) => {
    if (!newOrder || newOrder.length === 0) return;
    setStages(newOrder);
    await persistPriority(newOrder);
  };

  const moveUpStage = async (index) => {
    if (index <= 0) return;
    const newOrder = [...stages];
    [newOrder[index - 1], newOrder[index]] = [
      newOrder[index],
      newOrder[index - 1],
    ];
    setStages(newOrder);
    await persistPriority(newOrder);
  };

  const moveDownStage = async (index) => {
    if (index >= stages.length - 1) return;
    const newOrder = [...stages];
    [newOrder[index], newOrder[index + 1]] = [
      newOrder[index + 1],
      newOrder[index],
    ];
    setStages(newOrder);
    await persistPriority(newOrder);
  };

  if (loading.fetch) {
    return <Loader text="Loading LeadStage..." size="lg" />;
  }

  if (error.fetch) {
    return (
      <ErrorState
        title="failed to load lead stage"
        message={error.fetch}
        onRetry={() => dispatch(fetchLeadStage())}
      />
    );
  }

  const toggleActive = (id) => {
    alert("active call", id);
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
            add stage
          </CustomButton>
        </h1>

        <ReusableDragDropList
          items={stages || []}
          onChange={changePriority}
          renderItem={(item) => {
            const index = stages.findIndex((s) => s.id === item.id);

            return (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <span
                    className="w-5 h-5 rounded-full"
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
                      Priority: {index + 1}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveUpStage(index)}
                    disabled={index === 0}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-40"
                    title="Move Up"
                  >
                    <ArrowUp size={16} />
                  </button>

                  <button
                    onClick={() => moveDownStage(index)}
                    disabled={index === stages.length - 1}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-40"
                    title="Move Down"
                  >
                    <ArrowDown size={16} />
                  </button>

                  <button
                    onClick={() => toggleActive(item.id)}
                    className={`p-2 rounded-lg ${
                      item.is_active
                        ? "text-green-600 hover:bg-green-100"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {item.is_active ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
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

                  <button className="p-2 rounded-lg hover:bg-red-100 text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          }}
        />

        <LeadStagePrev stages={stages} />
      </div>
    </div>
  );
};

export default LeadStageList;
