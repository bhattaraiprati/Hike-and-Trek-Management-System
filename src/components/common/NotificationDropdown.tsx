// components/common/NotificationDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type Notification
} from '../../api/services/notificationApi';
import { useNotificationWebSocket } from '../../hooks/useNotificationWebSocket';

interface NotificationDropdownProps {
  className?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [markingAsReadId, setMarkingAsReadId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: notificationsData, refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications', 0],
    queryFn: () => fetchNotifications(0, 20),
    staleTime: 30000,
  });

  const { data: unreadCount = 0, refetch: refetchUnreadCount } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: fetchUnreadCount,
    staleTime: 10000,
    refetchInterval: 30000,
  });

  const notifications = notificationsData?.content || [];

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (notificationId) => {
      setMarkingAsReadId(notificationId);
    },
    onSuccess: async () => {
      // Refetch both queries to get updated data
      await Promise.all([
        refetchNotifications(),
        refetchUnreadCount()
      ]);
      setMarkingAsReadId(null);
    },
    onError: () => {
      setMarkingAsReadId(null);
    }
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: async () => {
      // Refetch both queries to get updated data
      await Promise.all([
        refetchNotifications(),
        refetchUnreadCount()
      ]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: async () => {
      // Refetch both queries to get updated data
      await Promise.all([
        refetchNotifications(),
        refetchUnreadCount()
      ]);
    },
  });

  // WebSocket
  useNotificationWebSocket({
    onNotificationReceived: () => {
      refetchNotifications();
      refetchUnreadCount();
    },
    showToast: true,
  });

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      BOOKING_CONFIRMATION: '🎉',
      BOOKING_CANCELLED: '❌',
      EVENT_APPROVED: '✅',
      EVENT_REJECTED: '❌',
      NEW_PARTICIPANT: '👤',
      PAYMENT_RECEIVED: '💰',
      TREK_UPDATE: '🏔️',
      NEW_MESSAGE: '💬',
    };
    return icons[type] || '🔔';
  };

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.isRead) {
      markAsReadMutation.mutate(notif.id);
    }
    // Future: navigate based on type/context
    // e.g. if (notif.type === 'NEW_PARTICIPANT') navigate to event participants
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllMutation.mutate()}
                  disabled={markAllMutation.isPending}
                  className="text-sm text-green-700 hover:text-green-800 font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {markAllMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Marking...
                    </>
                  ) : (
                    <>
                      <CheckCheck size={16} />
                      Mark all read
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Loading bar for mark all */}
          {markAllMutation.isPending && (
            <div className="h-1 bg-gray-200 overflow-hidden">
              <div className="h-full bg-green-600 animate-progress-bar" />
            </div>
          )}

          {/* Notifications list */}
          <div className="max-h-[70vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" strokeWidth={1.5} />
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="relative group">
                  {/* Loading bar for individual notification */}
                  {markingAsReadId === notif.id && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden z-10">
                      <div className="h-full bg-blue-600 animate-progress-bar" />
                    </div>
                  )}

                  <div
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notif.isRead ? 'bg-blue-50/40' : ''
                    } ${markingAsReadId === notif.id ? 'opacity-70' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{getNotificationIcon(notif.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            {notif.title}
                            {!notif.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                            {markingAsReadId === notif.id && (
                              <Loader2 size={12} className="animate-spin text-blue-500" />
                            )}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate(notif.id);
                            }}
                            disabled={deleteMutation.isPending}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-opacity disabled:cursor-not-allowed"
                          >
                            {deleteMutation.variables === notif.id && deleteMutation.isPending ? (
                              <Loader2 size={14} className="text-red-600 animate-spin" />
                            ) : (
                              <Trash2 size={14} className="text-red-600" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button className="w-full text-center text-sm text-indigo-700 hover:text-indigo-800 font-medium">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* CSS for progress bar animation */}
      <style>{`
        @keyframes progress-bar {
          0% {
            width: 0%;
            opacity: 1;
          }
          70% {
            width: 70%;
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 0;
          }
        }

        .animate-progress-bar {
          animation: progress-bar 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};