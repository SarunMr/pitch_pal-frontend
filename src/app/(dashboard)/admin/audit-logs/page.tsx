"use client";

import React, { useEffect, useState } from "react";
import { getAuditLogsAction } from "@/lib/actions/admin.actions";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getAuditLogsAction(1, 50);
        if (res?.success) {
          setLogs(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch audit logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading text-gray-900">Audit Logs</h1>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 animate-pulse">
                    Loading logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {log.adminId?.firstName || log.adminId?.username}
                      </div>
                      <div className="text-xs text-gray-500">{log.adminId?.email}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1A6B4A]">
                      {log.action}
                    </td>
                    <td className="px-4 py-3">
                      <div className="capitalize text-gray-900">{log.targetType}</div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {log.targetId}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs text-gray-600 text-xs">
                      {log.details || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
