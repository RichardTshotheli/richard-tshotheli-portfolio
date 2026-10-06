import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

import { AuthScreen } from "@/components/lab-board/auth-screen";
import { TutLogo } from "@/components/lab-board/brand";
import { LabStoreProvider, useLabStore } from "@/components/lab-board/lab-store";

export const Route = createFileRoute("/labs")({
  head: () => ({
    meta: [
      { title: "CSE Labs" },
      {
        name: "description",
        content:
          "CSE Labs for Computer Systems Engineering at Tshwane University of Technology. Assistants open labs and keep the register. Admins manage people, equipment, and notes.",
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
      <div className="lab-app grid min-h-screen place-items-center text-muted-foreground">Loading CSE Labs…</div>
    );
  }
  if (store.state.users.length === 0) return <AuthScreen mode="setup" />;
  if (!store.currentUser) return <AuthScreen mode="login" />;

  const user = store.currentUser;
  const openNotes = store.state.notes.filter((note) => note.status === "open").length;
  const roleLabel = user.role === "admin" ? "Admin" : user.role === "student" ? "Student" : user.canOperateLabs ? "Lab assistant" : "No lab rights";

  return (
    <div className="lab-app min-h-screen">
      <header>
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <TutLogo className="h-12" />
              <div>
                <p className="font-display text-xl font-semibold leading-none text-[var(--lab-header)]">CSE Labs</p>
                <p className="mt-1 text-xs text-muted-foreground">Computer Systems Engineering</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <p>
                {user.name}
                <span className="ml-2 text-muted-foreground">{user.username}</span>
                <span className="ml-2 rounded-full bg-[var(--lab-header)] px-2 py-0.5 text-xs font-semibold text-white">{roleLabel}</span>
              </p>
              <button type="button" className="rounded-full border border-[var(--lab-header)] px-3 py-1 text-[var(--lab-header)] hover:bg-[var(--lab-mint)]" onClick={() => store.logout()}>
                Sign out
              </button>
            </div>
          </div>
        </div>
        <nav className="bg-[var(--lab-header)]" aria-label="Laboratory">
        <div className="mx-auto flex max-w-6xl gap-2 px-5 py-3 sm:px-8">
          <NavLink to="/labs" label="Labs" />
          {user.role !== "student" ? <NavLink to="/labs/notes" label={user.role === "admin" ? `Notes (${openNotes})` : "Notes"} /> : null}
          {user.role === "admin" ? <NavLink to="/labs/people" label="People" /> : null}
          {user.role === "admin" ? <NavLink to="/labs/settings" label="Settings" /> : null}
        </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

function NavLink({ to, label }: { to: "/labs" | "/labs/notes" | "/labs/people" | "/labs/settings"; label: string }) {
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
