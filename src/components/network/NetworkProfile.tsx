"use client";

import React, { useEffect, useState } from "react";
import { getPublicUserProfileAction } from "@/lib/actions/user.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, Briefcase, MapPin, Calendar, Mail, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import PostCard from "@/app/(dashboard)/feed/_components/PostCard";
import { Badge } from "@/components/ui/badge";

export const NetworkProfile = ({ userId }: { userId: string }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.split("/")[1];

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getPublicUserProfileAction(userId);
        // Response shape: { success: true, data: { user, posts, pitches, portfolio }, message }
        if (res?.success === true && res?.data) {
          setData(res.data);
        }
      } catch (err) {
        setData(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1A6B4A]" />
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  const { user, posts, pitches, portfolio } = data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button 
        onClick={() => router.push(`/${basePath}/network`)} 
        variant="ghost" 
        className="mb-6 -ml-4 text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Network
      </Button>

      {/* Profile Header */}
      <Card className="border-none shadow-lg overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-[#1A6B4A] to-[#2ecc71] relative">
        </div>
        <CardContent className="px-8 pb-8 pt-0 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16">
            <Avatar className="w-32 h-32 border-4 border-white shadow-md bg-white shrink-0">
              <AvatarImage src={user.profilePicture} className="object-cover" />
              <AvatarFallback className="bg-green-100 text-green-700 font-bold text-3xl">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left mt-16 md:mt-20">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold font-heading text-gray-900">
                  {user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.username}
                </h1>
                {user.kycStatus === "verified" && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 flex w-fit mx-auto md:mx-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-500 font-medium mb-4">@{user.username}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 mb-6">
                <span className="flex items-center gap-1.5 capitalize bg-gray-100 px-3 py-1 rounded-full">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  {user.role}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {user.bio && (
                <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-xl">
                  {user.bio}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 mb-8">
          <TabsTrigger 
            value="posts" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#1A6B4A] data-[state=active]:text-[#1A6B4A] rounded-none h-full px-6 bg-transparent"
          >
            Posts ({posts?.total || 0})
          </TabsTrigger>
          
          {user.role === "entrepreneur" && (
            <TabsTrigger 
              value="pitches" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#1A6B4A] data-[state=active]:text-[#1A6B4A] rounded-none h-full px-6 bg-transparent"
            >
              Pitches ({pitches?.length || 0})
            </TabsTrigger>
          )}

          {user.role === "investor" && (
            <TabsTrigger 
              value="portfolio" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#1A6B4A] data-[state=active]:text-[#1A6B4A] rounded-none h-full px-6 bg-transparent"
            >
              Portfolio ({portfolio?.length || 0})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          {posts?.posts?.length > 0 ? (
            <div className="max-w-2xl mx-auto space-y-6">
              {posts.posts.map((post: any) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={""} // Viewing as public, won't allow editing/deleting
                  currentUserRole={""}
                  onDeleted={() => {}}
                  onUpdated={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
              <p className="text-gray-500 mt-1">This user hasn't posted anything on their feed.</p>
            </div>
          )}
        </TabsContent>

        {user.role === "entrepreneur" && (
          <TabsContent value="pitches" className="mt-0">
            {pitches?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pitches.map((pitch: any) => (
                  <Card key={pitch._id} className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
                    <div 
                      className="h-32 bg-gray-200 bg-cover bg-center"
                      style={{ backgroundImage: pitch.coverImageUrl ? `url(${pitch.coverImageUrl})` : "none" }}
                    />
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg mb-1 truncate">{pitch.title}</h3>
                      <p className="text-sm text-gray-500 mb-4 truncate">{pitch.tagline}</p>
                      
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-gray-600">Goal: <span className="font-semibold text-gray-900">${pitch.fundingGoal?.toLocaleString()}</span></span>
                        <Badge variant="outline" className="capitalize">{pitch.status}</Badge>
                      </div>

                      <Link href={`/investor/pitches/${pitch._id}`}>
                        <Button className="w-full bg-[#1A6B4A] hover:bg-[#14563b]">View Pitch</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No pitches</h3>
                <p className="text-gray-500 mt-1">This entrepreneur hasn't created any pitches yet.</p>
              </div>
            )}
          </TabsContent>
        )}

        {user.role === "investor" && (
          <TabsContent value="portfolio" className="mt-0">
            {portfolio?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((inv: any) => (
                  <Card key={inv._id} className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg mb-2">{inv.pitchId?.title || "Unknown Pitch"}</h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Invested:</span>
                          <span className="font-semibold text-gray-900">${inv.amount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tier:</span>
                          <span className="capitalize">{inv.tierType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge variant="secondary" className="capitalize">{inv.paymentStatus}</Badge>
                        </div>
                      </div>
                      {inv.pitchId && (
                        <Link href={`/investor/pitches/${inv.pitchId._id}`}>
                          <Button variant="outline" className="w-full">View Pitch</Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Empty Portfolio</h3>
                <p className="text-gray-500 mt-1">This investor hasn't made any public investments yet.</p>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
