import { Router } from 'express';

import {
  createFollowUp,
  deleteFollowUp,
  getFollowUps,
  updateFollowUp,
} from '../controllers/followup.controller';

export const followUpRoutes = Router();

// Loan-specific follow-ups
followUpRoutes.get(
  '/loans/:loanId/followups',
  getFollowUps,
);

followUpRoutes.post(
  '/loans/:loanId/followups',
  createFollowUp,
);

// Follow-up specific operations
followUpRoutes.patch(
  '/followups/:id',
  updateFollowUp,
);

followUpRoutes.delete(
  '/followups/:id',
  deleteFollowUp,
);