import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-600">
          Classroom Reservation AI Agent
        </h1>
      </div>
    </header>
  );
};