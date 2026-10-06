import { Link, createFileRoute } from "@tanstack/react-router";

import { LabWorkspace } from "@/components/lab-board/lab-workspace";
import { useLabStore } from "@/components/lab-board/lab-store";
import { KIND_LABELS } from "@/lib/lab-board";

export const Route = createFileRoute("/labs/$labId")({
  component: LabDetailPage,
});

function LabDetailPage() {
  const { labId } = Route.useParams();
  const store = useLabStore();
  const lab = store.state?.labs.find((item) => item.id === labId);

  if (!store.currentUser || !store.state) return null;
  if (!lab) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-3xl font-semibold">Lab not found</h1>
        <Link to="/labs" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
          Back to labs
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <Link to="/labs" className="text-sm font-semibold text-primary hover:underline">
        All labs
      </Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{KIND_LABELS[lab.kind]}</p>
      <h1 className="mt-1 font-display text-4xl font-semibold">{lab.name}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {lab.code ? `${lab.code} · ` : ""}
        {lab.location}
      </p>
      {lab.description ? <p className="mt-3 max-w-2xl leading-relaxed">{lab.description}</p> : null}
      <div className="mt-6">
        <LabWorkspace lab={lab} />
      </div>
    </main>
  );
}
