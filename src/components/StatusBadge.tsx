
import React from 'react';
import { ApprovalStatus } from '../types';

interface StatusBadgeProps {
  status: ApprovalStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-sm font-bold rounded-full inline-block';

  const styles = {
    [ApprovalStatus.APPROVED]: 'bg-green-100 text-green-800',
    [ApprovalStatus.REJECTED]: 'bg-red-100 text-red-800',
    [ApprovalStatus.MANUAL_REVIEW]: 'bg-yellow-100 text-yellow-800',
    [ApprovalStatus.PENDING]: 'bg-slate-100 text-slate-800',
  };

  const text = {
    [ApprovalStatus.APPROVED]: 'Approved',
    [ApprovalStatus.REJECTED]: 'Rejected',
    [ApprovalStatus.MANUAL_REVIEW]: 'Manual Review',
    [ApprovalStatus.PENDING]: 'Pending',
  };

  return (
    <span className={`${baseClasses} ${styles[status]}`}>
      {text[status]}
    </span>
  );
};
