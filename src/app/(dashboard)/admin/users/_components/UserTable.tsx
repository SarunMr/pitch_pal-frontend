import Link from "next/link";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import DeleteUserButton from "./DeleteUserButton";

interface User {
  _id: string;
  username: string;
  email: string;
  role: "entrepreneur" | "investor" | "admin";
  status: "active" | "suspended" | "banned";
  createdAt: string;
}

const ROLE_STYLES: Record<User["role"], string> = {
  admin: "bg-red-100 text-red-700 border-red-200",
  entrepreneur: "bg-violet-100 text-violet-700 border-violet-200",
  investor: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const STATUS_STYLES: Record<User["status"], string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  suspended: "bg-amber-100 text-amber-700 border-amber-200",
  banned: "bg-red-100 text-red-700 border-red-200",
};

function RoleBadge({ role }: { role: User["role"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize",
        ROLE_STYLES[role],
      )}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: User["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
      <table className="w-full text-sm" aria-label="Users table">
        <thead>
          <tr className="border-b border-border bg-slate-50/80">
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              User
            </th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Role
            </th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Joined
            </th>
            <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr
              key={user._id}
              id={`user-row-${user._id}`}
              className={cn(
                "border-b border-border/60 transition-colors hover:bg-slate-50",
                idx === users.length - 1 && "border-b-0",
              )}
            >
              {/* User */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary uppercase">
                      {user.username.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="py-3 px-4">
                <RoleBadge role={user.role} />
              </td>

              {/* Status */}
              <td className="py-3 px-4">
                <StatusBadge status={user.status} />
              </td>

              {/* Joined */}
              <td className="py-3 px-4 text-muted-foreground text-xs">
                {formatDate(user.createdAt)}
              </td>

              {/* Actions */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-1 justify-end">
                  <Link
                    id={`edit-user-${user._id}`}
                    href={ROUTES.ADMIN_USERS_EDIT(user._id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-foreground hover:bg-accent transition-colors"
                    aria-label={`Edit ${user.username}`}
                  >
                    <Pencil size={12} />
                    Edit
                  </Link>
                  <DeleteUserButton userId={user._id} username={user.username} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
