import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-sidebar text-foreground transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link
                href={ROUTES.HOME}
                className="text-2xl font-black tracking-tight text-primary hover:opacity-90 transition-opacity"
              >
                PitchPal
              </Link>
            </div>
            <p className="text-outline-custom text-sm leading-relaxed">
              Empowering founders and investors to connect, collaborate, and
              build the future of equity-driven ventures together.
            </p>
          </div>

          {/* About Us / Platform Mission Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">
              Our Platform
            </h4>
            <div className="space-y-3 text-outline-custom">
              <p className="text-sm leading-relaxed">
                PitchPal was created to bridge the gap between breakthrough
                ideas and strategic backing through seamless equity
                partnerships.
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  🚀 <strong className="text-foreground">Mission:</strong>{" "}
                  Democratize equity funding
                </p>
                <p className="text-sm">
                  💡 <strong className="text-foreground">Vision:</strong>{" "}
                  Frictionless venture collaboration
                </p>
                <p className="text-sm">
                  🤝 <strong className="text-foreground">Values:</strong>{" "}
                  Transparency, security, innovation
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">
              Quick Links
            </h4>
            <div className="space-y-2 flex flex-col items-start">
              <Link
                href={ROUTES.HOME}
                className="text-outline-custom hover:text-primary transition-colors text-sm py-1"
              >
                Home
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="text-outline-custom hover:text-primary transition-colors text-sm py-1"
              >
                Join Platform
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className="text-outline-custom hover:text-primary transition-colors text-sm py-1"
              >
                Sign In
              </Link>
              <Link
                href="#"
                className="text-outline-custom hover:text-primary transition-colors text-sm py-1"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-outline-custom hover:text-primary transition-colors text-sm py-1"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-outline-custom">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm break-all">
                  sarunmaharjan38@gmail.com
                </span>
              </div>
              <div className="flex items-center space-x-3 text-outline-custom">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+977 9808703816</span>
              </div>
              <div className="flex items-center space-x-3 text-outline-custom">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">Teku, Nepal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-outline-custom text-sm">
            &copy; {currentYear} PitchPal. All rights reserved. Designed for
            innovators everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
