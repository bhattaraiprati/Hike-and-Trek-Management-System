import { useState, useEffect } from 'react';
import { X, Mail, User, Check, Search, Send, Eye, EyeOff } from 'lucide-react';

import type { BulkEmailPayload, EventDetails } from '../../../types/eventTypes';
import { ErrorMessageToast, SuccesfulMessageToast } from '../../../utils/Toastify.util';
import { sendBulkEmail } from '../../../api/services/Event';

interface BulkEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventData: EventDetails | undefined;
  isLoading: boolean;
}

interface EmailRecipient {
  id: number;
  name: string;
  email: string;
  isSelected: boolean;
  registrationId: number;
  registrationStatus: string;
}

const BulkEmailModal = ({ isOpen, onClose, eventId, eventData, isLoading }: BulkEmailModalProps) => {
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'SELECTED'>('ALL');
  const [isPreview, setIsPreview] = useState(false);
  const [template, setTemplate] = useState<'custom' | 'reminder' | 'update' | 'confirmation'>('custom');
  

  // Initialize recipients from event data
  useEffect(() => {
    if (eventData?.eventRegistration) {
      const allRecipients: EmailRecipient[] = eventData.eventRegistration.flatMap(reg => 
        reg.eventParticipants.map(participant => ({
          id: participant.id,
          name: participant.name,
          email: reg.email, // Using the registration user's email
          isSelected: false,
          registrationId: reg.id,
          registrationStatus: reg.status
        }))
      );
      setRecipients(allRecipients);
      
      // Set default subject
      if (!subject) {
        setSubject(`Important Update: ${eventData.title}`);
      }
      
      // Set default body for templates
      if (template === 'reminder') {
        setEmailBody(`Dear Participant,\n\nThis is a reminder for the upcoming ${eventData.title} event.\n\nEvent Date: ${new Date(eventData.date).toLocaleDateString()}\nMeeting Time: ${eventData.meetingTime}\nLocation: ${eventData.location}\n\nPlease ensure you have all the required items:\n${eventData.requirements.join('\n')}\n\nLooking forward to seeing you there!\n\nBest regards,\n${eventData.contactPerson}`);
      }
    }
  }, [eventData, isOpen]);

  const handleSelectAll = () => {
    const allSelected = recipients.every(r => r.isSelected);
    setRecipients(recipients.map(r => ({
      ...r,
      isSelected: !allSelected
    })));
  };

  const handleSelectRecipient = (id: number) => {
    setRecipients(recipients.map(r => 
      r.id === id ? { ...r, isSelected: !r.isSelected } : r
    ));
  };

  const handleTemplateChange = (newTemplate: 'custom' | 'reminder' | 'update' | 'confirmation') => {
    setTemplate(newTemplate);
    
    if (newTemplate === 'reminder' && eventData) {
      setSubject(`Reminder: ${eventData.title} - ${new Date(eventData.date).toLocaleDateString()}`);
      setEmailBody(`Dear Participant,\n\nThis is a friendly reminder about the upcoming ${eventData.title} event.\n\n📅 Date: ${new Date(eventData.date).toLocaleDateString()}\n⏰ Meeting Time: ${eventData.meetingTime}\n📍 Location: ${eventData.location}\n🎒 Meeting Point: ${eventData.meetingPoint}\n\nPlease ensure you have the following items:\n${eventData.requirements.map(req => `• ${req}`).join('\n')}\n\nWe recommend arriving 15 minutes before the scheduled meeting time.\n\nIf you have any questions, please contact ${eventData.contactPerson} at ${eventData.contactEmail}.\n\nWe're excited to have you join us!\n\nBest regards,\n${eventData.contactPerson}\n${eventData.title} Team`);
    } else if (newTemplate === 'update' && eventData) {
      setSubject(`Important Update: ${eventData.title}`);
      setEmailBody(`Dear Participant,\n\nWe have an important update regarding the ${eventData.title} event.\n\n[Please enter your update details here]\n\nIf you have any questions, please don't hesitate to contact us.\n\nBest regards,\n${eventData.contactPerson}`);
    } else if (newTemplate === 'confirmation' && eventData) {
      setSubject(`Registration Confirmation: ${eventData.title}`);
      setEmailBody(`Dear Participant,\n\nThank you for registering for ${eventData.title}!\n\nYour registration has been confirmed. Here are your event details:\n\n📅 Date: ${new Date(eventData.date).toLocaleDateString()}\n⏰ Time: ${eventData.meetingTime}\n📍 Location: ${eventData.location}\n🎯 Meeting Point: ${eventData.meetingPoint}\n\nWe look forward to seeing you there!\n\nBest regards,\n${eventData.contactPerson}`);
    }
  };

  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = 
      recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'SELECTED') {
      return matchesSearch && recipient.isSelected;
    }
    
    return matchesSearch;
  });

  const selectedCount = recipients.filter(r => r.isSelected).length;
  const totalCount = recipients.length;

  const handleSendEmails = async () => {
    if (selectedCount === 0) {
      ErrorMessageToast('Please select at least one recipient');
      return;
    }

    if (!subject.trim()) {
      ErrorMessageToast('Please enter a subject');
      return;
    }

    if (!emailBody.trim()) {
      ErrorMessageToast('Please enter email content');
      return;
    }

    setIsSending(true);
    try {
      const selectedRecipients = recipients.filter(r => r.isSelected);
      const payload: BulkEmailPayload = {
        
        recipients: selectedRecipients.map(r => r.email),
        subject,
        text: emailBody
      };

      await sendBulkEmail(Number(eventId), payload);
      SuccesfulMessageToast(`Emails sent successfully to ${selectedCount} participants!`);
      onClose();
    } catch (error) {
      ErrorMessageToast('Failed to send emails. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center overflow-hidden justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh]  flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 pb-1 rounded-t-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#1E3A5F] flex items-center gap-2">
                  <Mail className="w-6 h-6" />
                  Send Bulk Email
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {eventData?.title} • {totalCount} participants
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Selection */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handleTemplateChange('custom')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  template === 'custom'
                    ? 'bg-[#1E3A5F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Custom
              </button>
              <button
                onClick={() => handleTemplateChange('reminder')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  template === 'reminder'
                    ? 'bg-[#1E3A5F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Event Reminder
              </button>
              <button
                onClick={() => handleTemplateChange('update')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  template === 'update'
                    ? 'bg-[#1E3A5F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Event Update
              </button>
              <button
                onClick={() => handleTemplateChange('confirmation')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  template === 'confirmation'
                    ? 'bg-[#1E3A5F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Registration Confirmation
              </button>
            </div>

            {/* Subject Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                placeholder="Enter email subject"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left Column - Recipients */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search participants..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedFilter('ALL')}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedFilter === 'ALL'
                          ? 'bg-[#1E3A5F] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All ({totalCount})
                    </button>
                    <button
                      onClick={() => setSelectedFilter('SELECTED')}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedFilter === 'SELECTED'
                          ? 'bg-[#1E3A5F] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Selected ({selectedCount})
                    </button>
                  </div>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-[#1E3A5F] hover:underline"
                  >
                    {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>

              {/* Recipients List */}
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1E3A5F]"></div>
                  </div>
                ) : filteredRecipients.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No participants found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredRecipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          recipient.isSelected
                            ? 'border-[#1E3A5F] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleSelectRecipient(recipient.id)}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                          recipient.isSelected
                            ? 'bg-[#1E3A5F] border-[#1E3A5F]'
                            : 'border-gray-300'
                        }`}>
                          {recipient.isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {recipient.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {recipient.email}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          recipient.registrationStatus === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : recipient.registrationStatus === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {recipient.registrationStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Email Editor */}
            <div className="w-2/3 flex flex-col overflow">
              {/* Email Editor Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Email Content</h3>
                  <p className="text-sm text-gray-500">
                    {selectedCount} recipient{selectedCount !== 1 ? 's' : ''} selected
                  </p>
                </div>
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {isPreview ? 'Edit' : 'Preview'}
                </button>
              </div>

              {/* Email Editor/Preview */}
              <div className="flex-1 h-full  overflow-hidden">
                {isPreview ? (
                  <div className="h-full inset-0 overflow-y-auto p-6 bg-gray-50">
                    <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
                      <div className="border-b border-gray-200 pb-4 mb-6">
                        <p className="text-sm text-gray-500">To: {selectedCount} recipient{selectedCount !== 1 ? 's' : ''}</p>
                        <h2 className="text-xl font-bold text-gray-900 mt-2">{subject}</h2>
                      </div>
                      <div className="prose max-w-none">
                        {emailBody.split('\n').map((line, index) => (
                          <p key={index} className="mb-4 text-gray-700">
                            {line}
                          </p>
                        ))}
                      </div>
                     
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full h-full p-6 border-none focus:ring-0 resize-none font-mono text-sm"
                    placeholder="Write your email content here...
                    
You can use placeholders like:
• {participant_name} - Participant's name
• {event_title} - Event title
• {event_date} - Event date
• {meeting_time} - Meeting time
• {location} - Event location"
                    rows={15}
                  />
                )}
              </div>

              {/* Editor Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendEmails}
                      disabled={isSending || selectedCount === 0}
                      className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send to {selectedCount} Participant{selectedCount !== 1 ? 's' : ''}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkEmailModal;