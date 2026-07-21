"use client";

import { useState, useTransition } from "react";
import { Flame, Lightbulb, Rocket, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { addReactionAction, removeReactionAction } from "@/lib/actions/post.actions";
import { ReactionType } from "@/lib/api/posts/post.api";
import { cn } from "@/lib/utils";

interface ReactionBarProps {
  postId: string;
  reactionCounts: Record<string, number>;
  userReaction?: string | null;
  onReactionChange: (counts: Record<string, number>, userReaction: string | null) => void;
}

const REACTIONS: { type: ReactionType; icon: React.ReactNode; label: string; activeColor: string }[] = [
  { type: "fire", icon: <Flame size={15} />, label: "Fire", activeColor: "text-orange-500 bg-orange-50 border-orange-200" },
  { type: "lightbulb", icon: <Lightbulb size={15} />, label: "Insightful", activeColor: "text-yellow-500 bg-yellow-50 border-yellow-200" },
  { type: "rocket", icon: <Rocket size={15} />, label: "Rocket", activeColor: "text-blue-500 bg-blue-50 border-blue-200" },
  { type: "question", icon: <HelpCircle size={15} />, label: "Question", activeColor: "text-purple-500 bg-purple-50 border-purple-200" },
];

export default function ReactionBar({ postId, reactionCounts, userReaction, onReactionChange }: ReactionBarProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCounts, setOptimisticCounts] = useState(reactionCounts);
  const [optimisticUserReaction, setOptimisticUserReaction] = useState(userReaction ?? null);

  const handleReaction = (type: ReactionType) => {
    if (isPending) return;

    startTransition(async () => {
      const prevCounts = { ...optimisticCounts };
      const prevUserReaction = optimisticUserReaction;

      // Optimistic update
      const newCounts = { ...optimisticCounts };
      if (optimisticUserReaction === type) {
        // Removing reaction
        newCounts[type] = Math.max((newCounts[type] || 1) - 1, 0);
        setOptimisticCounts(newCounts);
        setOptimisticUserReaction(null);
      } else {
        // Changing or adding reaction
        if (optimisticUserReaction) {
          newCounts[optimisticUserReaction] = Math.max((newCounts[optimisticUserReaction] || 1) - 1, 0);
        }
        newCounts[type] = (newCounts[type] || 0) + 1;
        setOptimisticCounts(newCounts);
        setOptimisticUserReaction(type);
      }

      // API call
      let res;
      if (prevUserReaction === type) {
        res = await removeReactionAction(postId);
      } else {
        res = await addReactionAction(postId, type);
      }

      if (res?.success) {
        onReactionChange(newCounts, optimisticUserReaction === type ? null : type);
      } else {
        // Rollback
        setOptimisticCounts(prevCounts);
        setOptimisticUserReaction(prevUserReaction);
        toast.error(res?.message || "Failed to react");
      }
    });
  };

  const total = Object.values(optimisticCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {REACTIONS.map(({ type, icon, label, activeColor }) => {
        const isActive = optimisticUserReaction === type;
        const count = optimisticCounts[type] || 0;
        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            disabled={isPending}
            title={label}
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium transition-all",
              isActive
                ? activeColor
                : "text-gray-500 bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            {icon}
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
      {total > 0 && (
        <span className="text-xs text-gray-400 ml-1">{total} reaction{total !== 1 ? "s" : ""}</span>
      )}
    </div>
  );
}
