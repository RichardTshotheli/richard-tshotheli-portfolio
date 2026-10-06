import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AddLabForm, LabStatusBadge } from "@/components/lab-board/lab-panels";
import { useLabStore } from "@/components/lab-board/lab-store";
import { Button } from "@/components/ui/button";
import { KIND_LABELS, peopleInside, sortedLabs } from "@/lib/lab-board";

export const Route = createFileRoute("/labs/")({
  component: LabsPage,
});

function LabsPage() {
  const store = useLabStore();
  const [adding, setAdding] = useState(false);

  if (!store.ready || !store.state) {
    return <p className="mx-auto max-w-6xl px-5 py-16 text-portfolio-mist sm:px-8">Loading the laboratory board…</p>;
  }

  const labs = sortedLabs(store.state.labs);
  const openCount = labs.filter((lab) => lab.isOpen).length;
  const insideCount = store.state.attendance.filter((entry) => entry.leftAt === null).length;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <p className="max-w-2xl text-lg leading-relaxed text-portfolio-mist">
        Open a lab when people need to use it, register attendance as they enter, and update the equipment and software in each lab.
      </p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Labs" value={String(labs.length)} />
        <Stat label="Open now" value={String(openCount)} />
        <Stat label="People inside" value={String(insideCount)} />
      </dl>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Labs</h1>
        {adding ? null : (
          <Button type="button" onClick={() => setAdding(true)}>
            Add a lab
          </Button>
        )}
      </div>

      {adding ? (
        <div className="mt-5">
          <AddLabForm onDone={() => setAdding(false)} />
        </div>
      ) : null}

      {labs.length === 0 ? (
        <p className="mt-8 text-portfolio-mist">No labs yet. Add the first lab to start opening sessions and registering attendance.</p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {labs.map((lab) => {
            const inside = peopleInside(store.state?.attendance ?? [], lab.id).length;
            return (
              <article
                key={lab.id}
                className={`flex flex-col border border-portfolio-line bg-portfolio-surface p-6 ${lab.isOpen ? "border-l-4 border-l-portfolio-teal" : "border-l-4 border-l-portfolio-line"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-teal">{KIND_LABELS[lab.kind]}</p>
                  <LabStatusBadge open={lab.isOpen} />
                </div>
                <h2 className="mt-3 font-display text-2xl font-semibold">{lab.name}</h2>
                <p className="mt-1 text-sm text-portfolio-mist">
                  {lab.code ? `${lab.code} · ` : ""}
                  {lab.location}
                </p>
                {lab.description ? <p className="mt-3 leading-relaxed text-foreground/85">{lab.description}</p> : null}
                {lab.isOpen && lab.openNote ? <p className="mt-3 text-sm leading-relaxed">{lab.openNote}</p> : null}
                <p className="mt-4 text-sm font-medium">
                  {inside} of {lab.capacity} inside · {lab.equipment.length} equipment · {lab.software.length} software
                </p>
                <div className="mt-5">
                  <Button asChild>
                    <Link to="/labs/$labId" params={{ labId: lab.id }}>
                      {lab.isOpen ? "Register attendance" : "Open or update"}
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-10 text-sm text-portfolio-mist">
        The register, open notes, equipment, and software are saved in this browser, so the board stays on the computer used at the lab.
      </p>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-portfolio-line bg-portfolio-surface px-5 py-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-mist">{label}</dt>
      <dd className="mt-1 font-display text-3xl font-semibold">{value}</dd>
    </div>
  );
}
