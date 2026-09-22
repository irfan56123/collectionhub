import { z } from 'zod';

export const createFollowUpSchema = z.object({
  channel: z.enum(['CALL', 'WHATSAPP', 'SMS', 'EMAIL']),
  status: z.enum([
    'CONTACTED',
    'NO_RESPONSE',
    'PTP',
    'PAYMENT_RECEIVED',
  ]),
  notes: z.string().max(500).optional(),
  followUpDate: z.coerce.date(),
});

export const updateFollowUpSchema = createFollowUpSchema.partial();

export type CreateFollowUpInput = z.infer<typeof createFollowUpSchema>;