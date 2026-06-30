import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <DashboardNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <DashboardFooter />
    </div>
  );
}
