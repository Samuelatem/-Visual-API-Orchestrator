import React, { createContext, useContext, useState, useCallback } from 'react';

export type FeedbackType = 'success' | 'error' | null;

export interface FeedbackState {
  type: FeedbackType;
  message: string;
}

interface FeedbackContextType {
  feedback: FeedbackState;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  clearFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [feedback, setFeedback] = useState<FeedbackState>({
    type: null,
    message: '',
  });

  const showSuccess = useCallback((message: string) => {
    setFeedback({ type: 'success', message });
  }, []);

  const showError = useCallback((message: string) => {
    setFeedback({ type: 'error', message });
  }, []);

  const clearFeedback = useCallback(() => {
    setFeedback({ type: null, message: '' });
  }, []);

  return (
    <FeedbackContext.Provider value={{ feedback, showSuccess, showError, clearFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackContextType {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return context;
}
