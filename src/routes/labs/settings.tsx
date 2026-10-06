import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { controlClass, Field, FormMessage } from "@/components/lab-board/field";
import { LoginQr } from "@/components/lab-board/login-qr";
import { useLabStore } from "@/components/lab-board/lab-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CONDITION_LABELS,
  EQUIPMENT_CONDITIONS,
  KIND_LABELS,
  LAB_KINDS,
  formatWhen,
  isAdmin,
  sortedLabs,
  type EquipmentCondition,
  type Lab,
  type LabKind,
} from "@/lib/lab-board";
import { CSE_LABS_URL } from "@/lib/lab-links";

const HISTORY_LABELS = {
  opened: "Opened",
  closed: "Closed",
  "taken-over": "Taken over",
  updated: "Updated",
} as const;

export const Route = createFileRoute("/labs/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const store = useLabStore();
  const user = store.currentUser;
  const state = store.state;
  const [copied, setCopied] = useState(false);
  if (!user || !state) return null;
  if (!isAdmin(user)) {
    return <main className="mx-auto max-w-6xl px-5 py-10 text-muted-foreground sm:px-8">Only an admin can open settings.</main>;
  }

  const labs = sortedLabs(state.labs);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8">
      <h1 className="font-display text-4xl font-semibold">Settings</h1>

      <section className="w-fit rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl font-semibold">Access link</h2>
        <div className="mt-4">
          <LoginQr />
        </div>
        <p className="mt-4 max-w-xs break-all text-sm text-[var(--lab-header)]">{CSE_LABS_URL}</p>
        <button
          type="button"
          className="mt-3 rounded-full border border-[var(--lab-header)] px-3 py-1 text-sm text-[var(--lab-header)] hover:bg-[var(--lab-mint)]"
          onClick={() => {
            void navigator.clipboard.writeText(CSE_LABS_URL).then(() => setCopied(true));
          }}
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold">Labs</h2>
          <p className="text-sm text-muted-foreground">{labs.length} {labs.length === 1 ? "lab" : "labs"}</p>
        </div>
        <AddLabForm />
        {labs.length === 0 ? <p className="text-sm text-muted-foreground">No labs yet. Add the first one above.</p> : null}
        {labs.map((lab) => (
          <LabEditor key={lab.id} lab={lab} />
        ))}
      </section>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl font-semibold">History</h2>
        {state.history.length === 0 ? <p className="text-sm text-muted-foreground">No history yet.</p> : null}
        <ul className="grid gap-2">
          {state.history.map((entry) => (
            <li key={entry.id} className="rounded-2xl border border-border bg-card px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--lab-header)]">{HISTORY_LABELS[entry.kind]}</p>
                <p className="text-xs text-muted-foreground">{formatWhen(entry.at)}</p>
              </div>
              <p className="mt-1 font-medium">{entry.labName}</p>
              <p className="text-sm text-muted-foreground">
                {entry.actorName}
                {entry.detail ? ` · ${entry.detail}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function LabEditor({ lab }: { lab: Lab }) {
  const store = useLabStore();
  const [name, setName] = useState(lab.name);
  const [capacity, setCapacity] = useState(lab.capacity);
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [equipmentName, setEquipmentName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<EquipmentCondition>("working");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [equipmentMessage, setEquipmentMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(lab.name);
    setCapacity(lab.capacity);
  }, [lab.name, lab.capacity]);

  function saveLab(event: FormEvent) {
    event.preventDefault();
    const result = store.updateLab(lab.id, {
      name,
      code: lab.code,
      location: lab.location,
      kind: lab.kind,
      capacity,
      description: lab.description,
    });
    setSaved(result.ok);
    setMessage(result.ok ? null : result.message);
  }

  function removeThisLab() {
    const result = store.removeLab(lab.id);
    if (!result.ok) {
      setMessage(result.message);
      setConfirmRemove(false);
    }
  }

  function saveEquipment(event: FormEvent) {
    event.preventDefault();
    const draft = { name: equipmentName, quantity, condition, notes: "" };
    const result = editingId ? store.updateEquipment(lab.id, editingId, draft) : store.addEquipment(lab.id, draft);
    if (!result.ok) {
      setEquipmentMessage(result.message);
      return;
    }
    setEquipmentName("");
    setQuantity(1);
    setCondition("working");
    setEditingId(null);
    setEquipmentMessage(null);
  }

  return (
    <article className={`rounded-2xl border p-5 shadow-sm ${lab.isOpen ? "border-emerald-600 bg-emerald-50" : "border-red-600 bg-red-50"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-2xl font-semibold">{lab.name}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white ${lab.isOpen ? "bg-emerald-600" : "bg-red-600"}`}>
            {lab.isOpen ? "Open" : "Closed"}
          </span>
          {confirmRemove ? (
            <>
              <Button type="button" size="sm" variant="destructive" onClick={removeThisLab}>
                Confirm remove
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setConfirmRemove(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" size="sm" variant="destructive" onClick={() => setConfirmRemove(true)}>
              Remove lab
            </Button>
          )}
        </div>
      </div>
      {confirmRemove ? <p className="mt-2 text-sm text-red-800">This removes {lab.name}{lab.isOpen ? ", which is open right now" : ""}.</p> : null}
      <p className="mt-1 text-sm">{lab.isOpen ? `Opened by ${lab.openedBy || "Assistant"}` : "Closed"}</p>

      <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end" onSubmit={saveLab}>
        <Field label="Name" htmlFor={`lab-name-${lab.id}`}>
          <Input
            id={`lab-name-${lab.id}`}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSaved(false);
            }}
          />
        </Field>
        <Field label="Capacity" htmlFor={`lab-capacity-${lab.id}`}>
          <Input id={`lab-capacity-${lab.id}`} type="number" min={1} value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} />
        </Field>
        <Button type="submit">Save name and capacity</Button>
      </form>
      <div className="mt-2">
        {saved ? <p className="text-sm font-medium text-emerald-800">Name and capacity saved.</p> : <FormMessage message={message} />}
      </div>

      <h4 className="mt-6 font-semibold">Equipment</h4>
      <ul className="mt-2 divide-y divide-border rounded-xl bg-white/80">
        {lab.equipment.length === 0 ? <li className="px-3 py-2 text-sm text-muted-foreground">No equipment listed.</li> : null}
        {lab.equipment.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                Qty {item.quantity} · {CONDITION_LABELS[item.condition]}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingId(item.id);
                  setEquipmentName(item.name);
                  setQuantity(item.quantity);
                  setCondition(item.condition);
                }}
              >
                Edit
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => store.removeEquipment(lab.id, item.id)}>
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <form className="mt-3 grid gap-3" onSubmit={saveEquipment}>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Equipment" htmlFor={`eq-name-${lab.id}`}>
            <Input id={`eq-name-${lab.id}`} value={equipmentName} onChange={(event) => setEquipmentName(event.target.value)} />
          </Field>
          <Field label="Quantity" htmlFor={`eq-qty-${lab.id}`}>
            <Input id={`eq-qty-${lab.id}`} type="number" min={0} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
          </Field>
          <Field label="Condition" htmlFor={`eq-condition-${lab.id}`}>
            <select id={`eq-condition-${lab.id}`} className={controlClass} value={condition} onChange={(event) => setCondition(event.target.value as EquipmentCondition)}>
              {EQUIPMENT_CONDITIONS.map((item) => (
                <option key={item} value={item}>
                  {CONDITION_LABELS[item]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="flex gap-2">
          <Button type="submit">{editingId ? "Save equipment" : "Add equipment"}</Button>
          {editingId ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditingId(null);
                setEquipmentName("");
                setQuantity(1);
                setCondition("working");
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
        <FormMessage message={equipmentMessage} />
      </form>
    </article>
  );
}

function AddLabForm() {
  const store = useLabStore();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [kind, setKind] = useState<LabKind>("computer");
  const [capacity, setCapacity] = useState(20);
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = store.addLab({ name, code: "", location, kind, capacity, description: "" });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setName("");
    setLocation("");
    setKind("computer");
    setCapacity(20);
    setMessage(null);
  }

  return (
    <form className="grid gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm" onSubmit={onSubmit}>
      <h3 className="font-display text-xl font-semibold">Add a lab</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" htmlFor="settings-lab-name">
          <Input id="settings-lab-name" value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label="Location" htmlFor="settings-lab-location">
          <Input id="settings-lab-location" value={location} onChange={(event) => setLocation(event.target.value)} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end">
        <Field label="Kind" htmlFor="settings-lab-kind">
          <select id="settings-lab-kind" className={controlClass} value={kind} onChange={(event) => setKind(event.target.value as LabKind)}>
            {LAB_KINDS.map((item) => (
              <option key={item} value={item}>
                {KIND_LABELS[item]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Capacity" htmlFor="settings-lab-capacity">
          <Input id="settings-lab-capacity" type="number" min={1} value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} />
        </Field>
        <Button type="submit">Add lab</Button>
      </div>
      <FormMessage message={message} />
    </form>
  );
}
