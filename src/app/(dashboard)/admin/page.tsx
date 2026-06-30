import React from "react";

export default function AdminDashboard() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-red-500">
      <h1 className="text-3xl font-heading font-bold text-red-600 mb-4">
        Admin Dashboard
      </h1>
      <p className="text-gray-600">
        System administration and moderation tools.
      </p>
    </div>
  );
}
