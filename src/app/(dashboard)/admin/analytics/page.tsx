"use client";

import React, { useEffect, useState } from "react";
import {
  getAnalyticsOverviewAction,
  getUserAnalyticsAction,
  getPitchAnalyticsAction,
} from "@/lib/actions/admin.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, AlertTriangle, FileSpreadsheet, Briefcase } from "lucide-react";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [pitchStats, setPitchStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [oRes, uRes, pRes] = await Promise.all([
          getAnalyticsOverviewAction(),
          getUserAnalyticsAction(),
          getPitchAnalyticsAction(),
        ]);
        if (oRes.success) setOverview(oRes.data);
        if (uRes.success) setUserStats(uRes.data);
        if (pRes.success) setPitchStats(pRes.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500 animate-pulse">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading text-gray-900">Analytics</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalUsers || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pitches</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalPitches || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalPosts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.pendingReports || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
            <CheckCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.pendingKyc || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {['users', 'pitches', 'investments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Role Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {userStats?.usersByRole &&
                    Object.entries(userStats.usersByRole).map(([role, count]) => (
                      <li key={role} className="flex justify-between border-b pb-2">
                        <span className="capitalize text-gray-600">{role}</span>
                        <span className="font-semibold">{count as number}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>KYC Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {userStats?.kycStatusBreakdown &&
                    Object.entries(userStats.kycStatusBreakdown).map(([status, count]) => (
                      <li key={status} className="flex justify-between border-b pb-2">
                        <span className="capitalize text-gray-600">{status}</span>
                        <span className="font-semibold">{count as number}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Signups (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {userStats?.signupsOverTime?.length ? (
                    userStats.signupsOverTime.map((d: any) => (
                      <div key={d._id} className="flex justify-between border-b pb-2 text-sm">
                        <span className="text-gray-600">{d._id}</span>
                        <span className="font-semibold">{d.count}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No recent signups</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "pitches" && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Pitches by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pitchStats?.pitchesByStatus &&
                      Object.entries(pitchStats.pitchesByStatus).map(([status, count]) => (
                        <li key={status} className="flex justify-between border-b pb-2">
                          <span className="capitalize text-gray-600">{status}</span>
                          <span className="font-semibold">{count as number}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pitches by Sector</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {pitchStats?.pitchesBySector?.map((s: any) => (
                      <li key={s._id} className="flex justify-between border-b pb-2 text-sm">
                        <span className="text-gray-600">{s._id || "Unknown"}</span>
                        <span className="font-semibold">{s.count}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Funding Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">Total Goal</div>
                      <div className="text-xl font-bold text-gray-900">
                        NPR {pitchStats?.totalFundingGoal?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Total Raised</div>
                      <div className="text-xl font-bold text-[#1A6B4A]">
                        NPR {pitchStats?.totalFundingRaised?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Pitches (by Views)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Views</th>
                        <th className="px-4 py-3">Raised / Goal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pitchStats?.topPitchesByViewCount?.map((pitch: any) => (
                        <tr key={pitch._id} className="border-b">
                          <td className="px-4 py-3 font-medium">{pitch.title}</td>
                          <td className="px-4 py-3 capitalize">{pitch.status}</td>
                          <td className="px-4 py-3">{pitch.viewCount}</td>
                          <td className="px-4 py-3">
                            NPR {pitch.fundingRaised?.toLocaleString()} / NPR {pitch.fundingGoal?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "investments" && (
          <Card>
            <CardHeader>
              <CardTitle>Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Briefcase className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
                <p className="text-gray-500 mt-2 max-w-sm">
                  Investment analytics will be available once the investment feature launches.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
