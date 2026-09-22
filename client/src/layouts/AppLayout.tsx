import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "../components/common/Sidebar";
import { Header } from "../components/common/Header";

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleCloseSidebar() {
    setMobileOpen(false);
  }

  function handleOpenSidebar() {
    setMobileOpen(true);
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleCloseSidebar}
      />

      {/* Main application area */}
      <div className="min-h-screen lg:pl-64">
        {/* Top header */}
        <Header onMenuClick={handleOpenSidebar} />

        {/* Page content */}
        <main className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}