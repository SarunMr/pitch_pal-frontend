import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { Sparkles } from "lucide-react";

export default function CTA(): React.JSX.Element {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-border bg-sidebar p-8 sm:p-16 text-center overflow-hidden shadow-2xl">
          {/* Subtle background glow utilizing standard theme tokens */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-secondary/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-background border border-border px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Ready to Raise?
            </div>

            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl leading-tight">
              Secure Your Next Round <br className="hidden sm:inline" /> On Your
              Own Terms
            </h2>

            <p className="text-sm sm:text-base text-outline-custom max-w-xl mx-auto leading-relaxed">
              Join thousands of growth founders constructing safe, verified, and
              modular venture channels on PitchPal. Setting up your data sandbox
              takes under 10 minutes.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto font-bold h-12 px-8"
              >
                <Link href={ROUTES.REGISTER}>Create Free Account</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto font-bold h-12 px-8 bg-background text-foreground"
              >
                <Link href={ROUTES.LOGIN}>Talk to an Advisor</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
