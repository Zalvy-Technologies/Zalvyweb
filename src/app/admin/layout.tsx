import { type ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata = {
  title: "Admin Operations Dashboard | Zalvy Platform",
  description:
    "Enterprise administration, observability, and system operations center for Zalvy.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-canvas text-foreground flex h-screen w-full overflow-hidden font-sans antialiased transition-colors">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="custom-scrollbar flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}