import { useState } from "react";
import { Outlet } from "react-router";
import { Menu, Bell, LogOut } from "lucide-react";
import AdminSidebar from "./AdminSideBar";
export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 shadow-xs">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Store Administration
            </h2>
            <p className="text-sm font-semibold text-slate-900 -mt-0.5">
              Rajnish
            </p>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Admin avatar & logout */}
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-semibold">
                R
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  Rajnish
                </p>
                <p className="text-xs text-slate-500">rnish612@gmail.com</p>
              </div>
              <button
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
