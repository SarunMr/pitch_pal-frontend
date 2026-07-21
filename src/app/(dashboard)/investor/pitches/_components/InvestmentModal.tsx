"use client";

import { useState } from "react";
import { IPitch, IInvestorTier } from "@/types/pitch.type";
import { investAction } from "@/lib/actions/pitch.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X, CheckCircle2, ChevronLeft, ShieldAlert } from "lucide-react";
import { formatNPR } from "@/lib/utils";

interface InvestmentModalProps {
  pitch: IPitch;
  tiers: any[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (investment: any) => void;
}

export const InvestmentModal = ({ pitch, tiers, isOpen, onClose, onSuccess }: InvestmentModalProps) => {
  const [selectedTier, setSelectedTier] = useState<IInvestorTier | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');
  const [acknowledged, setAcknowledged] = useState(false);
  const [lastInvestment, setLastInvestment] = useState<any>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const getTierEmoji = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('supporter')) return '🎁';
    if (n.includes('stakeholder')) return '📈';
    if (n.includes('partner')) return '🤝';
    return '⭐';
  };

  const getQuickAmounts = (tier: IInvestorTier) => {
    const min = tier.minimumInvestment;
    const max = tier.maximumInvestment || min * 10;
    const amounts = [min, min * 2, min * 5, max];
    return Array.from(new Set(amounts)).filter(a => a >= min && (tier.maximumInvestment ? a <= tier.maximumInvestment : true)).slice(0, 4);
  };

  const valuationCap = pitch.valuationCap || 0;
  const equityPreview = selectedTier?.equityPercentage && valuationCap > 0 && Number(amount) > 0
    ? ((Number(amount) / valuationCap) * 100).toFixed(6)
    : "0";

  const handleContinue = () => {
    if (!selectedTier) {
      setError("Select a tier");
      return;
    }
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount)) {
      setError("Enter a valid amount");
      return;
    }
    if (numAmount < selectedTier.minimumInvestment) {
      setError(`Minimum is NPR ${selectedTier.minimumInvestment}`);
      return;
    }
    if (selectedTier.maximumInvestment && numAmount > selectedTier.maximumInvestment) {
      setError(`Maximum is NPR ${selectedTier.maximumInvestment}`);
      return;
    }
    setError(null);
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!selectedTier || !amount || !acknowledged) return;
    setIsLoading(true);
    setError(null);
    const res = await investAction(pitch._id, Number(amount), selectedTier.name);
    if (res.success) {
      setLastInvestment(res.data);
      setStep('success');
      onSuccess(res.data);
    } else {
      setError(res.message || "Failed to process investment");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {step !== 'success' && (
          <div className="flex items-center justify-between p-4 border-b">
            {step === 'confirm' ? (
              <button onClick={() => setStep('select')} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <div className="w-7"></div>
            )}
            <h2 className="text-lg font-bold">
              {step === 'confirm' ? 'Confirm Investment' : `Invest in ${pitch.title}`}
            </h2>
            <button onClick={handleClose} disabled={isLoading} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto">
          {step === 'select' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg flex gap-3 items-start text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                <p>⚠️ This is a simulated investment. No real money will be transferred. PitchPal is a demonstration platform.</p>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Choose your investor tier</Label>
                <div className="grid gap-3">
                  {tiers.map((tier: any) => {
                    const isSelected = selectedTier?.name === tier.name;
                    return (
                      <Card
                        key={tier.name}
                        className={`p-4 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-green-500 bg-green-50 ring-1 ring-green-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedTier(tier);
                          setAmount(tier.minimumInvestment.toString());
                          setError(null);
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold capitalize">{getTierEmoji(tier.name)} {tier.name}</h4>
                          <span className="text-sm font-medium text-gray-700">
                            NPR {tier.minimumInvestment} {tier.maximumInvestment ? `– NPR ${tier.maximumInvestment}` : '+'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{tier.benefits?.join(', ')}</p>
                        <div className="flex gap-2">
                          {tier.equityPercentage > 0 ? (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Includes Equity</span>
                          ) : (
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">Perks Only</span>
                          )}
                          {tier.benefits?.some((b: string) => b.toLowerCase().includes('board')) && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Board Access</span>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {selectedTier && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Investment Amount (NPR)</Label>
                    <p className="text-xs text-gray-500">Min: NPR {selectedTier.minimumInvestment} {selectedTier.maximumInvestment ? `· Max: NPR ${selectedTier.maximumInvestment}` : ''}</p>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setError(null); }}
                      min={selectedTier.minimumInvestment}
                      max={selectedTier.maximumInvestment}
                      placeholder={selectedTier.minimumInvestment.toString()}
                      className="text-lg font-medium"
                    />
                    <div className="flex flex-wrap gap-2 pt-2">
                      {getQuickAmounts(selectedTier).map(preset => (
                        <Button
                          key={preset}
                          variant="outline"
                          size="sm"
                          onClick={() => { setAmount(preset.toString()); setError(null); }}
                          className={`text-xs py-1 h-7 ${Number(amount) === preset ? 'border-primary text-primary bg-primary/5' : ''}`}
                        >
                          {formatNPR(preset)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedTier.equityPercentage > 0 && valuationCap > 0 && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-1">
                      <p className="font-semibold text-green-800">Estimated equity: {equityPreview}% of company</p>
                      <p className="text-sm text-green-700">Valuation cap: {formatNPR(valuationCap)}</p>
                      <p className="text-xs text-green-600/80 mt-1">Equity converts at next funding round</p>
                    </div>
                  )}
                </div>
              )}

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-base" 
                onClick={handleContinue}
                disabled={!selectedTier || !amount}
              >
                Continue to Confirm
              </Button>
            </div>
          )}

          {step === 'confirm' && selectedTier && (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400 text-sm">Pitch</span>
                  <span className="font-semibold truncate max-w-[200px]">{pitch.title}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400 text-sm">Tier</span>
                  <span className="font-semibold capitalize">{selectedTier.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400 text-sm">Amount</span>
                  <span className="font-bold text-green-400 text-lg">{formatNPR(Number(amount))}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400 text-sm">Equity</span>
                  <span className="font-semibold">
                    {selectedTier.equityPercentage > 0 ? `${equityPreview}%` : 'No equity - Supporter'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400 text-sm">Agreement</span>
                  <span className="font-semibold">SAFE Note / Mock Investment</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-400 text-sm">Payment</span>
                  <span className="font-semibold text-blue-300">Simulated (No real money)</span>
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I understand this is a simulated investment for demonstration purposes only. No real money will be transferred.
                </span>
              </label>

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-base" 
                onClick={handleConfirm}
                disabled={!acknowledged || isLoading}
              >
                {isLoading ? "Processing..." : "Confirm Investment"}
              </Button>
            </div>
          )}

          {step === 'success' && lastInvestment && (
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Investment Successful!</h2>
              
              <p className="text-gray-600">
                {selectedTier?.equityPercentage && selectedTier.equityPercentage > 0 
                  ? `You now hold ${equityPreview}% equity in ${pitch.title}` 
                  : `You're now a supporter of ${pitch.title}`}
              </p>

              <div className="bg-gray-50 border p-4 rounded-lg inline-block text-left max-w-xs mx-auto">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Payment Reference:</p>
                <p className="font-mono text-sm break-all font-medium">{lastInvestment.investment?.paymentRef || lastInvestment.paymentRef}</p>
                <p className="text-[10px] text-gray-400 mt-2">Keep this for your records</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Close
                </Button>
                <Button className="flex-1 bg-primary" onClick={() => window.location.href = '/investor/portfolio'}>
                  View My Portfolio
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
