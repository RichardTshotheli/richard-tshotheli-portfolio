import { useState, type FormEvent, type ReactNode } from "react";

import { controlClass, Field, FormMessage, Panel } from "@/components/lab-board/field";
import { useLabStore, type Result } from "@/components/lab-board/lab-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CONDITION_LABELS,
  EQUIPMENT_CONDITIONS,
  NOTE_KINDS,
  NOTE_LABELS,
  PURPOSE_LABELS,
  VISIT_PURPOSES,
  canOperate,
  formatWhen,
  isAdmin,
  isSameLocalDay,
  peopleInside,
  type Equipment,
  type EquipmentCondition,
  type Lab,
  type NoteKind,
  type SoftwareItem,
  type VisitPurpose,
} from "@/lib/lab-board";

export function LabWorkspace({ lab }: { lab: Lab }) {
  const store = useLabStore();
  const user = store.currentUser;
  const state = store.state;
  if (!user || !state) return null;
  const inside = peopleInside(state.attendance, lab.id);
  const operate = canOperate(user);
  const admin = isAdmin(user);

  return (
    <div className="grid gap-5">
      <section className={`rounded-3xl p-6 text-white shadow-sm ${lab.isOpen ? "bg-emerald-700" : "bg-[var(--lab-header)]"}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">{lab.isOpen ? "Lab is open" : "Lab is closed"}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-5xl font-semibold leading-none">{inside.length}</p>
            <p className="mt-2 text-sm text-white/85">students inside · capacity {lab.capacity}</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm">
            <p className="text-xs uppercase tracking-wide text-white/75">Assistant on duty</p>
            <p className="mt-1 text-lg font-semibold">{lab.isOpen ? lab.openedBy : "No one yet"}</p>
            {lab.openedAt ? <p className="text-white/80">Since {formatWhen(lab.openedAt)}</p> : null}
          </div>
        </div>
        {lab.openNote ? <p className="mt-4 max-w-2xl leading-relaxed text-white/90">{lab.openNote}</p> : null}
      </section>

      {operate ? <DutyPanel lab={lab} /> : null}
      {admin && !operate ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Lab assistants with rights open the lab and mark the student register. You can update equipment and software below.
        </p>
      ) : null}
      {!admin && !operate ? (
        <p className="rounded-2xl border border-border bg-card px-4 py-3 text-sm">
          Ask an admin to give your account rights before you can open labs or mark the register.
        </p>
      ) : null}

      <RegisterPanel lab={lab} canEdit={operate} />
      <InventorySection lab={lab} canEdit={admin} />
      {operate ? <NoteComposer labId={lab.id} /> : null}
    </div>
  );
}

function DutyPanel({ lab }: { lab: Lab }) {
  const store = useLabStore();
  const user = store.currentUser;
  const [note, setNote] = useState(lab.openNote);
  const [confirmClose, setConfirmClose] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  if (!user) return null;
  const mine = lab.openedByUserId === user.id;

  function apply(result: Result) {
    setMessage(result.ok ? null : result.message);
    if (result.ok) setConfirmClose(false);
  }

  if (!lab.isOpen) {
    return (
      <Panel title="Open this lab">
        <form
          noValidate
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            apply(store.openLab(lab.id, note));
          }}
        >
          <p className="text-sm text-muted-foreground">Opening the lab marks you as the assistant on duty, then you can register students.</p>
          <Field label="What the lab is open for" htmlFor="open-note">
            <Textarea id="open-note" value={note} placeholder="CSE practical, project session, or open study" onChange={(event) => setNote(event.target.value)} />
          </Field>
          <Button type="submit">I am here — open the lab</Button>
          <FormMessage message={message} />
        </form>
      </Panel>
    );
  }

  return (
    <Panel title={mine ? "You are on duty" : `${lab.openedBy} is on duty`}>
      <div className="flex flex-wrap gap-2">
        {!mine ? (
          <Button type="button" onClick={() => apply(store.takeOverLab(lab.id))}>
            I am taking over this lab
          </Button>
        ) : null}
        {confirmClose ? (
          <>
            <Button type="button" variant="destructive" onClick={() => apply(store.closeLab(lab.id))}>
              Close lab and sign students out
            </Button>
            <Button type="button" variant="ghost" onClick={() => setConfirmClose(false)}>
              Keep open
            </Button>
          </>
        ) : (
          <Button type="button" variant="outline" onClick={() => setConfirmClose(true)}>
            Close lab
          </Button>
        )}
      </div>
      {mine ? (
        <form
          className="mt-4 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            apply(store.updateOpenNote(lab.id, note));
          }}
        >
          <Field label="Update the open note" htmlFor="duty-note">
            <Textarea id="duty-note" value={note} onChange={(event) => setNote(event.target.value)} />
          </Field>
          <Button type="submit" variant="secondary">
            Save note
          </Button>
        </form>
      ) : null}
      <div className="mt-3">
        <FormMessage message={message} />
      </div>
    </Panel>
  );
}

function RegisterPanel({ lab, canEdit }: { lab: Lab; canEdit: boolean }) {
  const store = useLabStore();
  const attendance = store.state?.attendance.filter((entry) => entry.labId === lab.id) ?? [];
  const inside = attendance.filter((entry) => entry.leftAt === null);
  const signedOut = attendance.filter((entry) => entry.leftAt && isSameLocalDay(entry.leftAt));
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [purpose, setPurpose] = useState<VisitPurpose>("practical");
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = store.signIn(lab.id, { name, identifier, purpose });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setName("");
    setIdentifier("");
    setPurpose("practical");
    setMessage(null);
  }

  return (
    <div className="grid gap-5">
      {canEdit ? (
        <Panel title="Student register">
          {lab.isOpen ? (
            <form noValidate className="grid gap-4" onSubmit={onSubmit}>
              <p className="text-sm text-muted-foreground">Add each student as they enter. The count above updates from this list.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Student name" htmlFor="student-name">
                  <Input id="student-name" value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <Field label="Student number" htmlFor="student-number">
                  <Input id="student-number" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
                </Field>
              </div>
              <Field label="Reason" htmlFor="student-purpose">
                <select id="student-purpose" className={controlClass} value={purpose} onChange={(event) => setPurpose(event.target.value as VisitPurpose)}>
                  {VISIT_PURPOSES.map((item) => (
                    <option key={item} value={item}>
                      {PURPOSE_LABELS[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Button type="submit">Add to register</Button>
              <FormMessage message={message} />
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">Open the lab first, then students can be added to the register.</p>
          )}
        </Panel>
      ) : null}

      <Panel title={`Inside now (${inside.length})`}>
        {inside.length === 0 ? (
          <p className="text-sm text-muted-foreground">No students are signed in.</p>
        ) : (
          <ul className="divide-y divide-border">
            {inside.map((entry) => (
              <li key={entry.id} className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{entry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.identifier} · {PURPOSE_LABELS[entry.purpose]} · {formatWhen(entry.enteredAt)}
                  </p>
                </div>
                {canEdit ? (
                  <Button type="button" size="sm" variant="outline" onClick={() => store.signOut(entry.id)}>
                    Sign out
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Signed out today">
        {signedOut.length === 0 ? (
          <p className="text-sm text-muted-foreground">No students have signed out today.</p>
        ) : (
          <ul className="divide-y divide-border">
            {signedOut.map((entry) => (
              <li key={entry.id} className="py-3 first:pt-0">
                <p className="font-medium">{entry.name}</p>
                <p className="text-sm text-muted-foreground">
                  {entry.identifier} · left {entry.leftAt ? formatWhen(entry.leftAt) : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function InventorySection({ lab, canEdit }: { lab: Lab; canEdit: boolean }) {
  const store = useLabStore();
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Catalog
        title="Equipment"
        intro={canEdit ? "Update quantities, condition, and what is kept in this lab." : "Equipment currently listed for this lab."}
        canEdit={canEdit}
        empty="No equipment listed yet."
        items={lab.equipment}
        blank={{ name: "", quantity: 1, condition: "working" as EquipmentCondition, notes: "" }}
        onSave={(draft, id) => (id ? store.updateEquipment(lab.id, id, draft) : store.addEquipment(lab.id, draft))}
        onRemove={(id) => store.removeEquipment(lab.id, id)}
        render={(item) => (
          <>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              Qty {item.quantity} · {CONDITION_LABELS[item.condition]}
              {item.notes ? ` · ${item.notes}` : ""}
            </p>
          </>
        )}
        fields={(draft, setDraft) => (
          <div className="grid gap-3">
            <Field label="Equipment" htmlFor={`eq-name-${lab.id}`}>
              <Input id={`eq-name-${lab.id}`} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Quantity" htmlFor={`eq-qty-${lab.id}`}>
                <Input id={`eq-qty-${lab.id}`} type="number" min={0} value={draft.quantity} onChange={(event) => setDraft({ ...draft, quantity: Number(event.target.value) })} />
              </Field>
              <Field label="Condition" htmlFor={`eq-condition-${lab.id}`}>
                <select id={`eq-condition-${lab.id}`} className={controlClass} value={draft.condition} onChange={(event) => setDraft({ ...draft, condition: event.target.value as EquipmentCondition })}>
                  {EQUIPMENT_CONDITIONS.map((item) => (
                    <option key={item} value={item}>
                      {CONDITION_LABELS[item]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Notes" htmlFor={`eq-notes-${lab.id}`}>
              <Input id={`eq-notes-${lab.id}`} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
            </Field>
          </div>
        )}
      />
      <Catalog
        title="Software"
        intro={canEdit ? "Keep the programs installed on the computers up to date." : "Software listed for the computers in this lab."}
        canEdit={canEdit}
        empty="No software listed yet."
        items={lab.software}
        blank={{ name: "", version: "", installedOn: "" }}
        onSave={(draft, id) => (id ? store.updateSoftware(lab.id, id, draft) : store.addSoftware(lab.id, draft))}
        onRemove={(id) => store.removeSoftware(lab.id, id)}
        render={(item) => (
          <>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              {item.version ? `Version ${item.version}` : "Version not set"} · {item.installedOn}
            </p>
          </>
        )}
        fields={(draft, setDraft) => (
          <div className="grid gap-3">
            <Field label="Software" htmlFor={`sw-name-${lab.id}`}>
              <Input id={`sw-name-${lab.id}`} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Version" htmlFor={`sw-version-${lab.id}`}>
                <Input id={`sw-version-${lab.id}`} value={draft.version} onChange={(event) => setDraft({ ...draft, version: event.target.value })} />
              </Field>
              <Field label="Installed on" htmlFor={`sw-where-${lab.id}`}>
                <Input id={`sw-where-${lab.id}`} value={draft.installedOn} placeholder="All computers" onChange={(event) => setDraft({ ...draft, installedOn: event.target.value })} />
              </Field>
            </div>
          </div>
        )}
      />
    </div>
  );
}

function Catalog<T extends Equipment | SoftwareItem>({
  title,
  intro,
  canEdit,
  empty,
  items,
  blank,
  onSave,
  onRemove,
  render,
  fields,
}: {
  title: string;
  intro: string;
  canEdit: boolean;
  empty: string;
  items: T[];
  blank: Omit<T, "id">;
  onSave: (draft: Omit<T, "id">, id: string | null) => Result;
  onRemove: (id: string) => Result;
  render: (item: T) => ReactNode;
  fields: (draft: Omit<T, "id">, setDraft: (next: Omit<T, "id">) => void) => ReactNode;
}) {
  const [draft, setDraft] = useState(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Panel title={title}>
      <p className="text-sm text-muted-foreground">{intro}</p>
      {canEdit ? (
        <form
          noValidate
          className="mt-4 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const result = onSave(draft, editingId);
            if (!result.ok) {
              setMessage(result.message);
              return;
            }
            setDraft(blank);
            setEditingId(null);
            setMessage(null);
          }}
        >
          {fields(draft, setDraft)}
          <div className="flex gap-2">
            <Button type="submit">{editingId ? "Save changes" : `Add ${title.toLowerCase()}`}</Button>
            {editingId ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditingId(null);
                  setDraft(blank);
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
          <FormMessage message={message} />
        </form>
      ) : null}
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>{render(item)}</div>
              {canEdit ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const { id: _id, ...rest } = item;
                      setDraft(rest);
                      setEditingId(item.id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => onRemove(item.id)}>
                    Remove
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function NoteComposer({ labId }: { labId: string }) {
  const store = useLabStore();
  const [kind, setKind] = useState<NoteKind>("maintenance");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  return (
    <Panel title="Note to the admin">
      <form
        noValidate
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const result = store.submitNote(labId, kind, message);
          if (!result.ok) {
            setError(result.message);
            setSent(false);
            return;
          }
          setMessage("");
          setKind("maintenance");
          setError(null);
          setSent(true);
        }}
      >
        <p className="text-sm text-muted-foreground">Tell the admin about maintenance, a fault, or something missing in this lab.</p>
        <Field label="What is this about" htmlFor="note-kind">
          <select id="note-kind" className={controlClass} value={kind} onChange={(event) => setKind(event.target.value as NoteKind)}>
            {NOTE_KINDS.map((item) => (
              <option key={item} value={item}>
                {NOTE_LABELS[item]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Note" htmlFor="note-message">
          <Textarea id="note-message" value={message} placeholder="Projector in row 2 will not switch on" onChange={(event) => setMessage(event.target.value)} />
        </Field>
        <Button type="submit">Send to admin</Button>
        {sent ? <p className="text-sm font-medium text-emerald-700">Note sent. The admin can see it under Notes.</p> : null}
        <FormMessage message={error} />
      </form>
    </Panel>
  );
}
