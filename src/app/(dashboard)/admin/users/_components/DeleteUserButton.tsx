"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteUserAction } from "@/lib/actions/admin-user.actions";

interface DeleteUserButtonProps {
  userId: string;
  username: string;
}

export default function DeleteUserButton({ userId, username }: DeleteUserButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      if (result?.success) {
        toast.success(`User "${username}" deleted successfully`);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to delete user");
        setOpen(false);
      }
    });
  };

  return (
    <>
      <button
        id={`delete-user-${userId}`}
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
        aria-label={`Delete user ${username}`}
      >
        <Trash2 size={12} />
        Delete
      </button>

      {/* Alert Dialog */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isPending && setOpen(false)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-sm rounded-xl bg-white shadow-xl p-6 space-y-4">
            <div className="space-y-1">
              <h2 id="delete-dialog-title" className="text-base font-semibold text-foreground">
                Delete user?
              </h2>
              <p className="text-sm text-muted-foreground">
                This will permanently delete{" "}
                <span className="font-medium text-foreground">{username}</span>. This action
                cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-accent transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                id={`confirm-delete-user-${userId}`}
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-destructive text-white hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && (
                  <span className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
