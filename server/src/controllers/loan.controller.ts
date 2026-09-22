import type { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { createLoanSchema } from '../validators/loan.validator';
import {
  calculateDpd,
  processOverdueLoan,
} from '../services/overdue.service';

function getParamId(req: Request): string {
  const id = req.params.id;

  return Array.isArray(id) ? id[0] : id;
}

// GET /api/loans
export async function getLoans(
  _req: Request,
  res: Response,
) {
  try {
    // Check all loans for overdue status
    const allLoans = await prisma.loanAccount.findMany({
      select: {
        id: true,
      },
    });

    // Process overdue accounts
    for (const loan of allLoans) {
      await processOverdueLoan(loan.id);
    }

    // Fetch updated loans
    const loans = await prisma.loanAccount.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    const data = loans.map((loan) => ({
      ...loan,
      loanAmount: Number(loan.loanAmount),
      principalOutstanding: Number(loan.principalOutstanding),
      dpd: calculateDpd(loan.dueDate, loan.status),
    }));

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Get loans error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch loan accounts',
    });
  }
}

// GET /api/loans/:id
export async function getLoanById(
  req: Request,
  res: Response,
) {
  try {
    const id = getParamId(req);

    // Process overdue logic before fetching the account
    await processOverdueLoan(id);

    const loan = await prisma.loanAccount.findUnique({
      where: {
        id,
      },
      include: {
        followUps: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan account not found',
      });
    }

    return res.json({
      success: true,
      data: {
        ...loan,
        loanAmount: Number(loan.loanAmount),
        principalOutstanding: Number(loan.principalOutstanding),
        dpd: calculateDpd(
          loan.dueDate,
          loan.status,
        ),
      },
    });
  } catch (error) {
    console.error('Get loan error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch loan account',
    });
  }
}

// POST /api/loans
export async function createLoan(
  req: Request,
  res: Response,
) {
  try {
    const result = createLoanSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid loan data',
        errors: result.error.flatten(),
      });
    }

    const {
      accountNumber,
      borrowerName,
      loanAmount,
      principalOutstanding,
      dueDate,
    } = result.data;

    // Check duplicate account number
    const existingLoan =
      await prisma.loanAccount.findUnique({
        where: {
          accountNumber,
        },
      });

    if (existingLoan) {
      return res.status(409).json({
        success: false,
        message: 'Loan account number already exists',
      });
    }

    const loan = await prisma.loanAccount.create({
      data: {
        accountNumber,
        borrowerName,
        loanAmount,
        principalOutstanding,
        dueDate,
      },
    });

    // If the newly created loan is already overdue,
    // process the overdue workflow immediately.
    await processOverdueLoan(loan.id);

    // Fetch the final updated loan
    const updatedLoan =
      await prisma.loanAccount.findUnique({
        where: {
          id: loan.id,
        },
      });

    if (!updatedLoan) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch created loan account',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Loan account created successfully',
      data: {
        ...updatedLoan,
        loanAmount: Number(
          updatedLoan.loanAmount,
        ),
        principalOutstanding: Number(
          updatedLoan.principalOutstanding,
        ),
        dpd: calculateDpd(
          updatedLoan.dueDate,
          updatedLoan.status,
        ),
      },
    });
  } catch (error) {
    console.error('Create loan error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create loan account',
    });
  }
}

// PATCH /api/loans/:id
export async function updateLoan(
  req: Request,
  res: Response,
) {
  try {
    const id = getParamId(req);

    const existingLoan =
      await prisma.loanAccount.findUnique({
        where: {
          id,
        },
      });

    if (!existingLoan) {
      return res.status(404).json({
        success: false,
        message: 'Loan account not found',
      });
    }

    const result =
      createLoanSchema.partial().safeParse(
        req.body,
      );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid loan data',
        errors: result.error.flatten(),
      });
    }

    const loan = await prisma.loanAccount.update({
      where: {
        id,
      },
      data: result.data,
    });

    // Re-check overdue status after update
    await processOverdueLoan(loan.id);

    const updatedLoan =
      await prisma.loanAccount.findUnique({
        where: {
          id,
        },
      });

    if (!updatedLoan) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch updated loan account',
      });
    }

    return res.json({
      success: true,
      message: 'Loan account updated successfully',
      data: {
        ...updatedLoan,
        loanAmount: Number(
          updatedLoan.loanAmount,
        ),
        principalOutstanding: Number(
          updatedLoan.principalOutstanding,
        ),
        dpd: calculateDpd(
          updatedLoan.dueDate,
          updatedLoan.status,
        ),
      },
    });
  } catch (error) {
    console.error('Update loan error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update loan account',
    });
  }
}

// DELETE /api/loans/:id
export async function deleteLoan(
  req: Request,
  res: Response,
) {
  try {
    const id = getParamId(req);

    const existingLoan =
      await prisma.loanAccount.findUnique({
        where: {
          id,
        },
      });

    if (!existingLoan) {
      return res.status(404).json({
        success: false,
        message: 'Loan account not found',
      });
    }

    await prisma.loanAccount.delete({
      where: {
        id,
      },
    });

    return res.json({
      success: true,
      message: 'Loan account deleted successfully',
    });
  } catch (error) {
    console.error('Delete loan error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete loan account',
    });
  }
}