export type LoanStatus = 'ACTIVE' | 'OVERDUE' | 'PTP' | 'PAID' | 'CLOSED';

export type LoanAccount = {
  id: string;
  accountNumber: string;
  borrowerName: string;
  loanAmount: number;
  principalOutstanding: number;
  dueDate: string;
  dpd: number;
  status: LoanStatus;
};
