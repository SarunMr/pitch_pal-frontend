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

        {/* KYC Pending Card */}
        <a
          href="/admin/kyc"
          className="group block p-6 bg-white rounded-xl border border-border hover:border-amber-500/50 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200">
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
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-foreground group-hover:text-amber-600 transition-colors">
                KYC Pending
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Awaiting review
              </p>
            </div>
          </div>
        </a>

        {/* Pitch Queue Card */}
        <a
          href="/admin/pitches"
          className="group block p-6 bg-white rounded-xl border border-border hover:border-blue-500/50 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-200">
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
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-foreground group-hover:text-blue-600 transition-colors">
                Pitch Queue
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review and approve pitches
              </p>
            </div>
          </div>
        </a>

        {/* Analytics Card */}
        <a
          href="/admin/analytics"
          className="group block p-6 bg-white rounded-xl border border-border hover:border-purple-500/50 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-foreground group-hover:text-purple-600 transition-colors">
                Analytics
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Platform metrics and statistics
              </p>
            </div>
          </div>
        </a>

        {/* Reports Card */}
        <a
          href="/admin/reports"
          className="group block p-6 bg-white rounded-xl border border-border hover:border-orange-500/50 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-foreground group-hover:text-orange-600 transition-colors">
                Reports
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review flagged content
              </p>
            </div>
          </div>
        </a>

        {/* Audit Logs Card */}
        <a
          href="/admin/audit-logs"
          className="group block p-6 bg-white rounded-xl border border-border hover:border-gray-500/50 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-gray-600 group-hover:text-white transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-foreground group-hover:text-gray-600 transition-colors">
                Audit Logs
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                System action history
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
