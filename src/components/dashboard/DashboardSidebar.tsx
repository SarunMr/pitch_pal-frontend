"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TrendingUp, LayoutDashboard, Rss, FileText, Settings, User as UserIcon, Shield, Briefcase, Users, FileBarChart, AlertTriangle, ShieldCheck, CreditCard, LogOut } from "lucide-react";
import { getUserData } from "@/lib/cookie";
import { handleLogout } from "@/lib/actions/auth.actions";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavSection = {
  section: string;
  items: NavItem[];
};

const ENTREPRENEUR_NAV: NavSection[] = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/entrepreneur", icon: LayoutDashboard },
    ],
  },
  {
    section: "Activity",
    items: [
      { label: "Feed", href: "/feed", icon: Rss },
      { label: "My Pitches", href: "/entrepreneur/pitches", icon: FileText },
      { label: "My Posts", href: "/feed/my", icon: UserIcon },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserIcon },
      { label: "KYC", href: "/kyc", icon: Shield },
      { label: "Payment Methods", href: "/payment", icon: CreditCard },
    ],
  },
];

const INVESTOR_NAV: NavSection[] = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/investor", icon: LayoutDashboard },
    ],
  },
  {
    section: "Activity",
    items: [
      { label: "Feed", href: "/feed", icon: Rss },
      { label: "Marketplace", href: "/investor/pitches", icon: Briefcase },
      { label: "Portfolio", href: "/investor/portfolio", icon: FileText },
      { label: "My Posts", href: "/feed/my", icon: UserIcon },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserIcon },
      { label: "KYC", href: "/kyc", icon: Shield },
      { label: "Payment Methods", href: "/payment", icon: CreditCard },
    ],
  },
];

const ADMIN_NAV: NavSection[] = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    section: "Management",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Pitch Queue", href: "/admin/pitches", icon: FileText },
      { label: "KYC Queue", href: "/admin/kyc", icon: ShieldCheck },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: FileBarChart },
      { label: "Reports", href: "/admin/reports", icon: AlertTriangle },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: Shield },
      { label: "Feed", href: "/feed", icon: Rss },
    ],
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUserData().then(setUser);
  }, []);

  const onLogout = async () => {
    try {
      await handleLogout();
    } catch {
      // Next.js redirect() throws internally — safe to ignore, navigation will proceed
      router.push("/login");
    }
  };

  if (!user) {
    return <div className="w-64 border-r bg-white h-screen hidden md:block"></div>;
  }

  let navConfig: NavSection[] = [];
  if (user.role === "entrepreneur") {
    navConfig = ENTREPRENEUR_NAV;
  } else if (user.role === "investor") {
    navConfig = INVESTOR_NAV;
  } else if (user.role === "admin") {
    navConfig = ADMIN_NAV;
  }

  return (
    <aside className="w-64 border-r bg-white h-screen sticky top-0 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-[#1A6B4A]" />
          <span className="text-xl font-bold font-heading text-[#1A6B4A]">
            PitchPal
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {navConfig.map((section, idx) => (
          <div key={idx}>
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#1A6B4A]/10 text-[#1A6B4A]"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-[#1A6B4A]" : "text-gray-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t shrink-0">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
};
