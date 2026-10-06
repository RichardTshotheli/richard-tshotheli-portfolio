import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { LoginQr } from "@/components/lab-board/login-qr";
import { useLabStore } from "@/components/lab-board/lab-store";
import { isAdmin } from "@/lib/lab-board";
import { CSE_LABS_URL } from "@/lib/lab-links";

export const Route = createFileRoute("/labs/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const store = useLabStore();
  const user = store.currentUser;
  const [copied, setCopied] = useState(false);
  if (!user) return null;
  if (!isAdmin(user)) {
    return <main className="mx-auto max-w-6xl px-5 py-10 text-muted-foreground sm:px-8">Only an admin can open settings.</main>;
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <h1 className="font-display text-4xl font-semibold">Settings</h1>
      <section className="mt-6 w-fit rounded-2xl border border-border bg-white p-6 shadow-sm">
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
    </main>
  );
}
