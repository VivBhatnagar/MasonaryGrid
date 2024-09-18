import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

// Define the Props for ErrorBoundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Fallback Component
const FallbackComponent: React.FC<{ error: Error }> = ({ error }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
  </div>
);

// ErrorBoundary Component
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ReactErrorBoundary>
  );
};

export { ErrorBoundary };
