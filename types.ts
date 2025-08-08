export enum ApprovalStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  PENDING = 'PENDING'
}

export interface ApprovalResponse {
  decision: ApprovalStatus;
  reason: string;
}