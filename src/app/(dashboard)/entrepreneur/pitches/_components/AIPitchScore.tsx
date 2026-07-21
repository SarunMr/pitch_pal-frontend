"use client";

import { useState, useEffect } from "react";
import { generateAIScoreAction, getAIScoreAction } from "@/lib/actions/pitch.actions";
import { IAIScore } from "@/types/pitch.type";
import { getScoreColor, getGradeColor, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export const AIPitchScore = ({ pitchId, onClose }: { pitchId: string; onClose?: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scoreData, setScoreData] = useState<IAIScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScore = async () => {
      setIsLoading(true);
      const res = await getAIScoreAction(pitchId);
      if (res.success && res.data?.hasScore) {
        setScoreData(res.data);
      } else {
        setScoreData(null);
      }
      setIsLoading(false);
    };
    fetchScore();
  }, [pitchId]);

  const handleGenerateScore = async () => {
    setIsGenerating(true);
    setError(null);
    const res = await generateAIScoreAction(pitchId);
    if (res.success) {
      setScoreData(res.data);
    } else {
      setError(res.message || "Failed to generate score");
    }
    setIsGenerating(false);
  };

  const getDimensionLabel = (key: string) => {
    const labels: Record<string, string> = {
      videoQuality: "Video Quality",
      marketOpportunity: "Market Opportunity",
      financialRealism: "Financial Realism",
      dealStructure: "Deal Structure",
      clarity: "Clarity",
      teamStrength: "Team Strength"
    };
    return labels[key] || key;
  };

  const getRingColor = (grade?: string) => {
    if (grade === 'A') return 'border-green-500';
    if (grade === 'B') return 'border-yellow-500';
    return 'border-orange-500';
  };

  const getGradeText = (grade?: string) => {
    if (grade === 'A') return "Excellent — Ready to Submit";
    if (grade === 'B') return "Good — Minor Improvements Needed";
    return "Fair — Review Suggestions Below";
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-40 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-40 bg-gray-200 rounded-lg w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold">AI Pitch Score</h2>
          <p className="text-sm text-gray-500">
            Powered by Google Gemini · Synthetic evaluation for demonstration purposes
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {!scoreData ? (
        <Card className="p-8 text-center space-y-4 border-dashed border-2">
          <div className="flex justify-center">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold">Check Your Pitch Score</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            Get AI-powered feedback on your pitch quality across 6 dimensions
          </p>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleGenerateScore}
            disabled={isGenerating}
          >
            {isGenerating ? "Analyzing..." : "Generate AI Score"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </Card>
      ) : (
        <div className="space-y-8">
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-6 items-center">
              <div className="flex justify-center border-r">
                <div className={`w-24 h-24 rounded-full border-4 ${getRingColor(scoreData.grade)} flex items-center justify-center`}>
                  <div className="text-center">
                    <span className="text-3xl font-bold">{scoreData.score}</span>
                    <span className="text-sm text-gray-400">/100</span>
                  </div>
                </div>
              </div>
              <div>
                <div className={`text-5xl font-bold ${getGradeColor(scoreData.grade || '')}`}>
                  {scoreData.grade}
                </div>
                <div className="text-sm font-medium mt-2">
                  {getGradeText(scoreData.grade)}
                </div>
                {scoreData.generatedAt && (
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(scoreData.generatedAt)}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {scoreData.breakdown && (
            <div>
              <h3 className="font-semibold mb-4 text-lg">Score Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(scoreData.breakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium capitalize">{getDimensionLabel(key)}</span>
                      <span className={`font-bold ${getScoreColor(value as number)}`}>{value as number}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${value as number >= 75 ? 'bg-green-500' : value as number >= 60 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scoreData.suggestions && scoreData.suggestions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4 text-lg">AI Recommendations</h3>
              <div className="space-y-3">
                {scoreData.suggestions.map((s, i) => {
                  let bgColor = 'bg-gray-50';
                  let borderColor = 'border-gray-200';
                  let icon = <Info className="w-5 h-5 text-gray-500" />;

                  if (s.type === 'warning') {
                    bgColor = 'bg-amber-50';
                    borderColor = 'border-amber-200';
                    icon = <AlertTriangle className="w-5 h-5 text-amber-500" />;
                  } else if (s.type === 'info') {
                    bgColor = 'bg-blue-50';
                    borderColor = 'border-blue-200';
                    icon = <Info className="w-5 h-5 text-blue-500" />;
                  } else if (s.type === 'success') {
                    bgColor = 'bg-green-50';
                    borderColor = 'border-green-200';
                    icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
                  }

                  return (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-lg border ${bgColor} ${borderColor}`}>
                      <div className="mt-0.5">{icon}</div>
                      <p className="text-sm text-gray-700">{s.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-4 border-t text-center space-y-4">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-500"
              onClick={handleGenerateScore}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate New Score"}
            </Button>
            
            <p className="text-xs text-gray-400 italic">
              Note: This is a synthetic AI evaluation for demonstration purposes. Scores are generated from sample pitch data and do not reflect your actual pitch content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
