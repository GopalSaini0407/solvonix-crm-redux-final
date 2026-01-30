
const CustomButton=({

  type="button",
  children,
  onClick,
  variant="primary",   // primary | secondary | danger | success | outline
  size="md",            // sm | md | lg
  loading=false,
  disabled=false,
  leftIcon=null,   // JSX icon
  rightIcon=null,   // JSX icon
  className="",
})=>{

  const base="inline-flex justify-center text-left items-center gap-2 rounded-md cursor-pointer font-medium transition-all focus:outline-none focus:ring-0 focus:ring-offset-2"
   
  const variants={
    primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    themePrimary:
    "bg-(--color-primary) text-(--color-bg) hover:bg-(--color-nav-bg) px-4 py-2 rounded-lg flex items-center",
    border:
      "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center",
    
  };

  const sizes={
    sm:"px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  const disabledClass=
     disabled || loading ? "opacity-60 cursor-not-allowed":"";
      
     return (
      <button 
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${disabledClass}
        ${className}
        `}
      >
        {loading ?(
          <>
          {/* Spinner */}
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Loading....
          </>
        ):(
          <>
          {leftIcon && <span className="flex">{leftIcon}</span>}
          <span>{children}</span>
          {
            rightIcon && <span className="flex">{rightIcon}</span>
          }
          </>
        )
      }

      </button>
     );
    
}


export default CustomButton;