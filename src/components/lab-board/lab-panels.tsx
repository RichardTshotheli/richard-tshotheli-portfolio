import { useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { controlClass, Field, FormMessage, Panel } from "@/components/lab-board/field";
import { useLabStore, type Result } from "@/components/lab-board/lab-store";
import {
  CONDITION_LABELS,
  EQUIPMENT_CONDITIONS,
  formatWhen,
  isSameLocalDay,
  KIND_LABELS,
  LAB_KINDS,
  peopleInside,
  PURPOSE_LABELS,
  VISIT_PURPOSES,
  type Equipment,
  type EquipmentCondition,
  type Lab,
  type LabKind,
  type SoftwareItem,
  type VisitPurpose,
} from "@/lib/lab-board";
import { cn } from "@/lib/utils";

export function LabStatusBadge({ open }: { open: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.12em]",
        open ? "bg-portfolio-teal/15 text-portfolio-teal" : "bg-secondary text-muted-foreground",
      )}
    >
      {open ? "Open" : "Closed"}
    </span>
  );
}

export function LabStatusPanel({ lab }: { lab: Lab }) {
  const store = useLabStore();
  const [openedBy, setOpenedBy] = useState(lab.openedBy ?? "");
  const [note, setNote] = useState(lab.openNote);
  const [editing, setEditing] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const inside = store.state ? peopleInside(store.state.attendance, lab.id).length : 0;

  function apply(result: Result) {
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage(null);
    setEditing(false);
    setConfirmClose(false);
  }

  function onOpen(event: FormEvent) {
    event.preventDefault();
    apply(store.openLab(lab.id, openedBy, note));
  }

  function onUpdate(event: FormEvent) {
    event.preventDefault();
    apply(store.updateOpenNote(lab.id, openedBy, note));
  }

  return (
    <Panel title={lab.isOpen ? "Lab is open" : "Open this lab"}>
      <div className="flex flex-wrap items-center gap-3 text-sm text-portfolio-mist">
        <LabStatusBadge open={lab.isOpen} />
        <span>
          {inside} of {lab.capacity} inside
        </span>
      </div>

      {lab.isOpen && !editing ? (
        <div className="mt-4 space-y-3">
          <p className="leading-relaxed">
            Opened by <span className="font-medium">{lab.openedBy}</span>
            {lab.openedAt ? ` at ${formatWhen(lab.openedAt)}` : ""}.
          </p>
          {lab.openNote ? <p className="leading-relaxed text-foreground/90">{lab.openNote}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpenedBy(lab.openedBy ?? "");
                setNote(lab.openNote);
                setEditing(true);
                setMessage(null);
              }}
            >
              Update open note
            </Button>
            {confirmClose ? (
              <>
                <Button type="button" variant="destructive" onClick={() => apply(store.closeLab(lab.id))}>
                  Close lab and sign everyone out
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
          {confirmClose ? (
            <p className="text-sm text-portfolio-mist">Everyone still inside will be signed out of the register.</p>
          ) : null}
        </div>
      ) : (
        <form noValidate className="mt-4 grid gap-4" onSubmit={lab.isOpen ? onUpdate : onOpen}>
          <p className="text-sm leading-relaxed text-portfolio-mist">
            {lab.isOpen
              ? "Update who is responsible and what the lab is open for."
              : "Write that the lab is open when people need to use it. Attendance opens after this."}
          </p>
          <Field label="Your name" htmlFor="opened-by">
            <Input id="opened-by" value={openedBy} autoComplete="name" onChange={(event) => setOpenedBy(event.target.value)} />
          </Field>
          <Field label="What the lab is open for" htmlFor="open-note">
            <Textarea
              id="open-note"
              value={note}
              placeholder="Networking practical, or students need the lab for project work"
              onChange={(event) => setNote(event.target.value)}
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="submit">{lab.isOpen ? "Save update" : "Mark lab open"}</Button>
            {lab.isOpen ? (
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      )}
      <div className="mt-3">
        <FormMessage message={message} />
      </div>
    </Panel>
  );
}

export function AttendancePanel({ lab }: { lab: Lab }) {
  const store = useLabStore();
  const attendance = store.state?.attendance.filter((entry) => entry.labId === lab.id) ?? [];
  const inside = attendance.filter((entry) => entry.leftAt === null);
  const signedOutToday = attendance.filter((entry) => entry.leftAt !== null && isSameLocalDay(entry.leftAt));
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
      <Panel title="Register entry">
        {lab.isOpen ? (
          <form noValidate className="grid gap-4" onSubmit={onSubmit}>
            <p className="text-sm leading-relaxed text-portfolio-mist">
              People sign in here when they enter the lab. Sign them out when they leave.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="visitor-name">
                <Input id="visitor-name" value={name} autoComplete="name" onChange={(event) => setName(event.target.value)} />
              </Field>
              <Field label="Student or staff number" htmlFor="visitor-number">
                <Input
                  id="visitor-number"
                  value={identifier}
                  autoComplete="off"
                  onChange={(event) => setIdentifier(event.target.value)}
                />
              </Field>
            </div>
            <Field label="Reason for the visit" htmlFor="visitor-purpose">
              <select
                id="visitor-purpose"
                className={controlClass}
                value={purpose}
                onChange={(event) => setPurpose(event.target.value as VisitPurpose)}
              >
                {VISIT_PURPOSES.map((item) => (
                  <option key={item} value={item}>
                    {PURPOSE_LABELS[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Button type="submit">Sign in</Button>
            <FormMessage message={message} />
          </form>
        ) : (
          <p className="text-sm leading-relaxed text-portfolio-mist">
            Mark the lab open above, then people can register as they come in.
          </p>
        )}
      </Panel>

      <Panel title={`Inside now (${inside.length})`}>
        {inside.length === 0 ? (
          <p className="text-sm text-portfolio-mist">No one is signed in.</p>
        ) : (
          <ul className="divide-y divide-portfolio-line">
            {inside.map((entry) => (
              <li key={entry.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{entry.name}</p>
                  <p className="mt-1 text-sm text-portfolio-mist">
                    {entry.identifier} · {PURPOSE_LABELS[entry.purpose]} · Entered {formatWhen(entry.enteredAt)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const result = store.signOut(entry.id);
                    if (!result.ok) setMessage(result.message);
                  }}
                >
                  Sign out
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Signed out today">
        {signedOutToday.length === 0 ? (
          <p className="text-sm text-portfolio-mist">No one has signed out today.</p>
        ) : (
          <ul className="divide-y divide-portfolio-line">
            {signedOutToday.map((entry) => (
              <li key={entry.id} className="py-4 first:pt-0 last:pb-0">
                <p className="font-medium">{entry.name}</p>
                <p className="mt-1 text-sm text-portfolio-mist">
                  {entry.identifier} · {PURPOSE_LABELS[entry.purpose]} · Entered {formatWhen(entry.enteredAt)} · Left{" "}
                  {entry.leftAt ? formatWhen(entry.leftAt) : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function ConditionTag({ condition }: { condition: EquipmentCondition }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-semibold",
        condition === "working" && "bg-portfolio-teal/15 text-portfolio-teal",
        condition === "needs-repair" && "bg-portfolio-gold/20 text-foreground",
        condition === "out-of-service" && "bg-destructive/10 text-destructive",
      )}
    >
      {CONDITION_LABELS[condition]}
    </span>
  );
}

export function EquipmentPanel({ lab }: { lab: Lab }) {
  const store = useLabStore();
  return (
    <InventoryPanel
      title="Equipment"
      intro="Update the equipment kept in this lab, including quantities and condition."
      items={lab.equipment}
      empty="No equipment listed yet."
      blank={{ name: "", quantity: 1, condition: "working", notes: "" }}
      onRemove={(id) => store.removeEquipment(lab.id, id)}
      onSave={(draft, editingId) =>
        editingId ? store.updateEquipment(lab.id, editingId, draft) : store.addEquipment(lab.id, draft)
      }
      renderItem={(item) => (
        <>
          <p className="font-medium">{item.name}</p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-portfolio-mist">
            <span>Qty {item.quantity}</span>
            <ConditionTag condition={item.condition} />
            {item.notes ? <span>{item.notes}</span> : null}
          </p>
        </>
      )}
      fields={(draft, setDraft) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Equipment" htmlFor="equipment-name">
              <Input
                id="equipment-name"
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              />
            </Field>
            <Field label="Quantity" htmlFor="equipment-quantity">
              <Input
                id="equipment-quantity"
                type="number"
                min={0}
                value={draft.quantity}
                onChange={(event) => setDraft({ ...draft, quantity: Number(event.target.value) })}
              />
            </Field>
          </div>
          <Field label="Condition" htmlFor="equipment-condition">
            <select
              id="equipment-condition"
              className={controlClass}
              value={draft.condition}
              onChange={(event) => setDraft({ ...draft, condition: event.target.value as EquipmentCondition })}
            >
              {EQUIPMENT_CONDITIONS.map((item) => (
                <option key={item} value={item}>
                  {CONDITION_LABELS[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Notes" htmlFor="equipment-notes">
            <Input
              id="equipment-notes"
              value={draft.notes}
              placeholder="Where it is kept, or what needs attention"
              onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
            />
          </Field>
        </>
      )}
    />
  );
}

export function SoftwarePanel({ lab }: { lab: Lab }) {
  const store = useLabStore();
  return (
    <InventoryPanel
      title="Software"
      intro="List the programs installed on the computers in this lab, including the version and which machines have them."
      items={lab.software}
      empty="No software listed yet."
      blank={{ name: "", version: "", installedOn: "" }}
      onRemove={(id) => store.removeSoftware(lab.id, id)}
      onSave={(draft, editingId) =>
        editingId ? store.updateSoftware(lab.id, editingId, draft) : store.addSoftware(lab.id, draft)
      }
      renderItem={(item) => (
        <>
          <p className="font-medium">{item.name}</p>
          <p className="mt-1 text-sm text-portfolio-mist">
            {item.version ? `Version ${item.version}` : "Version not set"} · {item.installedOn}
          </p>
        </>
      )}
      fields={(draft, setDraft) => (
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Software" htmlFor="software-name">
            <Input id="software-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          </Field>
          <Field label="Version" htmlFor="software-version">
            <Input
              id="software-version"
              value={draft.version}
              placeholder="2022"
              onChange={(event) => setDraft({ ...draft, version: event.target.value })}
            />
          </Field>
          <Field label="Installed on" htmlFor="software-where">
            <Input
              id="software-where"
              value={draft.installedOn}
              placeholder="All computers"
              onChange={(event) => setDraft({ ...draft, installedOn: event.target.value })}
            />
          </Field>
        </div>
      )}
    />
  );
}

function InventoryPanel<T extends Equipment | SoftwareItem>({
  title,
  intro,
  items,
  empty,
  blank,
  onRemove,
  onSave,
  renderItem,
  fields,
}: {
  title: string;
  intro: string;
  items: T[];
  empty: string;
  blank: Omit<T, "id">;
  onRemove: (id: string) => Result;
  onSave: (draft: Omit<T, "id">, editingId: string | null) => Result;
  renderItem: (item: T) => ReactNode;
  fields: (draft: Omit<T, "id">, setDraft: (next: Omit<T, "id">) => void) => ReactNode;
}) {
  const [draft, setDraft] = useState<Omit<T, "id">>(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = onSave(draft, editingId);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setDraft(blank);
    setEditingId(null);
    setMessage(null);
  }

  return (
    <div className="grid gap-5">
      <Panel title={editingId ? `Update ${title.toLowerCase()}` : `Add ${title.toLowerCase()}`}>
        <form noValidate className="grid gap-4" onSubmit={onSubmit}>
          <p className="text-sm leading-relaxed text-portfolio-mist">{intro}</p>
          {fields(draft, setDraft)}
          <div className="flex flex-wrap gap-2">
            <Button type="submit">{editingId ? "Save changes" : `Add ${title.toLowerCase()}`}</Button>
            {editingId ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditingId(null);
                  setDraft(blank);
                  setMessage(null);
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
          <FormMessage message={message} />
        </form>
      </Panel>
      <Panel title={title}>
        {items.length === 0 ? (
          <p className="text-sm text-portfolio-mist">{empty}</p>
        ) : (
          <ul className="divide-y divide-portfolio-line">
            {items.map((item) => (
              <li key={item.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div>{renderItem(item)}</div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const { id: _id, ...rest } = item;
                      setDraft(rest);
                      setEditingId(item.id);
                      setMessage(null);
                      setPendingRemove(null);
                    }}
                  >
                    Edit
                  </Button>
                  {pendingRemove === item.id ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const result = onRemove(item.id);
                        if (!result.ok) setMessage(result.message);
                        if (editingId === item.id) {
                          setEditingId(null);
                          setDraft(blank);
                        }
                        setPendingRemove(null);
                      }}
                    >
                      Confirm remove
                    </Button>
                  ) : (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setPendingRemove(item.id)}>
                      Remove
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

export function LabDetailsPanel({ lab, onRemoved }: { lab: Lab; onRemoved: () => void }) {
  const store = useLabStore();
  const [name, setName] = useState(lab.name);
  const [code, setCode] = useState(lab.code);
  const [location, setLocation] = useState(lab.location);
  const [kind, setKind] = useState<LabKind>(lab.kind);
  const [capacity, setCapacity] = useState(lab.capacity);
  const [description, setDescription] = useState(lab.description);
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = store.updateLab(lab.id, { name, code, location, kind, capacity, description });
    if (!result.ok) {
      setMessage(result.message);
      setSaved(false);
      return;
    }
    setMessage(null);
    setSaved(true);
  }

  return (
    <div className="grid gap-5">
      <Panel title="Lab details">
        <form noValidate className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="lab-name">
              <Input id="lab-name" value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
            <Field label="Code" htmlFor="lab-code">
              <Input id="lab-code" value={code} onChange={(event) => setCode(event.target.value)} />
            </Field>
          </div>
          <Field label="Location" htmlFor="lab-location">
            <Input id="lab-location" value={location} onChange={(event) => setLocation(event.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kind" htmlFor="lab-kind">
              <select id="lab-kind" className={controlClass} value={kind} onChange={(event) => setKind(event.target.value as LabKind)}>
                {LAB_KINDS.map((item) => (
                  <option key={item} value={item}>
                    {KIND_LABELS[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Capacity" htmlFor="lab-capacity">
              <Input
                id="lab-capacity"
                type="number"
                min={1}
                value={capacity}
                onChange={(event) => setCapacity(Number(event.target.value))}
              />
            </Field>
          </div>
          <Field label="Description" htmlFor="lab-description">
            <Textarea id="lab-description" value={description} onChange={(event) => setDescription(event.target.value)} />
          </Field>
          <Button type="submit">Save lab details</Button>
          {saved ? <p className="text-sm text-portfolio-teal">Lab details saved.</p> : null}
          <FormMessage message={message} />
        </form>
      </Panel>
      <Panel title="Remove lab">
        <p className="text-sm leading-relaxed text-portfolio-mist">
          Removing this lab also clears its attendance register, equipment, and software list.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {confirmRemove ? (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  const result = store.removeLab(lab.id);
                  if (!result.ok) {
                    setMessage(result.message);
                    return;
                  }
                  onRemoved();
                }}
              >
                Remove {lab.name}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setConfirmRemove(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" onClick={() => setConfirmRemove(true)}>
              Remove this lab
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );
}

export function AddLabForm({ onDone }: { onDone: () => void }) {
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
    setMessage(null);
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
            <Input
              id="new-lab-capacity"
              type="number"
              min={1}
              value={capacity}
              onChange={(event) => setCapacity(Number(event.target.value))}
            />
          </Field>
        </div>
        <Field label="Description" htmlFor="new-lab-description">
          <Textarea id="new-lab-description" value={description} onChange={(event) => setDescription(event.target.value)} />
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button type="submit">Add lab</Button>
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
        </div>
        <FormMessage message={message} />
      </form>
    </Panel>
  );
}
