// components/organizer/payment/PaymentFilters.tsx
import { Filter,  X } from 'lucide-react';
import type { EventPayment, PaymentFilter } from '../../../types/paymentTypes';

interface PaymentFiltersProps {
  filters: PaymentFilter;
  onFilterChange: (filters: Partial<PaymentFilter>) => void;
  events: EventPayment[];
}

const PaymentFilters = ({ filters, onFilterChange, events }: PaymentFiltersProps) => {
  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'REFUNDED', label: 'Refunded' }
  ];

  const paymentMethodOptions = [
    { value: 'ALL', label: 'All Methods' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'ESewa', label: 'ESewa' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CASH', label: 'Cash' }
  ];

  const handleClearFilters = () => {
    onFilterChange({
      dateRange: {
        from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
      },
      status: 'ALL',
      eventId: undefined,
      paymentMethod: undefined
    });
  };

  return (
    <div className="bg-white  rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#1E3A5F]" />
          Filter Payments
        </h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </button>   
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.dateRange.from}
              onChange={(e) => onFilterChange({ 
                dateRange: { ...filters.dateRange, from: e.target.value }
              })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent text-sm"
            />
            <span className="self-center text-gray-500">to</span>
            <input
              type="date"
              value={filters.dateRange.to}
              onChange={(e) => onFilterChange({ 
                dateRange: { ...filters.dateRange, to: e.target.value }
              })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Event Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event
          </label>
          <select
            value={filters.eventId || ''}
            onChange={(e) => onFilterChange({ 
              eventId: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent text-sm"
          >
            <option value="">All Events</option>
            {events.map((event) => (
              <option key={event.eventId} value={event.eventId}>
                {event.eventTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            value={filters.paymentMethod || 'ALL'}
            onChange={(e) => onFilterChange({ 
              paymentMethod: e.target.value === 'ALL' ? undefined : e.target.value 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent text-sm"
          >
            {paymentMethodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PaymentFilters;