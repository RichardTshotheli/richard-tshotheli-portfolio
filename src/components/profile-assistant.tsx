import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { answerQuestion, conversationPrompts, type AssistantProfile, type ChatTurn } from "@/lib/profile-assistant";

type Message = ChatTurn;

const storageKey = "richard-portfolio-chat";

export function ProfileAssistant({ profile }: { profile: AssistantProfile }) {
  const first = profile.name.split(" ")[0] ?? profile.name;
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const greeting = `Hello. I can chat about ${first}: his work, studies, skills, and how to reach him. I stay with the published profile, and I remember this conversation so you can ask follow-ups.`;
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: greeting }]);
  const [threadReady, setThreadReady] = useState(false);
  const prompts = conversationPrompts(profile, messages);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const thread = useRef<Message[]>(messages);
  thread.current = messages;

  useEffect(() => {
    const saved = loadChat(greeting);
    setMessages(saved);
    setThreadReady(true);
  }, [greeting]);

  useEffect(() => {
    if (!threadReady) return;
    sessionStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, threadReady]);

  useEffect(() => {
    const openPanel = () => setOpen(true);
    window.addEventListener("open-profile-assistant", openPanel);
    return () => window.removeEventListener("open-profile-assistant", openPanel);
  }, []);

  useEffect(() => {
    if (!open) return;
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
    field.current?.focus();
  }, [open, messages, pending]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    const history = thread.current;
    setMessages([...history, { role: "user", text: trimmed }]);
    setInput("");
    setPending(true);
    window.setTimeout(() => {
      setMessages((now) => [...now, { role: "assistant", text: answerQuestion(profile, trimmed, history) }]);
      setPending(false);
    }, 280);
  }

  return (
    <>
      {open ? null : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 bg-portfolio-navy px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-portfolio-navy/90"
        >
          <MessageCircle className="size-4 text-portfolio-gold" aria-hidden="true" />
          Ask AI
        </button>
      )}

      {open ? (
        <div className="fixed inset-0 z-40 flex items-end justify-end bg-portfolio-navy/30 p-3 sm:p-5" onClick={() => setOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
            className="flex h-[min(40rem,100%)] w-full max-w-md flex-col border border-white/10 bg-portfolio-surface shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 bg-portfolio-navy px-4 py-4 text-white">
              <div>
                <p id={titleId} className="font-display text-lg font-semibold">
                  Ask about {first}
                </p>
                <p className="mt-1 text-xs text-white/70">Chat about Richard. This thread is remembered.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-white/80 hover:text-white" aria-label="Close assistant">
                <X className="size-5" />
              </button>
            </header>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.map((message, index) => (
                <p
                  key={`${message.role}-${index}`}
                  className={`max-w-[95%] whitespace-pre-wrap px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {message.text}
                </p>
              ))}
              {pending ? <p className="bg-secondary px-3 py-2 text-sm text-portfolio-mist">Thinking with the profile…</p> : null}
              <div className="flex flex-wrap gap-2 pt-2">
                {prompts.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => ask(suggestion)}
                    className="border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-left text-xs text-primary hover:bg-primary/10"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <form
              className="border-t border-portfolio-line p-3"
              onSubmit={(event) => {
                event.preventDefault();
                ask(input);
              }}
            >
              <label htmlFor="profile-question" className="sr-only">
                Question about {profile.name}
              </label>
              <textarea
                ref={field}
                id="profile-question"
                rows={3}
                value={input}
                maxLength={4000}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    ask(input);
                  }
                }}
                placeholder="Chat about Richard — his work, studies, skills, or anything on the profile"
                className="w-full resize-none border border-portfolio-line bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-portfolio-mist">Enter to send</p>
                <Button type="submit" variant="portfolio" disabled={pending || !input.trim()}>
                  <Send /> Send
                </Button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}

function loadChat(greeting: string): Message[] {
  if (typeof sessionStorage === "undefined") return [{ role: "assistant", text: greeting }];
  try {
    const saved = sessionStorage.getItem(storageKey);
    const parsed = saved ? (JSON.parse(saved) as Message[]) : [];
    if (Array.isArray(parsed) && parsed.length && parsed.every((item) => item && (item.role === "assistant" || item.role === "user") && typeof item.text === "string")) {
      return parsed;
    }
  } catch {
    // A broken saved thread should not block a new chat.
  }
  return [{ role: "assistant", text: greeting }];
}
