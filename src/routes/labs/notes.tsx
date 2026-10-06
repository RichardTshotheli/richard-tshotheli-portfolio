import { createFileRoute } from "@tanstack/react-router";

import { useLabStore } from "@/components/lab-board/lab-store";
import { Button } from "@/components/ui/button";
import { NOTE_LABELS, formatWhen, isAdmin } from "@/lib/lab-board";

export const Route = createFileRoute("/labs/notes")({
  component: NotesPage,
});

function NotesPage() {
  const store = useLabStore();
  const user = store.currentUser;
  const state = store.state;
  if (!user || !state) return null;

  const notes = isAdmin(user) ? state.notes : state.notes.filter((note) => note.authorId === user.id);
  const openNotes = notes.filter((note) => note.status === "open");
  const resolved = notes.filter((note) => note.status === "resolved");

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <h1 className="font-display text-4xl font-semibold">{isAdmin(user) ? "Notes from the labs" : "Your notes"}</h1>

      <section className="mt-6 grid gap-3">
        <h2 className="font-display text-2xl font-semibold">Open ({openNotes.length})</h2>
        {openNotes.length === 0 ? <p className="text-sm text-muted-foreground">No open notes.</p> : null}
        {openNotes.map((note) => (
          <NoteCard key={note.id} noteId={note.id} labName={state.labs.find((lab) => lab.id === note.labId)?.name ?? "Lab"} />
        ))}
      </section>

      {resolved.length > 0 ? (
        <section className="mt-8 grid gap-3">
          <h2 className="font-display text-2xl font-semibold">Handled</h2>
          {resolved.map((note) => (
            <NoteCard key={note.id} noteId={note.id} labName={state.labs.find((lab) => lab.id === note.labId)?.name ?? "Lab"} />
          ))}
        </section>
      ) : null}
    </main>
  );
}

function NoteCard({ noteId, labName }: { noteId: string; labName: string }) {
  const store = useLabStore();
  const note = store.state?.notes.find((item) => item.id === noteId);
  const user = store.currentUser;
  if (!note || !user) return null;

  return (
    <article className={`rounded-2xl border bg-card p-4 shadow-sm ${note.status === "open" ? "border-amber-200" : "border-border"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">{NOTE_LABELS[note.kind]}</p>
        <p className="text-xs text-muted-foreground">{formatWhen(note.createdAt)}</p>
      </div>
      <h3 className="mt-2 font-semibold">{labName}</h3>
      <p className="mt-2 leading-relaxed">{note.message}</p>
      <p className="mt-2 text-sm text-muted-foreground">From {note.authorName}</p>
      {isAdmin(user) && note.status === "open" ? (
        <Button className="mt-3" type="button" size="sm" variant="outline" onClick={() => store.resolveNote(note.id)}>
          Mark as handled
        </Button>
      ) : null}
    </article>
  );
}
