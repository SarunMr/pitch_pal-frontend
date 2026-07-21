import React from "react";
import { IPitch, IInvestorTierDoc, IMilestoneDoc } from "@/types/pitch.type";
import { cn } from "@/lib/utils";
import { Calendar, Users, MapPin, Target, Briefcase, CheckCircle2 } from "lucide-react";

interface PitchDetailViewProps {
  pitch: IPitch;
  tiers: IInvestorTierDoc[];
  milestones: IMilestoneDoc[];
  viewerRole?: "entrepreneur" | "investor" | "admin" | "public";
  onInvestClick?: () => void;
  recentInvestors?: any[];
}

export default function PitchDetailView({ pitch, tiers, milestones, viewerRole = "public", onInvestClick, recentInvestors }: PitchDetailViewProps) {
  return (
    <div className="space-y-8">
      {/* Header & Video */}
      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        {pitch.videoUrl ? (
          <div className="aspect-video w-full bg-slate-900 relative">
            <video
              src={pitch.videoUrl}
              controls
              className="w-full h-full object-contain"
              poster={pitch.coverImageUrl}
            />
          </div>
        ) : (
          <div
            className="aspect-video w-full bg-slate-100 flex items-center justify-center bg-cover bg-center"
            style={pitch.coverImageUrl ? { backgroundImage: `url(${pitch.coverImageUrl})` } : undefined}
          >
            {!pitch.coverImageUrl && (
              <span className="text-muted-foreground text-sm font-medium">No video or cover image provided</span>
            )}
          </div>
        )}
        <div className="p-6 md:p-8 space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-primary/10 text-primary border-primary/20 uppercase tracking-wider">
                {pitch.industry}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-slate-100 text-slate-700 border-slate-200 uppercase tracking-wider">
                {pitch.fundingStage.replace("_", " ")}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{pitch.title}</h1>
            <p className="text-lg text-muted-foreground mt-1">{pitch.tagline}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            {pitch.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-slate-400" />
                <span>{pitch.location}</span>
              </div>
            )}
            {pitch.teamSize && (
              <div className="flex items-center gap-1.5">
                <Users size={16} className="text-slate-400" />
                <span>{pitch.teamSize} team members</span>
              </div>
            )}
            {pitch.foundedYear && (
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-slate-400" />
                <span>Founded {pitch.foundedYear}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Briefcase size={20} className="text-primary" />
              Problem & Solution
            </h2>
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
              {pitch.description}
            </div>
            {pitch.tags && pitch.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-border">
                {pitch.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Milestones */}
          <section className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Target size={20} className="text-primary" />
                Milestones & Updates
              </h2>
            </div>
            
            {milestones.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No milestones posted yet.</p>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {milestones.map((m, i) => (
                  <div key={m._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-border shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground">{m.title}</span>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase">
                          {new Date(m.targetDate).toLocaleDateString("en-US")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{m.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-600">
                          Funding req: ${m.fundingRequired.toLocaleString()}
                        </span>
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-medium uppercase",
                          m.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          m.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          m.status === 'delayed' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        )}>
                          {m.status.replace("_", " ")}
                        </span>
                      </div>
                      {m.mediaUrls && m.mediaUrls.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border flex gap-2 overflow-x-auto">
                          {m.mediaUrls.map((url, idx) => (
                            <img key={idx} src={url} alt="Milestone media" className="h-16 w-16 object-cover rounded-md border border-border shrink-0" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground">Funding Overview</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Goal</span>
                  <span className="font-semibold">${pitch.fundingGoal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Raised</span>
                  <span className="font-semibold text-emerald-600">${pitch.fundingRaised.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all" 
                    style={{ width: `${Math.min((pitch.fundingRaised / pitch.fundingGoal) * 100, 100)}%` }} 
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-border flex justify-between text-sm">
                <span className="text-muted-foreground">Equity Offered</span>
                <span className="font-semibold">{pitch.equityOffered}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Min Investment</span>
                <span className="font-semibold">${pitch.minInvestment.toLocaleString()}</span>
              </div>
            </div>
          </section>

          {pitch.useOfFunds && pitch.useOfFunds.length > 0 && (
            <section className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-foreground">Use of Funds</h3>
              <div className="space-y-3">
                {pitch.useOfFunds.map((uof, i) => (
                  <div key={i} className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{uof.category}</span>
                      <span className="text-muted-foreground">{uof.percentage}%</span>
                    </div>
                    {uof.description && <p className="text-xs text-slate-500">{uof.description}</p>}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${uof.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h3 className="font-bold text-foreground px-1">Investor Tiers</h3>
            {tiers.length === 0 ? (
              <p className="text-sm text-muted-foreground italic px-1">No tiers defined.</p>
            ) : (
              <div className="space-y-3">
                {tiers.map(tier => (
                  <div key={tier._id} className="bg-white rounded-xl border border-border p-5 shadow-sm hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-foreground">{tier.name}</h4>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        {tier.slotsRemaining} left
                      </span>
                    </div>
                    <div className="text-xl font-bold text-emerald-600 mb-3">
                      ${tier.minimumInvestment.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600 mb-4 border-b border-border pb-4">
                      <span className="font-semibold">{tier.equityPercentage}%</span> Equity
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                          <span className="leading-tight">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {viewerRole === "investor" && pitch.status === "live" && onInvestClick && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1)] z-40">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {recentInvestors && recentInvestors.length > 0 && (
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-sm text-gray-500 font-medium">Recent investors:</span>
                <div className="flex -space-x-2">
                  {recentInvestors.slice(0, 5).map((inv: any, i: number) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden z-10 hover:z-20 transition-transform">
                      {inv.investorId?.avatar ? (
                        <img src={inv.investorId.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-gray-500">
                          {inv.investorId?.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                  ))}
                  {recentInvestors.length > 5 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center z-0">
                      <span className="text-xs font-bold text-gray-600">+{recentInvestors.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {!recentInvestors || recentInvestors.length === 0 ? <div /> : null}

            <button
              onClick={onInvestClick}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-sm transition-colors text-lg"
            >
              Invest Now &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
