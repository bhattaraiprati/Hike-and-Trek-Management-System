import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Calendar, MapPin, Users, CreditCard, Download, User, Mail, Phone, ShieldCheck, Clock, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchBookingDetails } from '../../api/services/Event';
import { registerUserToChatRoom } from '../../api/services/chatApi';
import { ErrorMessageToast } from '../../utils/Toastify.util';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Define the exact shape from your backend
export interface EventRegistrationResponse {
  bookingId: number;
  bookingDate: string;
  bookingStatus: string;
  totalAmount: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  qrCodeUrl: string;

  event: {
    id: number;
    title: string;
    description: string;
    location: string;
    date: string; // ISO date
    durationDays: number;
    difficultyLevel: string;
    price: number;
    bannerImageUrl: string;
    meetingPoint: string;
    meetingTime: string;
    organizer: {
      name: string;
      contactPerson: string;
      contactEmail: string;
      phone: string;
    };
  };

  participants: Array<{
    title: string;
    fullName: string;
    nationality: string;
    gender: string;
  }>;

  payment: {
    method: string;
    transactionId: string;
    amount: number;
    paidAt: string;
    status: string;
  };
}


const BookingConfirmationPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<EventRegistrationResponse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => fetchBookingDetails(Number(bookingId)),
    enabled: !!bookingId,
    retry: 1,
  });

  useEffect(() => {
    if (data) {
      setBooking(data);
    }
  }, [data]);

  const handleDownload = async () => {
    if (!pdfRef.current || !booking) return;

    setIsDownloading(true);
    try {
      // Create a clone of the element to modify for PDF
      const element = pdfRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f9fafb'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      // Download the PDF
      pdf.save(`Booking-BK${String(booking.bookingId).padStart(6, '0')}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      ErrorMessageToast('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleChatRoom = async () => {
    registerUserToChatRoom(booking?.event.id!).then(() => {
      navigate(`/hiker-dashboard/messages`);
    }).catch(() => {
      ErrorMessageToast("Failed to open chat room. Please try again.");
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    const m = method?.toLowerCase() || '';
    switch (m) {
      case 'esewa': return 'eSewa';
      case 'stripe': return 'Stripe';
      default: return 'Payment';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString?.split(':') ?? ['00', '00'];
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Booking Not Found</h2>
          <button
            onClick={() => navigate('/hiker-dashboard')}
            className="text-[#1E3A5F] hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Action Buttons - Outside PDF area */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> 
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
          
          <button 
            onClick={handleChatRoom} 
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Open Chat
          </button>
          <button 
            onClick={() => navigate('/hiker-dashboard/my-bookings')} 
            className="px-6 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a]"
          >
            My Bookings
          </button>
        </div>

        {/* PDF Content Area */}
        <div ref={pdfRef}>
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 text-lg">
              Your trek to <span className="font-semibold">{booking.event?.title}</span> is confirmed
            </p>
            <div className="mt-4 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              Booking ID: BK{String(booking.bookingId).padStart(6, '0')}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="h-64 bg-gray-200">
                  <img src={booking.event?.bannerImageUrl} alt={booking.event?.title} className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4">{booking.event?.title}</h2>
                  <p className="text-gray-600 mb-6">{booking.event?.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="font-medium">{formatDate(booking.event?.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium">{booking.event?.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="font-medium">{booking.event?.durationDays} days</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Difficulty</div>
                        <div className="font-medium">{booking.event?.difficultyLevel}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Meeting Details</h4>
                    <p><strong>Time:</strong> {formatTime(booking.event?.meetingTime)}</p>
                    <p><strong>Point:</strong> {booking.event?.meetingPoint}</p>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Participants ({booking.participants?.length})</h3>
                <div className="space-y-3">
                  {booking.participants?.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white font-bold">
                          {p.title.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{p.fullName}</div>
                          <div className="text-sm text-gray-600">{p.gender} • {p.nationality}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Info */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-[#1E3A5F] mb-6 pb-2 border-b border-gray-200">
                  Billing Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Contact Person</div>
                        <div className="font-medium">{booking?.contactName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Contact Phone</div>
                        <div className="font-medium">{booking?.contactPhone}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Contact Email</div>
                        <div className="font-medium">{booking?.contactEmail}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Important
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Arrive 30 mins early</li>
                  <li>• Bring required gear</li>
                  <li>• Contact organizer if delayed</li>
                </ul>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-600">Booking ID</span><span className="font-mono">BK{String(booking.bookingId).padStart(6, '0')}</span></div>
                  <div className="flex justify-between gap-12"><span className="text-gray-600">Date</span><span>{formatDate(booking.bookingDate)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Status</span><span className="text-green-600 font-medium">Confirmed</span></div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Paid</span>
                      <span className="text-[#1E3A5F]">NPR {booking.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Payment Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {booking.payment?.method === 'stripe' && <CreditCard className="w-5 h-5 text-gray-600" />}
                      {booking.payment?.method === 'esewa' && <img src="https://p7.hiclipart.com/preview/261/608/1001/esewa-zone-office-bayalbas-google-play-iphone-iphone.jpg" alt="eSewa" className="w-5 h-5" crossOrigin="anonymous" />}
                      <div>
                        <div className="text-sm text-gray-500">Method</div>
                        <div className="font-medium">{getPaymentMethodIcon(booking.payment?.method)}</div>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Paid</span>
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Transaction ID</span><span className="font-mono">{booking.payment?.transactionId}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Paid On</span><span>{formatDate(booking.payment?.paidAt)}</span></div>
                  </div>
                </div>
              </div>

              {/* Organizer */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Organizer</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>{booking.event?.organizer.name}</strong></div>
                  <div>Contact: {booking.event?.organizer.contactPerson}</div>
                  <div>Email: <a href={`mailto:${booking.event?.organizer.contactEmail}`} className="text-[#1E3A5F]">{booking.event?.organizer?.contactEmail}</a></div>
                  {booking.event?.organizer?.phone && <div>Phone: {booking.event.organizer?.phone}</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-gray-600">
            <p>A confirmation email has been sent to <strong>{booking.contactEmail}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;