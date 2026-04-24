import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOpportunityStage,
  selectActiveOpportunityStages,
} from "./opportunityStageSlice";

function OpportunityDropdow({ value, onChange }) {
  const dispatch = useDispatch();
  const opportunityStages = useSelector(selectActiveOpportunityStages);

  useEffect(() => {
    dispatch(fetchOpportunityStage());
  }, [dispatch]);

  return (
    <div>
      <select
        name="stage"
        id="stage"
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Stages</option>
        {opportunityStages?.map((stage) => (
          <option value={stage.id} key={stage.id}>
            {stage.stage_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default OpportunityDropdow;
