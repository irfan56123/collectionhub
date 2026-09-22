import type { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import {
  createFollowUpSchema,
  updateFollowUpSchema,
} from '../validators/followup.validator';

function getParamId(req: Request, key: string): string {
  const value = req.params[key];

  return Array.isArray(value) ? value[0] : value;
}

// GET /api/loans/:loanId/followups
export async function getFollowUps(
  req: Request,
  res: Response,
) {
  try {
    const loanId = getParamId(req, 'loanId');

    const loan = await prisma.loanAccount.findUnique({
      where: { id: loanId },
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan account not found',
      });
    }

    const followUps = await prisma.followUp.findMany({
      where: { loanAccountId: loanId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      success: true,
      data: followUps,
    });
  } catch (error) {
    console.error('Get follow-ups error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch follow-ups',
    });
  }
}

// POST /api/loans/:loanId/followups
export async function createFollowUp(
  req: Request,
  res: Response,
) {
  try {
    const loanId = getParamId(req, 'loanId');

    const loan = await prisma.loanAccount.findUnique({
      where: { id: loanId },
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan account not found',
      });
    }

    const result = createFollowUpSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid follow-up data',
        errors: result.error.flatten(),
      });
    }

    const followUp = await prisma.followUp.create({
      data: {
        loanAccountId: loanId,
        channel: result.data.channel,
        status: result.data.status,
        notes: result.data.notes,
        followUpDate: result.data.followUpDate,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Follow-up created successfully',
      data: followUp,
    });
  } catch (error) {
    console.error('Create follow-up error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create follow-up',
    });
  }
}

// PATCH /api/followups/:id
export async function updateFollowUp(
  req: Request,
  res: Response,
) {
  try {
    const id = getParamId(req, 'id');

    const existingFollowUp = await prisma.followUp.findUnique({
      where: { id },
    });

    if (!existingFollowUp) {
      return res.status(404).json({
        success: false,
        message: 'Follow-up not found',
      });
    }

    const result = updateFollowUpSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid follow-up data',
        errors: result.error.flatten(),
      });
    }

    const followUp = await prisma.followUp.update({
      where: { id },
      data: result.data,
    });

    return res.json({
      success: true,
      message: 'Follow-up updated successfully',
      data: followUp,
    });
  } catch (error) {
    console.error('Update follow-up error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update follow-up',
    });
  }
}

// DELETE /api/followups/:id
export async function deleteFollowUp(
  req: Request,
  res: Response,
) {
  try {
    const id = getParamId(req, 'id');

    const existingFollowUp = await prisma.followUp.findUnique({
      where: { id },
    });

    if (!existingFollowUp) {
      return res.status(404).json({
        success: false,
        message: 'Follow-up not found',
      });
    }

    await prisma.followUp.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Follow-up deleted successfully',
    });
  } catch (error) {
    console.error('Delete follow-up error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete follow-up',
    });
  }
}