import { AlertTriangle, RefreshCcw } from "lucide-react";

const ErrorState = ({
  title = "Something went wrong",
  message = "We are unable to process your request right now.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      
      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-7 w-7 text-red-600" />
      </div>

      {/* Text */}
      <h2 className="text-lg font-semibold text-gray-800">
        {title}
      </h2>

      <p className="max-w-md text-sm text-gray-600">
        {message}
      </p>

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white
                     hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
