// components/hiker/ReviewModal.tsx
import { useState} from 'react';
import { X, Star, Image as  AlertCircle} from 'lucide-react';
import type { PendingReview, Review } from '../../../types/HikerTypes';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingReview?: PendingReview | null;
  existingReview?: Review | null;
  onSubmit: (data: { rating: number; comment: string; images?: string[] }) => void;
  isSubmitting: boolean;
}

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  pendingReview, 
  existingReview, 
  onSubmit, 
  isSubmitting 
}: ReviewModalProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [hoverRating, setHoverRating] = useState(0);



  const handleSubmit = () => {
  if (!rating) return alert('Please select a rating');
  if (!comment.trim()) return alert('Please write a review');
  
  onSubmit({ rating, comment: comment.trim() });
};

  const getTitle = () => {
    if (existingReview) return 'Edit Your Review';
    if (pendingReview) return `Review: ${pendingReview.eventTitle}`;
    return 'Write a Review';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#1E3A5F] to-[#2a4a7a] rounded-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
                {pendingReview && (
                  <p className="text-sm text-gray-600 mt-1">{pendingReview.organizerName}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Event Info (for new reviews) */}
          {pendingReview && !existingReview && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={pendingReview.eventImage}
                    alt={pendingReview.eventTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{pendingReview.eventTitle}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    Completed on {new Date(pendingReview.completedDate).toLocaleDateString()}
                  </div>
                  {pendingReview.daysUntilExpiry <= 7 && (
                    <div className="flex items-center gap-1 text-sm text-orange-600 mt-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Review expires in {pendingReview.daysUntilExpiry} days</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto max-h-[35vh] p-6">
            <div className="space-y-6">
              {/* Rating Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Overall Rating
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                      disabled={isSubmitting}
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-4 text-lg font-medium text-gray-900">
                    {hoverRating || rating || 0}/5
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Your Review
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience... What did you like? What could be improved?"
                  className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent resize-none"
                  disabled={isSubmitting}
                />
                <div className="text-xs text-gray-500 mt-2">
                  {comment.length}/1000 characters
                </div>
              </div>

              {/* Tips for Good Review */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for a great review:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Mention specific highlights of your experience</li>
                  <li>• Be honest about what you enjoyed and what could improve</li>
                  <li>• Include details about the guide, organization, and scenery</li>
                  <li>• Photos help other hikers visualize the trek</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !rating || !comment.trim()}
              className="px-6 py-2 bg-gradient-to-r from-[#1E3A5F] to-[#2a4a7a] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Star className="w-4 h-4" />
                  {existingReview ? 'Update Review' : 'Submit Review'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewModal;