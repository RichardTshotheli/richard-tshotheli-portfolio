import { useEffect, useState, type FormEvent } from "react";

import { TutLogo } from "@/components/lab-board/brand";
import { Field, FormMessage, controlClass } from "@/components/lab-board/field";
import { useLabStore } from "@/components/lab-board/lab-store";
import { LoginQr } from "@/components/lab-board/login-qr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthScreen({ mode }: { mode: "setup" | "login" }) {
  const store = useLabStore();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fromLink = new URLSearchParams(window.location.search).get("number")?.trim() ?? "";
    if (fromLink) setNumber(fromLink);
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result =
      mode === "setup"
        ? await store.createAccount({ name, username: number, password, role: "admin", canOperateLabs: false })
        : await store.login(number, password);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    if (mode === "setup") {
      const signedIn = await store.login(number, password);
      if (!signedIn.ok) setMessage(signedIn.message);
    }
  }

  return (
    <div className="lab-app flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/50 bg-card shadow-xl md:grid-cols-[1.05fr_0.95fr]">
        <section className="bg-[var(--lab-header)] px-8 py-10 text-white sm:px-10">
          <TutLogo className="h-14" />
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl">CSE Labs</h1>
          <p className="mt-2 max-w-sm text-lg text-white/90">Computer Systems Engineering</p>
          <ul className="mt-8 space-y-3 text-sm leading-relaxed text-white/85">
            <li>Lab assistants mark a lab open when they are on duty.</li>
            <li>The register shows how many students are inside.</li>
            <li>Assistants send maintenance and missing-item notes to the admin.</li>
            <li>The admin manages people, rights, and what is in each lab.</li>
          </ul>
          {mode === "login" ? (
            <div className="mt-8 text-white/80">
              <LoginQr caption="Scan with your phone to open CSE Labs." />
            </div>
          ) : null}
        </section>
        <form noValidate className="grid content-center gap-4 px-8 py-10 sm:px-10" onSubmit={onSubmit}>
          <div>
            <h2 className="font-display text-3xl font-semibold">{mode === "setup" ? "Create the admin account" : "Sign in"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {mode === "setup"
                ? "Use your staff number. This first account manages users and equipment. You can add lab assistants after signing in."
                : "Enter your student or staff number, then your password."}
            </p>
          </div>
          {mode === "setup" ? (
            <Field label="Full name" htmlFor="admin-name">
              <Input id="admin-name" value={name} autoComplete="name" onChange={(event) => setName(event.target.value)} />
            </Field>
          ) : null}
          <Field label="Student or staff number" htmlFor="staff-number" hint="4–12 letters or digits.">
            <Input
              id="staff-number"
              value={number}
              autoComplete="username"
              inputMode="text"
              className={controlClass}
              onChange={(event) => setNumber(event.target.value)}
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
