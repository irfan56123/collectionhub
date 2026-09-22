import { z } from 'zod';

export const createLoanSchema = z.object({
  accountNumber: z.string().min(3),
  borrowerName: z.string().min(2),
  loanAmount: z.number().positive(),
  principalOutstanding: z.number().nonnegative(),
  dueDate: z.coerce.date(),
});

export type CreateLoanInput = z.infer<typeof createLoanSchema>;
