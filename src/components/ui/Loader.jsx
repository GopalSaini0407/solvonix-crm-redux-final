const Loader = ({ text = "Loading...", size = "md" }) => {
    const sizeClasses = {
      sm: "w-6 h-6 border-2",
      md: "w-10 h-10 border-4",
      lg: "w-16 h-16 border-4",
    };
  
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10">
        {/* Spinner */}
        <div
          className={`rounded-full border-t-transparent border-purple-600 animate-spin ${sizeClasses[size]}`}
        />
  
        {/* Text */}
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          {text}
        </p>
      </div>
    );
  };
  
  export default Loader;
  