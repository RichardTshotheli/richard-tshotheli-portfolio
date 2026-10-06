import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

import { AuthScreen } from "@/components/lab-board/auth-screen";
import { LabStoreProvider, useLabStore } from "@/components/lab-board/lab-store";

export const Route = createFileRoute("/labs")({
  head: () => ({
    meta: [
      { title: "Laboratory operations" },
      {
        name: "description",
        content:
          "Lab assistants open labs and keep the student register. Admins manage people, equipment, and maintenance notes.",
      },
    ],
  }),
  component: LabsLayout,
});

function LabsLayout() {
  return (
    <LabStoreProvider>
      <LabsFrame />
    </LabStoreProvider>
  );
}

function LabsFrame() {
  const store = useLabStore();
  if (!store.ready || !store.state) {
    return (
      <div className="lab-app grid min-h-screen place-items-center text-muted-foreground">Loading laboratory operations…</div>
    );
  }
  if (store.state.users.length === 0) return <AuthScreen mode="setup" />;
  if (!store.currentUser) return <AuthScreen mode="login" />;

  const user = store.currentUser;
  const openNotes = store.state.notes.filter((note) => note.status === "open").length;
  const roleLabel = user.role === "admin" ? "Admin" : user.canOperateLabs ? "Lab assistant" : "No lab rights";

  return (
    <div className="lab-app min-h-screen">
      <header className="border-b border-white/10 bg-[var(--lab-header)] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-100">Laboratory operations</p>
            <p className="font-display text-xl font-semibold">Computer systems labs</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <p className="text-teal-50">
              {user.name}
              <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold">{roleLabel}</span>
            </p>
            <button type="button" className="rounded-full border border-white/30 px-3 py-1 hover:bg-white/10" onClick={() => store.logout()}>
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 px-5 pb-3 sm:px-8" aria-label="Laboratory">
          <NavLink to="/labs" label="Labs" />
          <NavLink to="/labs/notes" label={user.role === "admin" ? `Notes (${openNotes})` : "Notes"} />
          {user.role === "admin" ? <NavLink to="/labs/people" label="People" /> : null}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

function NavLink({ to, label }: { to: "/labs" | "/labs/notes" | "/labs/people"; label: string }) {
  return (
    <Link
      to={to}
      className="rounded-full px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 hover:text-white data-[status=active]:bg-white data-[status=active]:text-[var(--lab-header)]"
      activeOptions={{ exact: to === "/labs" }}
    >
      {label}
    </Link>
  );
}
