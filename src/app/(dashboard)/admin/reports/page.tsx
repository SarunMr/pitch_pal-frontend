"use client";

import React, { useEffect, useState } from "react";
import { getReportsAction, resolveReportAction } from "@/lib/actions/admin.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [resolveStatus, setResolveStatus] = useState<"resolved" | "dismissed">("resolved");
  const [resolveNote, setResolveNote] = useState("");
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getReportsAction(status === "all" ? undefined : status, 1, 50);
      if (res?.success) {
        setReports(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [status]);

  const handleResolveSubmit = async () => {
    if (!selectedReport) return;
    setResolving(true);
    setError(null);
    try {
      const res = await resolveReportAction(selectedReport._id, resolveStatus, resolveNote);
      if (res?.success) {
        setIsDialogOpen(false);
        fetchReports();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update report");
    } finally {
      setResolving(false);
    }
  };

  const openResolveDialog = (report: any) => {
    setSelectedReport(report);
    setResolveStatus("resolved");
    setResolveNote("");
    setError(null);
    setIsDialogOpen(true);
  };

  const getTargetLink = (type: string, id: string) => {
    if (type === "pitch") return `/pitches/${id}`;
    if (type === "comment") return `/feed`; // fallback since we don't know the exact post ID easily
    return "#";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading text-gray-900">Reports</h1>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {['pending', 'resolved', 'dismissed', 'all'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatus(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
              status === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3">Reporter</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 animate-pulse">
                    Loading reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No reports found.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {report.reporterId?.firstName || report.reporterId?.username}
                      </div>
                      <div className="text-xs text-gray-500">{report.reporterId?.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={getTargetLink(report.targetType, report.targetId)}
                        className="text-[#1A6B4A] hover:underline font-medium capitalize"
                      >
                        {report.targetType}
                      </Link>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {report.targetId.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="truncate" title={report.reason}>
                        {report.reason}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-[10px] font-semibold rounded-full ${
                        report.priority === "high" ? "bg-red-100 text-red-700" :
                        report.priority === "medium" ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {report.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`capitalize font-medium ${
                        report.status === "pending" ? "text-amber-600" :
                        report.status === "resolved" ? "text-green-600" :
                        "text-gray-500"
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {report.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openResolveDialog(report)}
                        >
                          Resolve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Resolve Report</h2>
              <button onClick={() => setIsDialogOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Action</label>
                <select
                  value={resolveStatus}
                  onChange={(e) => setResolveStatus(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                >
                  <option value="resolved">Resolve (Action Taken)</option>
                  <option value="dismissed">Dismiss (No Action)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Admin Note (Optional)</label>
                <textarea
                  placeholder="Reason for this decision..."
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                />
              </div>
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </div>

            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={resolving}>
                Cancel
              </Button>
              <Button onClick={handleResolveSubmit} disabled={resolving}>
                {resolving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
