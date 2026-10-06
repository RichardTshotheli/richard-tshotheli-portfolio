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
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/50 bg-card shadow-xl">
        <div className="flex items-center gap-4 border-b border-border px-8 py-5">
          <TutLogo className="h-16" />
          <div>
            <h1 className="font-display text-3xl font-semibold leading-none text-[var(--lab-header)]">CSE Labs</h1>
            <p className="mt-1 text-sm text-muted-foreground">Computer Systems Engineering</p>
          </div>
        </div>
        <div className={`grid ${mode === "login" ? "md:grid-cols-[1.05fr_0.95fr]" : ""}`}>
        {mode === "login" ? (
          <section className="flex items-end bg-[var(--lab-header)] px-8 py-10 text-white sm:px-10">
            <LoginQr />
          </section>
        ) : null}
        <form noValidate className="grid content-center gap-4 px-8 py-10 sm:px-10" onSubmit={onSubmit}>
          <h2 className="font-display text-3xl font-semibold">{mode === "setup" ? "Create the admin account" : "Sign in"}</h2>
          {mode === "setup" ? (
            <Field label="Full name" htmlFor="admin-name">
              <Input id="admin-name" value={name} autoComplete="name" onChange={(event) => setName(event.target.value)} />
            </Field>
          ) : null}
          <Field label="Student or staff number" htmlFor="staff-number">
            <Input
              id="staff-number"
              value={number}
              autoComplete="username"
              inputMode="text"
              className={controlClass}
              onChange={(event) => setNumber(event.target.value)}
            />
          </Field>
          <Field label="Password" htmlFor="password">
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
    </div>
  );
}
