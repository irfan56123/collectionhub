import { Router } from 'express';

import {
  createLoan,
  deleteLoan,
  getLoanById,
  getLoans,
  updateLoan,
} from '../controllers/loan.controller';

export const loanRoutes = Router();

loanRoutes.get('/', getLoans);

loanRoutes.get('/:id', getLoanById);

loanRoutes.post('/', createLoan);

loanRoutes.patch('/:id', updateLoan);

loanRoutes.delete('/:id', deleteLoan);