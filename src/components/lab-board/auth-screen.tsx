import { useState, type FormEvent } from "react";

import { Field, FormMessage, controlClass } from "@/components/lab-board/field";
import { useLabStore } from "@/components/lab-board/lab-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthScreen({ mode }: { mode: "setup" | "login" }) {
  const store = useLabStore();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result =
      mode === "setup"
        ? await store.createAccount({ name, username, password, role: "admin", canOperateLabs: false })
        : await store.login(username, password);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    if (mode === "setup") {
      const signedIn = await store.login(username, password);
      if (!signedIn.ok) setMessage(signedIn.message);
    }
  }

  return (
    <div className="lab-app flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/40 bg-card shadow-xl md:grid-cols-[1.05fr_0.95fr]">
        <section className="bg-[var(--lab-header)] px-8 py-10 text-white sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-100">Laboratory operations</p>
          <h1 className="mt-4 max-w-sm font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Open labs, keep the register, and look after the equipment.
          </h1>
          <ul className="mt-8 space-y-3 text-sm leading-relaxed text-teal-50/90">
            <li>Lab assistants mark a lab open when they are on duty.</li>
            <li>The register shows how many students are inside.</li>
            <li>Assistants send maintenance and missing-item notes to the admin.</li>
            <li>The admin manages people, rights, and what is in each lab.</li>
          </ul>
        </section>
        <form noValidate className="grid content-center gap-4 px-8 py-10 sm:px-10" onSubmit={onSubmit}>
          <div>
            <h2 className="font-display text-3xl font-semibold">{mode === "setup" ? "Create the admin account" : "Sign in"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {mode === "setup"
                ? "This first account manages users and equipment. You can add lab assistants after signing in."
                : "Use the username and password given by the admin."}
            </p>
          </div>
          {mode === "setup" ? (
            <Field label="Full name" htmlFor="admin-name">
              <Input id="admin-name" value={name} autoComplete="name" onChange={(event) => setName(event.target.value)} />
            </Field>
          ) : null}
          <Field label="Username" htmlFor="username">
            <Input
              id="username"
              value={username}
              autoComplete="username"
              className={controlClass}
              onChange={(event) => setUsername(event.target.value)}
            />
          </Field>
          <Field label="Password" htmlFor="password" {...(mode === "setup" ? { hint: "At least 6 characters." } : {})}>
            <Input
              id="password"
              type="password"
              value={password}
              autoComplete={mode === "setup" ? "new-password" : "current-password"}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          <Button type="submit" size="lg">
            {mode === "setup" ? "Create admin and sign in" : "Sign in"}
          </Button>
          <FormMessage message={message} />
        </form>
      </div>
    </div>
  );
}
