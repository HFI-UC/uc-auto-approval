
import { ApprovalResponse } from '../types';

export const evaluateReservation = async (requestJson: string): Promise<ApprovalResponse> => {
  try {
    const apiResponse = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // The backend expects a JSON object with a 'request' key
      body: JSON.stringify({ request: requestJson }),
    });

    if (!apiResponse.ok) {
      // Try to parse error message from backend, otherwise use status text
      const errorPayload = await apiResponse.json().catch(() => null);
      const errorMessage = errorPayload?.error || `Request failed with status: ${apiResponse.status}`;
      throw new Error(errorMessage);
    }

    // The backend should return the ApprovalResponse directly
    const result: ApprovalResponse = await apiResponse.json();
    return result;

  } catch (error: unknown) {
    console.error("Error communicating with backend service:", error);
    if (error instanceof Error) {
        // Re-throw the error to be handled by the UI component
        throw new Error(`Service communication error: ${error.message}`);
    }
    // Fallback for non-Error objects
    throw new Error("An unexpected error occurred while communicating with the backend service.");
  }
};
