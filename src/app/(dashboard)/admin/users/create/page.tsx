import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import CreateUserForm from "../_components/CreateUserForm";

export const metadata = {
  title: "Create User | PitchPal Admin",
  description: "Create a new PitchPal user account.",
};

export default function CreateUserPage() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Back link */}
      <Link
        href={ROUTES.ADMIN_USERS}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Users
      </Link>

      {/* Card */}
      <div className="rounded-xl border border-border bg-white shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <UserPlus size={17} className="text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Create New User</h1>
            <p className="text-xs text-muted-foreground">
              The user will be able to log in immediately after creation.
            </p>
          </div>
        </div>

        <CreateUserForm />
      </div>
    </div>
  );
}
