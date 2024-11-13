import { DashboardHeader } from "./components/dashboard-header";
import { DashboardNav } from "./components/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full bg-skin-primary">
      <DashboardHeader />
      <DashboardNav />
      {children}
    </div>
  );
}
