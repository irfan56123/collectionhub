import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import DashboardPage from "../pages/DashboardPage";
import { LoansPage } from '../pages/LoansPage';
import LoanDetailsPage from "../pages/LoanDetailsPage";
import { NotFoundPage } from '../pages/NotFoundPage';
import CreateLoanPage from "../pages/CreateLoanPage";
import EditLoanPage from "../pages/EditLoanPage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/loans/new" element={<CreateLoanPage />} />
          <Route path="/loans/new" element={<CreateLoanPage />} />

<Route
  path="/loans/:id/edit"
  element={<EditLoanPage />}
/>

<Route
  path="/loans/:id"
  element={<LoanDetailsPage />}
/>
          <Route path="/loans/:id" element={<LoanDetailsPage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
