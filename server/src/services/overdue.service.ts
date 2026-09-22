import { prisma } from '../config/prisma';

export function calculateDpd(
  dueDate: Date,
  status: string,
): number {
  if (status === 'PAID' || status === 'CLOSED') {
    return 0;
  }

  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const difference =
    today.getTime() - due.getTime();

  return Math.max(
    0,
    Math.floor(
      difference / (1000 * 60 * 60 * 24),
    ),
  );
}

export async function processOverdueLoan(
  loanId: string,
) {
  const loan =
    await prisma.loanAccount.findUnique({
      where: {
        id: loanId,
      },
    });

  if (!loan) {
    throw new Error('Loan account not found');
  }

  const dpd = calculateDpd(
    loan.dueDate,
    loan.status,
  );

  // Not overdue
  if (dpd === 0) {
    return loan;
  }

  // Don't process completed accounts
  if (
    loan.status === 'PAID' ||
    loan.status === 'CLOSED'
  ) {
    return loan;
  }

  // Mark account as overdue
  const updatedLoan =
    await prisma.loanAccount.update({
      where: {
        id: loanId,
      },
      data: {
        status: 'OVERDUE',
      },
    });

  // Today's date range
  const today = new Date();

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // Check if automatic follow-up already exists
  const existingFollowUp =
    await prisma.followUp.findFirst({
      where: {
        loanAccountId: loanId,
        followUpDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        notes:
          'Automatic follow-up created because the loan is overdue.',
      },
    });

  // Create only one automatic follow-up per day
  if (!existingFollowUp) {
    await prisma.followUp.create({
      data: {
        loanAccountId: loanId,
        channel: 'CALL',
        status: 'NO_RESPONSE',
        notes:
          'Automatic follow-up created because the loan is overdue.',
        followUpDate: today,
      },
    });
  }

  return updatedLoan;
}