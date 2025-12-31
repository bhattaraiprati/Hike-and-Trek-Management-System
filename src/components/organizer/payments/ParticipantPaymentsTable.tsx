// components/organizer/payment/ParticipantPaymentsTable.tsx
import { 
  User, Mail, Calendar, CreditCard, 
  CheckCircle, Clock, XCircle, AlertCircle,
  Download, Eye, FileText
} from 'lucide-react';
import type { ParticipantPayment } from '../../../types/paymentTypes';

interface ParticipantPaymentsTableProps {
  payments: ParticipantPayment[];
  eventId?: number | null;
  compact?: boolean;
  title?: string;
}

const ParticipantPaymentsTable = ({ 
  payments, 
  eventId, 
  compact = false, 
  title = 'Participant Payments' 
}: ParticipantPaymentsTableProps) => {
  const filteredPayments = eventId 
    ? payments.filter(p => p.eventId === eventId)
    : payments;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          text: 'Paid'
        };
      case 'PENDING':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: 'Pending'
        };
      case 'FAILED':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'bg-red-100 text-red-800 border-red-200',
          text: 'Failed'
        };
      case 'REFUNDED':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          text: 'Refunded'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          text: status
        };
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'CREDIT_CARD':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'PAYPAL':
        return <div className="text-blue-400 font-bold text-sm">P</div>;
      case 'BANK_TRANSFER':
        return <div className="text-green-500 font-bold text-sm">B</div>;
      case 'CASH':
        return <div className="text-gray-500 font-bold text-sm">$</div>;
      default:
        return <CreditCard className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleViewReceipt = (payment: ParticipantPayment) => {
    if (payment.receiptUrl) {
      window.open(payment.receiptUrl, '_blank');
    } else {
      alert('Receipt not available');
    }
  };

  const handleSendReminder = (payment: ParticipantPayment) => {
    alert(`Sending reminder to ${payment.participantEmail}`);
  };

  if (filteredPayments.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Payment Records</h3>
          <p className="text-gray-600">
            {eventId ? 'No payments found for this event.' : 'No participant payments in the selected period.'}
          </p>
        </div>
      </div>
    );
  }

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const completedPayments = filteredPayments.filter(p => p.status === 'COMPLETED').length;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${compact ? 'p-4' : 'p-6'}`}>
      <div className={`${compact ? 'mb-4' : 'mb-6'} flex items-center justify-between`}>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {!compact && (
            <p className="text-sm text-gray-600 mt-1">
              {filteredPayments.length} payments • ${totalAmount.toLocaleString()} total • {completedPayments} completed
            </p>
          )}
        </div>
        {!compact && (
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        )}
      </div>

      {compact ? (
        <div className="space-y-3">
          {filteredPayments.slice(0, 5).map((payment) => {
            const status = getStatusConfig(payment.status);
            
            return (
              <div key={payment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {payment.participantName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.eventTitle}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    ${payment.amount}
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredPayments.length > 5 && (
            <div className="text-center pt-2">
              <button className="text-sm text-[#1E3A5F] hover:text-[#2a4a7a]">
                + {filteredPayments.length - 5} more payments
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const status = getStatusConfig(payment.status);
                  
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{payment.participantName}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {payment.participantEmail}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{payment.eventTitle}</div>
                        <div className="text-xs text-gray-500">
                          {payment.numberOfParticipants} participant{payment.numberOfParticipants !== 1 ? 's' : ''}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(payment.paymentDate)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {payment.transactionId}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          ${payment.amount.toLocaleString()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${status.color}`}>
                          {status.icon}
                          {status.text}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span className="text-sm text-gray-700 capitalize">
                            {payment.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {payment.receiptUrl && (
                            <button
                              onClick={() => handleViewReceipt(payment)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Receipt"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          
                          {payment.status === 'PENDING' && (
                            <button
                              onClick={() => handleSendReminder(payment)}
                              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Send Reminder"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => window.print()}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Print"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="text-xl font-bold text-green-600">${totalAmount.toLocaleString()}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Completed</div>
                <div className="text-xl font-bold text-blue-600">{completedPayments}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-xl font-bold text-yellow-600">
                  {filteredPayments.filter(p => p.status === 'PENDING').length}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Avg. Payment</div>
                <div className="text-xl font-bold text-purple-600">
                  ${(totalAmount / filteredPayments.length).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParticipantPaymentsTable;