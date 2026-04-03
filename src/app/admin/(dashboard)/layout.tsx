import type { ReactNode } from "react";

import { AdminContentShell } from "@/components/layout/admin-content-shell";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { requireAdminPageUser } from "@/server/auth/require-admin-page-user";

type AdminDashboardLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const user = await requireAdminPageUser();

  return (
    <div className="min-h-screen overflow-x-clip bg-surface-subtle px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 lg:flex-row lg:items-start">
        <AdminSidebar userEmail={user.email} userRole={user.role} />
        <main className="min-w-0 flex-1 overflow-x-clip">
          <AdminContentShell>{children}</AdminContentShell>
        </main>
      </div>
    </div>
  );
}