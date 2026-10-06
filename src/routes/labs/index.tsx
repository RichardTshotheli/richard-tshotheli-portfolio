import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { controlClass, Field, FormMessage, Panel } from "@/components/lab-board/field";
import { useLabStore } from "@/components/lab-board/lab-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { KIND_LABELS, LAB_KINDS, canSeeOccupancy, isAdmin, peopleInside, sortedLabs, type LabKind } from "@/lib/lab-board";

export const Route = createFileRoute("/labs/")({
  component: LabsPage,
});

function LabsPage() {
  const store = useLabStore();
  const [adding, setAdding] = useState(false);
  const state = store.state;
  const user = store.currentUser;
  if (!state || !user) return null;

  const labs = sortedLabs(state.labs);
  const openLabs = labs.filter((lab) => lab.isOpen);
  const students = state.attendance.filter((entry) => entry.leftAt === null).length;
  const onDuty = openLabs.length;
  const showCounts = canSeeOccupancy(user);

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold">Labs</h1>
        </div>
        {isAdmin(user) ? (
          <Button type="button" onClick={() => setAdding((value) => !value)}>
            {adding ? "Close form" : "Add a lab"}
          </Button>
        ) : null}
      </div>

      {showCounts ? (
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Open labs" value={String(openLabs.length)} tone="open" />
          <Stat label="Assistants on duty" value={String(onDuty)} tone="duty" />
          <Stat label="Students inside" value={String(students)} tone="count" />
        </dl>
      ) : null}

      {adding && isAdmin(user) ? (
        <div className="mt-6">
          <AddLabForm onDone={() => setAdding(false)} />
        </div>
      ) : null}

      {labs.length === 0 ? <p className="mt-6 text-sm text-muted-foreground">No labs yet.</p> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {labs.map((lab) => {
          const inside = peopleInside(state.attendance, lab.id).length;
          return (
            <article
              key={lab.id}
              className={`rounded-2xl border p-5 shadow-sm ${lab.isOpen ? "border-emerald-600 bg-emerald-50" : "border-red-600 bg-red-50"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{KIND_LABELS[lab.kind]}</p>
                <Status open={lab.isOpen} />
              </div>
              <h2 className="mt-3 font-display text-2xl font-semibold">{lab.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {lab.code ? `${lab.code} · ` : ""}
                {lab.location}
              </p>
              <div className={`mt-4 grid gap-3 ${showCounts ? "grid-cols-2" : ""}`}>
                {showCounts ? (
                  <div className="rounded-xl bg-white/80 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Students</p>
                    <p className="mt-1 text-2xl font-semibold text-emerald-950">
                      {inside}
                      <span className="text-sm font-medium text-emerald-800"> / {lab.capacity}</span>
                    </p>
                  </div>
                ) : null}
                <div className="rounded-xl bg-white/80 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Opened by</p>
                  <p className="mt-1 font-medium">{lab.isOpen ? lab.openedBy || "Assistant" : "Closed"}</p>
                </div>
              </div>
              {lab.isOpen && lab.openNote ? <p className="mt-3 text-sm leading-relaxed">{lab.openNote}</p> : null}
              <Button className="mt-4" asChild>
                <Link to="/labs/$labId" params={{ labId: lab.id }}>
                  {user.canOperateLabs ? (lab.isOpen ? "Register and duty" : "Open this lab") : "View lab"}
                </Link>
              </Button>
            </article>
          );
        })}
      </div>
    </main>
  );
}

function Status({ open }: { open: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${open ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
    >
      {open ? "Open" : "Closed"}
    </span>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "open" | "duty" | "count" }) {
  const toneClass = tone === "open" ? "bg-emerald-50" : tone === "duty" ? "bg-amber-50" : "bg-sky-50";
  return (
    <div className={`rounded-2xl border border-white/70 px-5 py-4 shadow-sm ${toneClass}`}>
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-4xl font-semibold">{value}</dd>
    </div>
  );
}

function AddLabForm({ onDone }: { onDone: () => void }) {
  const store = useLabStore();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [location, setLocation] = useState("");
  const [kind, setKind] = useState<LabKind>("computer");
  const [capacity, setCapacity] = useState(20);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = store.addLab({ name, code, location, kind, capacity, description });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    onDone();
  }

  return (
    <Panel title="Add a lab">
      <form noValidate className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="new-lab-name">
            <Input id="new-lab-name" value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Code" htmlFor="new-lab-code">
            <Input id="new-lab-code" value={code} onChange={(event) => setCode(event.target.value)} />
          </Field>
        </div>
        <Field label="Location" htmlFor="new-lab-location">
          <Input id="new-lab-location" value={location} onChange={(event) => setLocation(event.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kind" htmlFor="new-lab-kind">
            <select id="new-lab-kind" className={controlClass} value={kind} onChange={(event) => setKind(event.target.value as LabKind)}>
              {LAB_KINDS.map((item) => (
                <option key={item} value={item}>
                  {KIND_LABELS[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Capacity" htmlFor="new-lab-capacity">
            <Input id="new-lab-capacity" type="number" min={1} value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} />
          </Field>
        </div>
        <Field label="Description" htmlFor="new-lab-description">
          <Textarea id="new-lab-description" value={description} onChange={(event) => setDescription(event.target.value)} />
        </Field>
        <div className="flex gap-2">
          <Button type="submit">Save lab</Button>
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
        </div>
        <FormMessage message={message} />
      </form>
    </Panel>
  );
}
