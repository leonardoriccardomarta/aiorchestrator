import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use EmailJS to send real email
      const templateParams = {
        to_email: 'aiorchestratoor@gmail.com',
        name: email.split('@')[0] || 'User', // Extract name from email
        email: email,
        company: company || 'N/A',
        rating: `${rating}/5 stars - ${rating === 1 && 'Poor' || rating === 2 && 'Fair' || rating === 3 && 'Good' || rating === 4 && 'Very Good' || rating === 5 && 'Excellent'}`,
        selected_questions: selectedQuestions.length > 0 ? selectedQuestions.join(', ') : 'No specific questions selected',
        feedback: feedback || 'No feedback provided',
        additional_feedback: additionalFeedback || 'N/A',
        date: new Date().toLocaleString(),
        subject: `AI Orchestrator Feedback - ${email} (${company || 'No Company'})`
      };

      // Use EmailJS to send real email
      const result = await emailjs.send(
        'service_g5b6agg', // Your service ID
        'template_ud03qpg', // Your template ID
        templateParams,
        'LtNUIsmmmJZfVgnHg' // Your Public Key
      );

      console.log('EmailJS result:', result);

      if (result.status === 200) {
        onSuccess();
        onClose();

        // Reset form
        setRating(0);
        setFeedback('');
        setEmail('');
        setCompany('');
        setSelectedQuestions([]);
        setAdditionalFeedback('');
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending feedback. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] sm:max-h-[70vh] overflow-y-auto p-4 sm:p-6 shadow-2xl">
        <div className="text-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">💬 Help us improve AI Orchestrator</h3>
          <p className="text-xs sm:text-sm text-gray-600">Your feedback helps us build the perfect AI automation platform</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              How would you rate this demo?
            </label>
            <div className="flex justify-center space-x-1 sm:space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 text-xl sm:text-2xl transition-all duration-200 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                  }`}
                >
                  
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Questions */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What interests you most? (Select up to 3)
              </label>
              <div className="grid grid-cols-1 gap-1 sm:gap-2">
                {[
                  'Pricing and plans',
                  'Integration capabilities',
                  'AI model customization',
                  'Team collaboration features',
                  'Security and compliance',
                  'Custom workflow creation'
                ].map((question) => (
                  <label key={question} className="flex items-center py-1">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question)}
                      onChange={(e) => {
                        if (e.target.checked && selectedQuestions.length < 3) {
                          setSelectedQuestions([...selectedQuestions, question]);
                        } else if (!e.target.checked) {
                          setSelectedQuestions(selectedQuestions.filter(q => q !== question));
                        }
                      }}
                      className="mr-2 sm:mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">{question}</span>
                  </label>
                ))}
              </div>
            </div>

          {/* Feedback */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What did you like most? What could be improved?
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us what impressed you and what we can improve..."
              rows={3}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email for early access <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              required
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              title="Please enter a valid email address"
            />
          </div>

          {/* Company */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company (optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Company"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!email || isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback & Join Early Access'}
            </button>
          </div>

          {/* Early Access Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2"> Get Early Access</h3>
              <p className="text-sm text-blue-700 mb-3">
                Be the first to experience AI Orchestrator when we launch!
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                <p> Free for 6 months</p>
                <p> Priority support</p>
                <p> Direct input on features</p>
                <p> Exclusive launch event invite</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
