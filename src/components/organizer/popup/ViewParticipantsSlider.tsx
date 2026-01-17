import { useState } from 'react';
import { 
  X, Check, XCircle, User, FileText, Clock, 
  Search, Filter, CheckCircle,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorMessageToast, SuccesfulMessageToast } from '../../../utils/Toastify.util';
import { updateParticipantAttendance, type ParticipantsAttendanceDTO } from '../../../api/services/Participant';
import type { EventParticipant, EventDetails } from '../../../types/eventTypes';

interface ParticipantsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventData: EventDetails | undefined; // Pass event data as prop
  isLoading: boolean;
}

const ViewParticipantsSlider = ({ 
  isOpen, 
  onClose, 
  eventId, 
  eventData,
  isLoading 
}: ParticipantsPanelProps) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'PRESENT' | 'ABSENT' | 'REGISTERED'>('ALL');
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

  const updateAttendanceMutation = useMutation({
    mutationFn: (attendance: ParticipantsAttendanceDTO[]) =>
      updateParticipantAttendance(Number(eventId), attendance),
    onSuccess: () => {
      SuccesfulMessageToast('Attendance updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['organizerEventDetails', eventId] });
    },
    onError: () => {
      ErrorMessageToast('Failed to update attendance');
    }
  });

  const canMarkAttendance = (eventStatus: string | undefined) => {
  return eventStatus === 'COMPLETED' || eventStatus === 'INACTIVE';
};

// 2. Optional: Show a nice message when attendance is not allowed
const AttendanceStatusMessage = () => {
  if (!eventData?.status) return null;

  if (canMarkAttendance(eventData.status)) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Attendance marking is now available</span>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-6">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5" />
        <div>
          <p className="font-medium">Attendance marking is locked</p>
          <p className="text-sm mt-1">
            You can mark attendance only after the event is 
            <strong> Completed</strong> or <strong>Inactive</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

  const handleAttendanceToggle = (participantId: number, currentStatus: EventParticipant['attendanceStatus']) => {
    const newStatus = currentStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT';
    updateAttendanceMutation.mutate([{ participantId, attendanceStatus: newStatus }]);
  };

  const handleBulkAttendance = (status: 'PRESENT' | 'ABSENT') => {
    const attendanceData: ParticipantsAttendanceDTO[] = selectedParticipants.map(participantId => ({
      participantId,
      attendanceStatus: status
    }));
    updateAttendanceMutation.mutate(attendanceData);
    setSelectedParticipants([]);
  };


  // FIX: Access eventRegistration instead of registrations
  const filteredParticipants = eventData?.eventRegistration?.flatMap((reg) => 
    reg.eventParticipants.filter((participant: EventParticipant) => {
      const matchesSearch = 
        participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.contactName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'ALL' || participant.attendanceStatus === filterStatus;
      return matchesSearch && matchesFilter;
    }).map(participant => ({
      ...participant,
      registrationEmail: reg.email,
      registrationContact: reg.contact,
      registrationName: reg.contactName,
    }))
  ) || [];

  const stats = {
    total: filteredParticipants.length,
    present: filteredParticipants.filter((p) => p.attendanceStatus === 'PRESENT').length,
    absent: filteredParticipants.filter((p) => p.attendanceStatus === 'ABSENT').length,
    // pending: filteredParticipants.filter((p) => p.attendanceStatus === 'PENDING').length,
    registered: filteredParticipants.filter((p) => p.attendanceStatus === 'REGISTERED').length,
  };

  const getStatusColor = (status: EventParticipant['attendanceStatus']) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800 border-green-200';
      case 'ABSENT': return 'bg-red-100 text-red-800 border-red-200';
      // case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REGISTERED': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: EventParticipant['attendanceStatus']) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle className="w-4 h-4" />;
      case 'ABSENT': return <XCircle className="w-4 h-4" />;
      // case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'REGISTERED': return <User className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-2/5 xl:w-1/3 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1E3A5F]">Participants</h2>
              <p className="text-gray-600 text-sm mt-1">{eventData?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#1E3A5F]">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              <div className="text-xs text-green-500">Present</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <div className="text-xs text-red-500">Absent</div>
            </div>
            
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search participants..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                className="appearance-none pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="ALL">All</option>
                <option value="REGISTERED">Registered</option>
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedParticipants.length > 0 && canMarkAttendance(eventData?.status) && (
          <div className="sticky top-[280px] bg-blue-50 border-y border-blue-200 p-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1E3A5F] text-white rounded-full flex items-center justify-center">
                  {selectedParticipants.length}
                </div>
                <span className="font-medium">{selectedParticipants.length} selected</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAttendance('PRESENT')}
                  className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark Present
                </button>
                <button
                  onClick={() => handleBulkAttendance('ABSENT')}
                  className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Mark Absent
                </button>
                <button
                  onClick={() => setSelectedParticipants([])}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Participants List */}
        <div className="h-[calc(100vh-350px)] overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A5F]"></div>
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No participants found</h3>
              <p className="text-gray-500">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredParticipants.map((participant: any) => (
                <div
                  key={participant.id}
                  className={`border rounded-xl p-4 transition-all duration-200 ${
                    selectedParticipants.includes(participant.id)
                      ? 'border-[#1E3A5F] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(participant.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedParticipants([...selectedParticipants, participant.id]);
                            } else {
                              setSelectedParticipants(selectedParticipants.filter(id => id !== participant.id));
                            }
                          }}
                          className="rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                        />
                        <div className="w-6 h-6 bg-[#1E3A5F] text-white rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{participant.name}</p>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(participant.attendanceStatus)}`}>
                            {getStatusIcon(participant.attendanceStatus)}
                            {participant.attendanceStatus}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {participant.gender}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {participant.nationality}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mb-3">
                          <div>Contact: {participant.registrationContact}</div>
                          <div>Email: {participant.registrationEmail}</div>
                        </div>

                        {/* Attendance Actions */}
                        {canMarkAttendance(eventData?.status) ? (
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => handleAttendanceToggle(participant.id, participant.attendanceStatus)}
                              disabled={updateAttendanceMutation.isPending}
                              className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 min-w-[90px] justify-center ${
                                participant.attendanceStatus === 'PRESENT'
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <Check className="w-3 h-3" />
                              Present
                            </button>

                            <button
                              onClick={() => handleAttendanceToggle(participant.id, participant.attendanceStatus)}
                              disabled={updateAttendanceMutation.isPending}
                              className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 min-w-[90px] justify-center ${
                                participant.attendanceStatus === 'ABSENT'
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <XCircle className="w-3 h-3" />
                              Absent
                            </button>
                          </div>
                        ) : (
                          <div className="mt-3 text-sm text-gray-500 italic">
                            Attendance marking available after event completion / deactivation
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredParticipants.length} participant{filteredParticipants.length !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-3">
              {/* <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewParticipantsSlider;