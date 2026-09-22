# CollectionHub

A full-stack **Loan Collection & Follow-up Management System** built for a finance-domain workflow.

CollectionHub helps collection teams manage loan accounts, track principal outstanding, identify overdue accounts using DPD, and maintain follow-up history from a centralized workspace.

---

## Overview

Collection teams need a simple way to monitor loan accounts, identify overdue cases, and keep track of collection activities.

CollectionHub provides a focused workflow for:

- Loan account management
- Loan CRUD operations
- Principal outstanding tracking
- Due-date monitoring
- DPD calculation
- Automatic overdue identification
- Follow-up management
- Follow-up history
- Portfolio dashboard
- Search and status filtering
- Responsive collection-management UI

The application was intentionally scoped as a **one-day finance-domain MVP**, focusing on the core business workflow instead of adding unnecessary complexity.

---

## Core Workflow

```text
                    Loan Account
                         |
                         v
                     Due Date
                         |
              ┌──────────┴──────────┐
              |                     |
              v                     v
       Due Date Upcoming       Due Date Passed
              |                     |
              v                     v
           ACTIVE                OVERDUE
                                    |
                                    v
                              DPD Calculation
                                    |
                                    v
                            Follow-up Activity
                                    |
                                    v
                             Follow-up History