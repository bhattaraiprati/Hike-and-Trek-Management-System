// components/organizer/popup/StatusChangeModal.tsx
import { useState } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle, Flag, FileText, ShieldOff} from 'lucide-react';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  targetStatus: string;
  onConfirm: (reason?: string) => void;
  isSubmitting: boolean;
  eventTitle: string;
}

const StatusChangeModal = ({ 
  isOpen, 
  onClose, 
  currentStatus, 
  targetStatus, 
  onConfirm, 
  isSubmitting,
  eventTitle 
}: StatusChangeModalProps) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const getStatusConfig = () => {
    const config: Record<string, {
      icon: React.ReactNode;
      title: string;
      description: string;
      color: string;
      requireReason: boolean;
      reasonPlaceholder?: string;
      warning?: string;
    }> = {
      'ACTIVE': {
        icon: <CheckCircle className="w-6 h-6" />,
        title: 'Publish Event',
        description: 'Make this event visible and available for registration.',
        color: 'text-green-600 bg-green-50 border-green-200',
        requireReason: false
      },
      'INACTIVE': {
        icon: <ShieldOff className="w-6 h-6" />,
        title: 'Deactivate Event',
        description: 'Temporarily hide this event from participants.',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        requireReason: false,
        warning: 'Participants will not be able to register while inactive.'
      },
      'COMPLETED': {
        icon: <Flag className="w-6 h-6" />,
        title: 'Mark Event as Complete',
        description: 'Indicate that this event has finished successfully.',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        requireReason: false,
        warning: 'This will close registrations and archive the event.'
      },
      'CANCELLED': {
        icon: <XCircle className="w-6 h-6" />,
        title: 'Cancel Event',
        description: 'Cancel this event permanently. This action cannot be undone.',
        color: 'text-red-600 bg-red-50 border-red-200',
        requireReason: true,
        reasonPlaceholder: 'Please provide a reason for cancellation (required)',
        warning: 'All participants will be notified and registrations will be cancelled.'
      },
      'DRAFT': {
        icon: <FileText className="w-6 h-6" />,
        title: 'Restore to Draft',
        description: 'Move this event back to draft mode for editing.',
        color: 'text-gray-600 bg-gray-50 border-gray-200',
        requireReason: false
      }
    };
    return config[targetStatus] || config['CANCELLED'];
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'DRAFT': 'Draft',
      'ACTIVE': 'Active',
      'INACTIVE': 'Inactive',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const config = getStatusConfig();

  const handleSubmit = () => {
    if (config.requireReason && !reason.trim()) {
      setError('Please provide a reason for this status change.');
      return;
    }
    setError('');
    onConfirm(config.requireReason ? reason.trim() : undefined);
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.color}`}>
                {config.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{config.title}</h2>
                <p className="text-sm text-gray-600">{eventTitle}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Status Transition */}
              <div className="flex items-center justify-center gap-4 py-3">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Current Status</div>
                  <div className="font-medium text-gray-900">{getStatusText(currentStatus)}</div>
                </div>
                <div className="text-gray-400">→</div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">New Status</div>
                  <div className="font-medium text-gray-900">{getStatusText(targetStatus)}</div>
                </div>
              </div>

              {/* Description */}
              <div className="text-gray-700">
                {config.description}
              </div>

              {/* Warning */}
              {config.warning && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">{config.warning}</p>
                  </div>
                </div>
              )}

              {/* Reason Input (for cancellation) */}
              {config.requireReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Reason
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setError('');
                    }}
                    placeholder={config.reasonPlaceholder}
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent resize-none"
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || (config.requireReason && !reason.trim())}
              className={`px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                targetStatus === 'CANCELLED' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : targetStatus === 'COMPLETED'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-[#1E3A5F] hover:bg-[#2a4a7a]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  {targetStatus === 'CANCELLED' ? <XCircle className="w-4 h-4" /> : config.icon}
                  {config.title}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusChangeModal;