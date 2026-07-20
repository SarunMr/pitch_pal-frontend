import { fetchPitchByIdAction } from "@/lib/actions/pitch.actions";
import PitchWizard from "../_components/PitchWizard";
import KYCGuard from "@/components/kyc/KYCGuard";
import { IPitch } from "@/types/pitch.type";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Create Pitch | PitchPal",
};

interface CreatePitchPageProps {
  searchParams: Promise<{
    edit?: string;
  }>;
}

export default async function CreatePitchPage({ searchParams }: CreatePitchPageProps) {
  const params = await searchParams;
  const editId = params.edit;
  
  let initialData: IPitch | undefined = undefined;

  if (editId) {
    const res = await fetchPitchByIdAction(editId);
    if (res?.success && res?.data) {
      initialData = res.data;
    }
  }

  return (
    <KYCGuard role="entrepreneur">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/entrepreneur/pitches"
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-muted-foreground transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {editId ? "Edit Pitch Draft" : "Create New Pitch"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Complete the steps below to prepare your pitch for investors.
            </p>
          </div>
        </div>

        <PitchWizard initialData={initialData} />
      </div>
    </KYCGuard>
  );
}
