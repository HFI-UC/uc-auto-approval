
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { JsonInput } from './components/JsonInput';
import { ResultCard } from './components/ResultCard';
import { Loader } from './components/Loader';
import { ErrorAlert } from './components/ErrorAlert';
import { evaluateReservation } from './services/geminiService';
import { ApprovalResponse, ApprovalStatus } from './types';
import { EXAMPLE_JSON } from './constants';

const App: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(EXAMPLE_JSON);
  const [result, setResult] = useState<ApprovalResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let parsedJson;
      try {
        parsedJson = JSON.parse(jsonInput);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(`Invalid JSON format: ${errorMessage}. Please check for issues like trailing commas or incorrect quotes.`);
      }
      
      const response = await evaluateReservation(JSON.stringify(parsedJson));
      setResult(response);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [jsonInput]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Description removed as per request */}

          <JsonInput
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            onPasteExample={() => setJsonInput(EXAMPLE_JSON)}
          />

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !jsonInput}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              {isLoading ? 'Analyzing...' : 'Submit for Approval'}
            </button>
          </div>

          <div className="mt-8">
            {isLoading && <Loader />}
            {error && <ErrorAlert message={error} />}
            {result && !isLoading && <ResultCard result={result} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
