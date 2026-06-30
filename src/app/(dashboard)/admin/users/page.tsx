import Link from "next/link";
import { Users, PlusCircle } from "lucide-react";
import { fetchUsersAction } from "@/lib/actions/admin-user.actions";
import { ROUTES } from "@/constants/routes";
import UserTable from "./_components/UserTable";
import UserSearchBar from "./_components/UserSearchBar";
import UserPagination from "./_components/UserPagination";

interface AdminUsersPageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    search?: string;
    role?: string;
    status?: string;
  }>;
}

export const metadata = {
  title: "User Management | PitchPal Admin",
  description: "Manage all PitchPal users — create, edit, suspend or delete accounts.",
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10) || 1;
  const limit = parseInt(params.size ?? "10", 10) || 10;
  const search = params.search ?? "";
  const role = params.role ?? "";
  const status = params.status ?? "";

  const result = await fetchUsersAction({
    page,
    limit,
    ...(search && { search }),
    ...(role && { role }),
    ...(status && { status }),
  });

  const users = result?.data ?? [];
  const meta = result?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 };
  const hasError = !result?.success;

  // Build current search params as plain object for the pagination component
  const currentParams: Record<string, string> = {
    ...(search && { search }),
    ...(role && { role }),
    ...(status && { status }),
    size: String(limit),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">User Management</h1>
            <p className="text-xs text-muted-foreground">
              {meta.total} {meta.total === 1 ? "user" : "users"} total
            </p>
          </div>
        </div>
        <Link
          id="create-user-link"
          href={ROUTES.ADMIN_USERS_CREATE}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <PlusCircle size={15} />
          New User
        </Link>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 flex-wrap">
        <UserSearchBar defaultValue={search} />
      </div>

      {/* Error state */}
      {hasError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-2">
          <p className="text-sm font-medium text-destructive">Failed to load users</p>
          <p className="text-xs text-muted-foreground">{result?.message}</p>
        </div>
      )}

      {/* Empty state */}
      {!hasError && users.length === 0 && (
        <div className="rounded-xl border border-border bg-white p-12 text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Users size={22} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No users found</p>
          {search ? (
            <p className="text-xs text-muted-foreground">
              No results for &ldquo;{search}&rdquo;.{" "}
              <Link
                href={ROUTES.ADMIN_USERS}
                className="text-primary hover:underline underline-offset-4 font-medium"
              >
                Clear search
              </Link>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Create the first user to get started.</p>
          )}
        </div>
      )}

      {/* Table */}
      {!hasError && users.length > 0 && <UserTable users={users} />}

      {/* Pagination */}
      {!hasError && meta.totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, meta.total)} of {meta.total} users
          </p>
          <UserPagination
            page={page}
            totalPages={meta.totalPages}
            basePath={ROUTES.ADMIN_USERS}
            searchParams={currentParams}
          />
        </div>
      )}
    </div>
  );
}
