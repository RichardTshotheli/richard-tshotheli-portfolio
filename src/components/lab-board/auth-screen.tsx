import { useEffect, useState, type FormEvent } from "react";

import { TutLogo } from "@/components/lab-board/brand";
import { Field, FormMessage, controlClass } from "@/components/lab-board/field";
import { useLabStore } from "@/components/lab-board/lab-store";
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
    <div className="lab-app lab-auth flex min-h-screen items-center justify-center px-4 py-10">
      <form noValidate className="grid w-full max-w-md gap-4 rounded-3xl bg-white px-8 py-10 shadow-xl" onSubmit={onSubmit}>
        <div className="mb-2">
          <TutLogo className="h-16" />
          <h1 className="mt-4 font-display text-3xl font-semibold leading-none text-[var(--lab-header)]">CSE Labs</h1>
          <p className="mt-2 text-sm text-muted-foreground">Computer Systems Engineering</p>
        </div>
        <h2 className="font-display text-2xl font-semibold">{mode === "setup" ? "Create the admin account" : "Sign in"}</h2>
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
  );
}
