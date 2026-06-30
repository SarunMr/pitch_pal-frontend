import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserCog } from "lucide-react";
import { fetchUserByIdAction } from "@/lib/actions/admin-user.actions";
import { ROUTES } from "@/constants/routes";
import EditUserForm from "../../_components/EditUserForm";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditUserPageProps) {
  const { id } = await params;
  return {
    title: `Edit User ${id} | PitchPal Admin`,
  };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const result = await fetchUserByIdAction(id);

  if (!result?.success || !result?.data) {
    notFound();
  }

  const user = result.data;

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
            <UserCog size={17} className="text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Edit User</h1>
            <p className="text-xs text-muted-foreground truncate max-w-xs">
              {user.username} &middot; {user.email}
            </p>
          </div>
        </div>

        <EditUserForm
          userId={user._id}
          defaultValues={{
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            phone: user.phone,
            role: user.role,
            status: user.status,
          }}
        />
      </div>
    </div>
  );
}
