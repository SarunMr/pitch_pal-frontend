import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero(): React.JSX.Element {
  return (
    <section className="flex items-center justify-center min-h-[60vh] py-20 bg-background text-foreground">
      <div className="max-w-3xl text-center px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-sidebar px-3 py-1 text-xs font-semibold text-primary w-max mx-auto mb-6">
          The Next Evolution of Venture Equity
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
          Where Brilliant Ideas Meet{" "}
          <span className="text-primary">Strategic Capital</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          PitchPal streamlines equity-based fundraising. Connect with certified
          investors, manage compliance seamlessly, and trade venture equity in a
          transparent sandbox.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="h-12 px-6 font-semibold">
            <Link href="/register" className="flex items-center gap-2">
              Launch Your Pitch <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 px-6 font-semibold bg-transparent text-foreground"
          >
            <Link href="/deals">Explore Active Deals</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
