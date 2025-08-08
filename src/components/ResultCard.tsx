
import React from 'react';
import { ApprovalResponse, ApprovalStatus } from '../types';
import { StatusBadge } from './StatusBadge';

interface ResultCardProps {
  result: ApprovalResponse;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const colorClasses = {
    [ApprovalStatus.APPROVED]: 'bg-green-50 border-green-500',
    [ApprovalStatus.REJECTED]: 'bg-red-50 border-red-500',
    [ApprovalStatus.MANUAL_REVIEW]: 'bg-yellow-50 border-yellow-500',
    [ApprovalStatus.PENDING]: 'bg-slate-50 border-slate-500',
  };

  return (
    <div className={`p-6 rounded-lg border-l-4 shadow-lg transition-all duration-300 ${colorClasses[result.decision]}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <StatusBadge status={result.decision} />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-bold text-slate-800">
            AI Agent Decision
          </h3>
          <p className="mt-2 text-slate-600">
            {result.reason}
          </p>
        </div>
      </div>
    </div>
  );
};
