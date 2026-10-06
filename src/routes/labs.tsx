import { Outlet, createFileRoute, Link } from "@tanstack/react-router";

import { LabStoreProvider } from "@/components/lab-board/lab-store";

export const Route = createFileRoute("/labs")({
  head: () => ({
    meta: [
      { title: "Laboratory board — Richard Tshotheli" },
      {
        name: "description",
        content:
          "Open a lab when people need it, register attendance as they enter, and keep equipment and computer software up to date.",
      },
    ],
  }),
  component: LabsLayout,
});

function LabsLayout() {
  return (
    <LabStoreProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-white/10 bg-portfolio-navy text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-gold">Laboratory board</p>
              <p className="truncate font-display text-lg font-semibold">Computer systems engineering labs</p>
            </div>
            <nav className="flex shrink-0 items-center gap-4 text-sm" aria-label="Laboratory">
              <Link to="/labs" className="text-white/80 hover:text-white">
                All labs
              </Link>
            </nav>
          </div>
        </header>
        <Outlet />
      </div>
    </LabStoreProvider>
  );
}
