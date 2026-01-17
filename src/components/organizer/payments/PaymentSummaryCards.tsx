// components/organizer/payment/PaymentSummaryCards.tsx
import { DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { PaymentSummary } from '../../../types/paymentTypes';

interface PaymentSummaryCardsProps {
  summary: PaymentSummary;
}

const PaymentSummaryCards = ({ summary }: PaymentSummaryCardsProps) => {
  const cards = [
    {
      title: 'Total Income',
      value: `${summary.currency} ${summary.totalIncome.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      change: `${summary.monthlyGrowth > 0 ? '+' : ''}${summary.monthlyGrowth}% from last month`,
      description: 'Total revenue collected',
    },
    {
      title: 'Completed Payments',
      value: summary.completedPayments.toLocaleString(),
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      change: 'Paid in full',
      description: 'Successful transactions',
    },
    {
      title: 'Pending Payments',
      value: summary.pendingPayments.toLocaleString(),
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      change: 'Awaiting payment',
      description: 'Outstanding amounts',
    },
    {
      title: 'Refunded',
      value: summary.refundedPayments.toLocaleString(),
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-gradient-to-r  from-red-500 to-pink-600',
      change: 'Returned to customers',
      description: 'Refunded amounts',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${card.color}`}>
              <div className="text-white">
                {card.icon}
              </div>
            </div>
            <span className={`text-xs font-medium px-4 py-1 rounded-full ${
              index === 0 && summary.monthlyGrowth > 0 
                ? 'bg-green-100 text-green-800'
                : index === 2
                ? 'bg-yellow-100 text-yellow-800'
                : index === 3
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {card.change}
            </span>
          </div>
          
          <div className="mb-2">
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-lg font-medium text-gray-900">{card.title}</div>
          </div>
          
          <div className="text-sm text-gray-600">{card.description}</div>
          
          {index === 0 && summary.totalIncome > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Platform Fee: {summary.currency} {(summary.totalIncome * 0.10).toLocaleString()}</span>
                <span>Your Share: {summary.currency} {(summary.totalIncome * 0.90).toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                  style={{ width: '90%' }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                90% organizer share • 10% platform fee
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentSummaryCards;