import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  buttonText: string;
  variant?: 'danger' | 'primary' | 'success'; 
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  buttonText,
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const getButtonClass = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'danger':
      default:
        return 'bg-red-600 hover:bg-red-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 transform transition-all">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonClass()}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;


