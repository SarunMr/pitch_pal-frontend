import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
          {children}
        </div>
      </div>

      <Footer />
    </GoogleOAuthProvider>
  );
}
