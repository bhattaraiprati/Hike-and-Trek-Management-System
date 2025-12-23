import React from "react";

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  buttonText: string;
}

const ConfirmModal: React.FC<ConfirmLogoutModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  buttonText
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;


