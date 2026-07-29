"use client";

import { useState, useEffect } from "react";
import { CreditCard, Trash2, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getPaymentCardAction, addPaymentCardAction, deletePaymentCardAction } from "@/lib/actions/payment.actions";

export default function PaymentMethodPage() {
  const [card, setCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const loadCard = async () => {
    setIsLoading(true);
    const res = await getPaymentCardAction();
    if (res?.success && res.data) {
      setCard(res.data);
    } else {
      setCard(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCard();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await addPaymentCardAction(formData);
    if (res?.success) {
      toast.success("Payment card added successfully");
      loadCard();
    } else {
      toast.error(res?.message || "Failed to add payment card");
    }
    setIsSubmitting(false);
  };

  const handleDeleteCard = async () => {
    if (!confirm("Are you sure you want to remove your payment card?")) return;
    setIsSubmitting(true);
    const res = await deletePaymentCardAction();
    if (res?.success) {
      toast.success("Payment card removed");
      setCard(null);
      setFormData({ cardNumber: "", expiryDate: "", cvv: "", cardholderName: "" });
    } else {
      toast.error(res?.message || "Failed to remove payment card");
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto p-8 flex justify-center">
        <Loader2 className="w-8 h-8 text-[#1A6B4A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="h-10 w-10 rounded-xl bg-[#1A6B4A]/10 flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-[#1A6B4A]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payment Method</h1>
          <p className="text-sm text-gray-500">Manage your mock payment card for transactions</p>
        </div>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 text-sm">
        <ShieldCheck className="h-5 w-5 shrink-0 text-blue-500" />
        <p>
          A payment card is required for all platform transactions (investing in pitches or creating new pitches). 
          This is a mock system—no real charges will be made. Data is encrypted before saving.
        </p>
      </div>

      {card ? (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CreditCard className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex justify-between items-start mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="font-medium text-green-400 text-sm">Active & Verified</span>
            </div>
            <button
              onClick={handleDeleteCard}
              disabled={isSubmitting}
              className="p-2 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 rounded-lg transition-colors disabled:opacity-50"
              title="Remove Card"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="relative z-10 space-y-4">
            <div>
              <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Card Number</p>
              <p className="text-2xl font-mono tracking-widest">{card.cardNumber}</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Cardholder</p>
                <p className="font-medium tracking-wide">{card.cardholderName}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Expires</p>
                <p className="font-mono">{card.expiryDate}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleAddCard} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Add Mock Card</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A6B4A]/20 focus:border-[#1A6B4A]"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A6B4A]/20 focus:border-[#1A6B4A]"
                placeholder="1234567890123456"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (MM/YY)</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A6B4A]/20 focus:border-[#1A6B4A]"
                  placeholder="12/25"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A6B4A]/20 focus:border-[#1A6B4A]"
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#1A6B4A] hover:bg-[#155a3d] text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
            Save Card
          </button>
        </form>
      )}
    </div>
  );
}
