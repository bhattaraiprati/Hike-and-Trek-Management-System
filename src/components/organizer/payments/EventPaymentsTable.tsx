// components/organizer/payment/EventPaymentsTable.tsx
import { Calendar, Users, DollarSign, Eye} from 'lucide-react';
import type { EventPayment } from '../../../types/paymentTypes';

interface EventPaymentsTableProps {
  events: EventPayment[];
  onEventSelect: (eventId: number) => void;
  selectedEventId: number | null;
}

const EventPaymentsTable = ({ events, onEventSelect, selectedEventId }: EventPaymentsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateCompletion = (paid: number, total: number) => {
    return total > 0 ? Math.round((paid / total) * 100) : 0;
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Payment Data</h3>
          <p className="text-gray-600">No events have payment records in the selected period.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Event Payments</h2>
        <p className="text-sm text-gray-600 mt-1">Total {events.length} events with payment records</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map((event) => {
              const completionPercentage = calculateCompletion(event.paidParticipants, event.totalParticipants);
              
              return (
                <tr 
                  key={event.id}
                  className={`hover:bg-gray-50 ${selectedEventId === event.id ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{event.eventTitle}</div>
                      <div className="text-sm text-gray-500">ID: {event.eventId}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(event.eventDate)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {event.paidParticipants}/{event.totalParticipants}
                        </span>
                      </div>
                      <div className="w-32">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              completionPercentage >= 90 ? 'bg-green-500' :
                              completionPercentage >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {completionPercentage}% paid
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-gray-900">
                          NPR{event.totalRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg: NPR{event.averagePaymentPerPerson.toFixed(2)}/person
                      </div>
                      <div className="text-xs text-gray-400">
                        Your share: NPR{event.organizerShare.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onEventSelect(event.eventId)}
                      className="px-3 py-1.5 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Payments
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {events.length} events
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-lg font-bold text-green-600">
                NPR{events.reduce((sum, event) => sum + event.totalRevenue, 0).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Participants</div>
              <div className="text-lg font-bold text-blue-600">
                {events.reduce((sum, event) => sum + event.totalParticipants, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPaymentsTable;