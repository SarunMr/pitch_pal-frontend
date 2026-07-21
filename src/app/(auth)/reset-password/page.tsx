import { Suspense } from "react";
import ResetPassword from "../_components/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-6 text-sm text-muted-foreground">Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
