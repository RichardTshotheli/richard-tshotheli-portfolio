import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { Field, FormMessage, Panel } from "@/components/lab-board/field";
import { useLabStore } from "@/components/lab-board/lab-store";
import { LoginQr } from "@/components/lab-board/login-qr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isAdmin, type Role } from "@/lib/lab-board";

export const Route = createFileRoute("/labs/people")({
  component: PeoplePage,
});

function PeoplePage() {
  const store = useLabStore();
  const user = store.currentUser;
  const state = store.state;
  if (!user || !state) return null;
  if (!isAdmin(user)) {
    return <main className="mx-auto max-w-6xl px-5 py-10 text-muted-foreground sm:px-8">Only an admin can manage people.</main>;
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <AddPerson />
      <section className="grid gap-3">
        <h1 className="font-display text-4xl font-semibold">People</h1>
        {state.users.map((person) => (
          <article key={person.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{person.name}</h2>
                <p className="text-sm text-muted-foreground">Student or staff number {person.username}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-secondary px-2 py-1">{person.role === "admin" ? "Admin" : "Lab assistant"}</span>
                {person.role === "assistant" && person.canOperateLabs ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-800">Can open labs</span>
                ) : null}
                {!person.active ? <span className="rounded-full bg-slate-200 px-2 py-1 text-slate-700">Inactive</span> : null}
              </div>
            </div>
            {person.id !== user.id ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {person.role === "assistant" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant={person.canOperateLabs ? "outline" : "default"}
                    onClick={() => store.setAccess(person.id, { canOperateLabs: !person.canOperateLabs })}
                  >
                    {person.canOperateLabs ? "Remove lab rights" : "Give lab rights"}
                  </Button>
                ) : null}
                <Button type="button" size="sm" variant="outline" onClick={() => store.setAccess(person.id, { active: !person.active })}>
                  {person.active ? "Deactivate" : "Activate"}
                </Button>
                <ResetPassword userId={person.id} />
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">This is the account you are using.</p>
            )}
            <div className="mt-4 border-t border-border pt-4">
              <LoginQr number={person.username} size={112} />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function AddPerson() {
  const store = useLabStore();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("assistant");
  const [rights, setRights] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = await store.createAccount({
      name,
      username,
      password,
      role,
      canOperateLabs: role === "assistant" && rights,
    });
    if (!result.ok) {
      setMessage(result.message);
      setSaved(false);
      return;
    }
    setName("");
    setUsername("");
    setPassword("");
    setMessage(null);
    setSaved(true);
  }

  return (
    <Panel title="Add a person">
      <form noValidate className="grid gap-3" onSubmit={onSubmit}>
        <Field label="Full name" htmlFor="person-name">
          <Input id="person-name" value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label="Student or staff number" htmlFor="person-username">
          <Input id="person-username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </Field>
        <Field label="Password" htmlFor="person-password">
          <Input id="person-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Field>
        <Field label="Role" htmlFor="person-role">
          <select id="person-role" className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={role} onChange={(event) => setRole(event.target.value as Role)}>
            <option value="assistant">Lab assistant</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        {role === "assistant" ? (
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" checked={rights} onChange={(event) => setRights(event.target.checked)} />
            <span>Can open labs</span>
          </label>
        ) : null}
        <Button type="submit">Add person</Button>
        {saved ? <p className="text-sm font-medium text-emerald-700">Account created.</p> : null}
        <FormMessage message={message} />
      </form>
    </Panel>
  );
}

function ResetPassword({ userId }: { userId: string }) {
  const store = useLabStore();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  if (!open) {
    return (
      <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(true)}>
        Reset password
      </Button>
    );
  }

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={async (event) => {
        event.preventDefault();
        const result = await store.resetPassword(userId, password);
        if (!result.ok) {
          setMessage(result.message);
          return;
        }
        setPassword("");
        setOpen(false);
        setMessage(null);
      }}
    >
      <Input type="password" value={password} placeholder="New password" aria-label="New password" onChange={(event) => setPassword(event.target.value)} />
      <Button type="submit" size="sm">
        Save
      </Button>
      {message ? <span className="text-sm text-destructive">{message}</span> : null}
    </form>
  );
}
