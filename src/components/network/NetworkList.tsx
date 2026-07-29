"use client";

import React, { useEffect, useState } from "react";
import { getPublicUsersAction } from "@/lib/actions/user.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, User as UserIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NetworkList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const basePath = pathname.split("/")[1]; // "investor" or "entrepreneur"

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getPublicUsersAction({ search: search || undefined });
      // Backend ApiResponseHelper wraps data: { success: true, data: [...], message: "" }
      // The server action returns this object directly from axios response.data
      if (res?.success === true && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        // Fallback: maybe res IS the array itself
        setUsers(Array.isArray(res) ? res : []);
      }
    } catch (err) {
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-gray-900">Network</h1>
          <p className="text-gray-500 mt-1">Discover and connect with other entrepreneurs and investors.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name or username..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#1A6B4A]" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
          <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No users found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <Card key={user._id} className="hover:shadow-lg transition-shadow duration-300 border-none shadow-md overflow-hidden group">
              <div className="h-24 bg-gradient-to-r from-[#1A6B4A] to-[#2ecc71] relative">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-sm bg-white">
                    <AvatarImage src={user.profilePicture} className="object-cover" />
                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold text-xl">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <CardContent className="pt-14 pb-6 px-6 text-center">
                <h3 className="font-bold text-lg text-gray-900 truncate">
                  {user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.username}
                </h3>
                <p className="text-sm text-gray-500 mb-2 truncate">@{user.username}</p>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium capitalize mb-4">
                  {user.role}
                </span>
                {user.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                    {user.bio}
                  </p>
                )}
                <Link href={`/${basePath}/network/${user._id}`}>
                  <Button variant="outline" className="w-full border-[#1A6B4A] text-[#1A6B4A] hover:bg-[#1A6B4A] hover:text-white transition-colors">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
