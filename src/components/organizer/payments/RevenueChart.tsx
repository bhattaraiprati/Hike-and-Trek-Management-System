// components/organizer/payment/RevenueChart.tsx
import {  DollarSign, Users, Calendar } from 'lucide-react';
import type { MonthlyRevenue } from '../../../types/paymentTypes';

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalEvents = data.reduce((sum, d) => sum + d.events, 0);
  const totalParticipants = data.reduce((sum, d) => sum + d.participants, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
          <p className="text-sm text-gray-600 mt-1">Last 6 months performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">NPR{totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <div className="flex items-end h-48 gap-4 mt-4">
          {data.map((month, index) => {
            const heightPercentage = (month.revenue / maxRevenue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  <div 
                    className={`w-3/4 rounded-t-lg ${
                      month.growth > 0 
                        ? 'bg-gradient-to-t from-green-500 to-emerald-600'
                        : 'bg-gradient-to-t from-red-500 to-orange-500'
                    }`}
                    style={{ height: `${Math.max(heightPercentage, 5)}%` }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-xs font-medium text-gray-900">NPR{(month.revenue / 1000).toFixed(1)}k</div>
                  <div className="text-xs text-gray-500 mt-1">{month.month}</div>
                  <div className={`text-xs mt-1 ${month.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {month.growth > 0 ? '+' : ''}{month.growth}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Avg. Revenue/Event</div>
            <div className="text-lg font-bold text-gray-900">
              NPR{totalEvents > 0 ? (totalRevenue / totalEvents).toLocaleString() : '0'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Participants</div>
            <div className="text-lg font-bold text-gray-900">{totalParticipants.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Avg. Participants/Event</div>
            <div className="text-lg font-bold text-gray-900">
              {totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;