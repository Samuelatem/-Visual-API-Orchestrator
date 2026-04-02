import { useEffect } from 'react';
import { CheckCircleIcon, ErrorIcon, CloseIcon } from './Icons';
import { useFeedback } from '../context/FeedbackContext';
import './FeedbackBar.css';

export default function FeedbackBar() {
  const { feedback, clearFeedback } = useFeedback();

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (feedback.type !== null) {
      const timer = setTimeout(() => {
        clearFeedback();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback.type, clearFeedback]);

  if (feedback.type === null) {
    return null;
  }

  const isSuccess = feedback.type === 'success';

  return (
    <div
      className={`feedback-bar ${isSuccess ? 'feedback-bar-success' : 'feedback-bar-error'}`}
      role="alert"
      aria-live="polite"
    >
      <div className="feedback-content">
        {isSuccess ? (
          <CheckCircleIcon className="feedback-icon" />
        ) : (
          <ErrorIcon className="feedback-icon" />
        )}
        <span className="feedback-message">{feedback.message}</span>
      </div>
      <button
        className="feedback-close"
        onClick={clearFeedback}
        aria-label="Close notification"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
