import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactActivityLog } from "./contactSlice";
import Loader from "../../components/ui/Loader";

const ContactActivityLog = ({ contactId ,limit=3 }) => {
  const dispatch = useDispatch();

  const { activities, loading, error } = useSelector(
    (state) => state.contacts
  );
  // console.log(contactId);
  

  useEffect(() => {
    if (contactId) {
      dispatch(fetchContactActivityLog(contactId));
    }
  }, [dispatch, contactId]);

  const visibleActivities = activities.slice(-limit).reverse();
  console.log(visibleActivities);

  // Loading state
  if (loading.log) {
    return <Loader text="Loading activity log..." />;
  }

  // Error state
  if (error.log) {
    return <p className="text-red-500">{error.log}</p>;
  }

  // Empty state
  if (!visibleActivities || visibleActivities.length === 0) {
    return <p className="text-gray-500">No activity found</p>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {visibleActivities.map((log, idx) => (
        <li key={idx} className="p-3 text-sm">
          <div>
            <span className="font-semibold">{log.user_name}</span>{" "}
            updated{" "}
            <span className="font-medium">
              {log.display_text || log.field_name}
            </span>{" "}
            from{" "}
            <span className="font-semibold text-red-600">
              {log.old_value}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-green-600">
              {log.new_value}
            </span>
          </div>

          <div className="text-xs text-gray-500 mt-1">
            {log.log_date} • {log.log_time}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ContactActivityLog;
