-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('ACTIVE', 'OVERDUE', 'PTP', 'PAID', 'CLOSED');

-- CreateEnum
CREATE TYPE "FollowUpChannel" AS ENUM ('CALL', 'WHATSAPP', 'SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "FollowUpStatus" AS ENUM ('CONTACTED', 'NO_RESPONSE', 'PTP', 'PAYMENT_RECEIVED');

-- CreateTable
CREATE TABLE "LoanAccount" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "borrowerName" TEXT NOT NULL,
    "loanAmount" DECIMAL(12,2) NOT NULL,
    "principalOutstanding" DECIMAL(12,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "loanAccountId" TEXT NOT NULL,
    "channel" "FollowUpChannel" NOT NULL,
    "status" "FollowUpStatus" NOT NULL,
    "notes" TEXT,
    "followUpDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoanAccount_accountNumber_key" ON "LoanAccount"("accountNumber");

-- CreateIndex
CREATE INDEX "LoanAccount_status_idx" ON "LoanAccount"("status");

-- CreateIndex
CREATE INDEX "LoanAccount_dueDate_idx" ON "LoanAccount"("dueDate");

-- CreateIndex
CREATE INDEX "FollowUp_loanAccountId_idx" ON "FollowUp"("loanAccountId");

-- CreateIndex
CREATE INDEX "FollowUp_followUpDate_idx" ON "FollowUp"("followUpDate");

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_loanAccountId_fkey" FOREIGN KEY ("loanAccountId") REFERENCES "LoanAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
