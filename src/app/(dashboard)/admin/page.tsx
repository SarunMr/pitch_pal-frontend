import React from "react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-red-500">
        <h1 className="text-3xl font-heading font-bold text-red-600 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          System administration and moderation tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/admin/users"
          className="group block p-6 bg-white rounded-xl border border-border hover:border-red-500/50 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 10.089 20.03c-2.115 0-4.108-.575-5.816-1.58C3.593 17.9 3 16.828 3 15.655V14.54m12 4.588a9.153 9.153 0 0 1-5.122 1.392 9.163 9.163 0 0 1-4.88-1.392m0-4.59v.007C3.1 15.356 3.3 16.5 3.9 17.5m0-3.5h.008"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-foreground group-hover:text-red-600 transition-colors">
                User Management
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage accounts, roles, statuses, and credentials.
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
