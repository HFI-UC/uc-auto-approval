import React from 'react';

interface JsonInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPasteExample: () => void;
}

export const JsonInput: React.FC<JsonInputProps> = ({ value, onChange, onPasteExample }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="json-input" className="font-bold text-slate-700">
          Reservation Request (JSON)
        </label>
        <button
          onClick={onPasteExample}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          Paste Example
        </button>
      </div>
      <textarea
        id="json-input"
        value={value}
        onChange={onChange}
        rows={15}
        className="w-full p-3 font-mono text-sm bg-slate-100 rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        placeholder="Paste your JSON reservation request here..."
      />
    </div>
  );
};