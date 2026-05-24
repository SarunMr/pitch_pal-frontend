import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const MountainSilhouette = () => (
  <svg
    viewBox="0 0 1440 200"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    className="w-full block -mb-1"
    aria-hidden="true"
  >
    <path
      d="M-10,200 L-10,158 L70,128 L140,150 L230,90 L305,135 L395,62 L472,115 L548,38 L626,100 L702,22 L782,82 L862,12 L942,68 L1022,38 L1102,95 L1182,48 L1262,105 L1342,60 L1440,115 L1450,200 Z"
      fill="#0A3A28"
      opacity="0.85"
    />
    <path
      d="M-10,200 L-10,178 L95,158 L195,176 L308,128 L418,168 L528,118 L628,158 L738,105 L838,152 L938,112 L1038,158 L1138,118 L1238,158 L1340,128 L1450,165 L1450,200 Z"
      fill="#071E14"
    />
  </svg>
);

export default function Hero(): React.JSX.Element {
  return (
    <section className="relative w-full overflow-hidden bg-primary text-primary-foreground">
      {/* Subtle dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-[60vh] py-20">
        <div className="max-w-3xl text-center px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white w-max mx-auto mb-6">
            The Next Evolution of Venture Equity
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 text-white">
            Where Brilliant Ideas Meet{" "}
            <span className="text-accent-foreground underline decoration-white/30 underline-offset-4">
              Strategic Capital
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-8">
            PitchPal streamlines equity-based fundraising. Connect with
            certified investors, manage compliance seamlessly, and trade venture
            equity in a transparent sandbox.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="h-12 px-6 font-semibold bg-white text-primary hover:bg-white/90 border-0 shadow-none"
            >
              <Link href="/register" className="flex items-center gap-2">
                Launch Your Pitch <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-12 px-6 font-semibold bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white"
            >
              <Link href="/deals">Explore Active Deals</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mountain silhouette at the bottom */}
      <MountainSilhouette />
    </section>
  );
}
