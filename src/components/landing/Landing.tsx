import React from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";

export default function LandingPage(): React.JSX.Element {
  return (
    <div className="w-full min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}
