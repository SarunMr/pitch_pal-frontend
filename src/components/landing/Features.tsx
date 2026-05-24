import React from "react";
import { Shield, Zap, BarChart3, Users } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-8 rounded-2xl border border-border bg-sidebar transition-all duration-200 hover:border-primary group">
      <div className="h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-outline-custom leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function Features(): React.JSX.Element {
  const platformFeatures = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Pitch Construction",
      description:
        "Build regulatory-compliant data rooms and pitch structures using unified Node/Mongo architecture primitives.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secured Legal Escrow",
      description:
        "Automated equity distribution contracts processing cap-table adjustments on live deal finalization.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Real-time Cap Analytics",
      description:
        "Track share dilution fractions, voting-weight models, and allocation thresholds through clean visualizations.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Vetted Syndicate Networks",
      description:
        "Connect directly with verified angels, VC pipelines, and accredited retail syndicates looking for real stakes.",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-background border-b border-border">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
            Engineered Architecture
          </h2>
          <p className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Everything you need to trade venture stakes
          </p>
          <p className="text-base sm:text-lg text-outline-custom">
            A frictionless financial sandbox connecting equity allocation
            infrastructure directly to active cap management tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformFeatures.map((feat, index) => (
            <FeatureCard
              key={index}
              icon={feat.icon}
              title={feat.title}
              description={feat.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
