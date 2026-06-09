import { getUserData } from "@/lib/cookie";
import { TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default async function DashboardPage() {
  const user = await getUserData();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-6 max-w-md w-full">
        {/* Logo mark */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <TrendingUp size={28} className="text-primary-foreground stroke-[2.5]" />
          </div>
        </div>

        {/* Welcome text */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Welcome back
          </p>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Hey, {user.username} 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            You are signed in as{" "}
            <span className="font-semibold text-foreground">{user.email}</span>
            {" "}·{" "}
            <span className="capitalize font-semibold text-primary">{user.role}</span>
          </p>
        </div>

        {/* Placeholder card */}
        <div className="border border-border rounded-2xl p-6 bg-card text-left space-y-2 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Dashboard
          </p>
          <p className="text-sm text-muted-foreground">
            Your PitchPal workspace is ready. More features coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
