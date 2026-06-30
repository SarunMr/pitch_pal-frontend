export default function UserTableSkeleton() {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-white shadow-sm animate-pulse">
      <table className="w-full text-sm" aria-label="Loading users">
        <thead>
          <tr className="border-b border-border bg-slate-50/80">
            {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
              <th
                key={h}
                className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className="border-b border-border/60 last:border-b-0">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-slate-200" />
                    <div className="h-2.5 w-36 rounded bg-slate-100" />
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="h-5 w-20 rounded-full bg-slate-200" />
              </td>
              <td className="py-3 px-4">
                <div className="h-5 w-16 rounded-full bg-slate-200" />
              </td>
              <td className="py-3 px-4">
                <div className="h-3 w-20 rounded bg-slate-200" />
              </td>
              <td className="py-3 px-4 text-right">
                <div className="inline-flex gap-2 justify-end">
                  <div className="h-6 w-12 rounded-md bg-slate-200" />
                  <div className="h-6 w-14 rounded-md bg-slate-200" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
