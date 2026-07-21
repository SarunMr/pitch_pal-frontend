import { fetchPitchByIdAction } from "@/lib/actions/pitch.actions";
import PitchWizard from "@/app/(dashboard)/entrepreneur/pitches/_components/PitchWizard";
import { IPitch } from "@/types/pitch.type";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Edit Pitch | PitchPal Admin",
};

interface AdminEditPitchPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditPitchPage({ params }: AdminEditPitchPageProps) {
  const { id } = await params;
  
  let initialData: IPitch | undefined = undefined;

  if (id) {
    const res = await fetchPitchByIdAction(id);
    if (res?.success && res?.data) {
      initialData = res.data;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/pitches"
          className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-muted-foreground transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Edit Pitch: {initialData?.title || "Loading..."}
          </h1>
          <p className="text-xs text-muted-foreground">
            Modify pitch details on behalf of the entrepreneur.
          </p>
        </div>
      </div>

      <PitchWizard initialData={initialData} />
    </div>
  );
}
