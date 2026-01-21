import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full ${sizeClasses[size]} mx-4 
        rounded-2xl bg-white shadow-xl animate-scaleIn 
        max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-red-500 hover:text-red-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="px-6 py-4 text-gray-600 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 border-t px-6 py-4 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
