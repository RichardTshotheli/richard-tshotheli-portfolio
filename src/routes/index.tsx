import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Check, LogOut, Pencil, Plus, Save, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import portraitImage from "@/assets/richard-portrait.jpg";
import { ProfileAssistant } from "@/components/profile-assistant";
import { openProfileAssistant } from "@/lib/profile-assistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

type Project = { title: string; category: string; description: string; image: string };
type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  duties: string[];
};
type Education = { qualification: string; institution: string; period: string; detail: string };
type SkillGroup = { label: string; items: string[] };
type Portfolio = {
  name: string;
  role: string;
  intro: string;
  bio: string;
  location: string;
  status: string;
  email: string;
  linkedin: string;
  skills: string[];
  skillGroups: SkillGroup[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
};

const fallback: Portfolio = {
  name: "Richard Tshotheli",
  role: "Computer Systems Engineer",
  intro:
    "Computer systems engineer with hands-on experience in software development, systems monitoring, electronics, cloud support, and technical operations.",
  bio: "Computer Systems Engineering graduate of Tshwane University of Technology. My public profile covers software development, cybersecurity, electronics, cloud and desktop support, databases, and AI and machine learning. I currently supervise laboratory assistants and manage computer systems engineering components at TUT in Soshanguve, after a year as a system monitoring engineer at Kapsch TrafficCom South Africa.",
  location: "Gauteng, South Africa",
  status: "Tshwane University of Technology",
  email: "",
  linkedin: "https://www.linkedin.com/in/richard-tshotheli-069450277",
  skills: [],
  skillGroups: [
    { label: "Software", items: ["C#", "C++", "JavaScript", "Python", "HTML", "Embarcadero", "PIC programming"] },
    {
      label: "Systems and networks",
      items: [
        "Linux",
        "Ubuntu",
        "Cisco networking",
        "Packet Tracer",
        "SCADA",
        "Operating systems",
        "System monitoring",
        "Network monitoring tools",
        "Real-time monitoring",
        "Remote monitoring",
        "Remote desktop",
        "Desktop computers",
      ],
    },
    {
      label: "Data and cloud",
      items: [
        "MySQL",
        "Oracle Database",
        "Microsoft Azure",
        "Microsoft Endpoint Configuration Manager",
        "SaaS",
        "Data analysis",
        "Data processing",
        "Statistics",
        "Computational mathematics",
      ],
    },
    {
      label: "Electronics",
      items: ["Digital electronics", "Electrical engineering", "Electronics", "Logic design", "Robotics"],
    },
    {
      label: "Software practice",
      items: [
        "Software development",
        "SDLC",
        "Software system analysis",
        "Application support",
        "Service desk",
        "Service delivery",
        "Project management",
        "Microsoft Office",
        "Microsoft Copilot",
        "Report writing",
      ],
    },
    { label: "AI", items: ["Artificial intelligence", "Machine learning"] },
    {
      label: "Leadership and laboratories",
      items: [
        "Laboratory skills",
        "Laboratory safety",
        "Supervision",
        "Team leadership",
        "Team management",
        "Team building",
        "Teaching",
        "University lecturing",
        "Management",
        "Customer service",
      ],
    },
  ],
  experience: [
    {
      role: "Laboratory Assistants Supervisor & CSE Components Manager",
      company: "Tshwane University of Technology",
      period: "Mar 2025 – Present",
      location: "Soshanguve, Gauteng",
      summary: "Manager in the Engineering and Technical department.",
      duties: [
        "Supervise laboratory assistants for Computer Systems Engineering",
        "Manage computer systems engineering components and laboratory resources",
        "Support laboratory safety and day-to-day laboratory operations",
        "Coordinate practical laboratory work for the Engineering and Technical department",
      ],
    },
    {
      role: "System Monitoring Engineer",
      company: "Kapsch TrafficCom South Africa",
      period: "Jul 2023 – Jul 2024",
      location: "South Africa",
      summary: "Specialist in the Engineering and Technical department for intelligent mobility and traffic systems.",
      duties: [
        "Monitored live operational systems for traffic and mobility services",
        "Carried out real-time and remote system monitoring",
        "Used network monitoring tools to confirm system status",
        "Supported engineering and technical operations from the specialist desk",
      ],
    },
  ],
  education: [
    {
      qualification: "Advanced Diploma, Computer Systems Engineering",
      institution: "Tshwane University of Technology",
      period: "2018 – 2023",
      detail: "Pretoria. Diploma and Advanced Diploma in computer systems engineering and computer technology.",
    },
  ],
  projects: [
    {
      title: "Inventory Management System",
      category: "Software",
      description: "A system for recording stock, tracking items, and keeping inventory information in one place.",
      image: "",
    },
    {
      title: "Fire and Gas Management System",
      category: "Safety systems",
      description: "A system for monitoring fire and gas conditions and supporting the response around them.",
      image: "",
    },
    {
      title: "Smart Car",
      category: "Embedded systems",
      description: "A vehicle project that combines electronics and control for smarter car functions.",
      image: "",
    },
    {
      title: "Remote Room Temperature Controller",
      category: "Control systems",
      description: "A controller for reading room temperature and adjusting it from a remote point.",
      image: "",
    },
    {
      title: "Smart Security System",
      category: "Security",
      description: "A security system that brings sensing and control together to monitor a space.",
      image: "",
    },
    {
      title: "Intercom System",
      category: "Communications",
      description: "An intercom system for voice communication between points in a building or site.",
      image: "",
    },
    {
      title: "DC Power Supply",
      category: "Electronics",
      description: "A built DC power supply that provides a controlled direct-current source.",
      image: "",
    },
  ],
};

fallback.skills = fallback.skillGroups.flatMap((group) => group.items);

const nav = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#expertise", label: "Expertise" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function mergePortfolio(saved: Partial<Portfolio>): Portfolio {
  return {
    ...fallback,
    ...saved,
    skills: saved.skills?.length ? saved.skills : fallback.skills,
    skillGroups: saved.skillGroups?.length ? saved.skillGroups : fallback.skillGroups,
    experience: saved.experience?.length
      ? saved.experience.map((item) => ({ summary: "", location: "", duties: [], ...item }))
      : fallback.experience,
    education: saved.education?.length ? saved.education : fallback.education,
    projects: saved.projects?.length ? saved.projects : fallback.projects,
  };
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Richard Tshotheli — Computer Systems Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Richard Tshotheli, a computer systems engineer in Pretoria working across software, systems monitoring, electronics, and technical operations.",
      },
      { property: "og:title", content: "Richard Tshotheli — Computer Systems Engineer" },
      {
        property: "og:description",
        content: "Software, systems monitoring, electronics, and technical operations. Based in Pretoria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [content, setContent] = useState<Portfolio>(fallback);
  const [draft, setDraft] = useState<Portfolio>(fallback);
  const [editorOpen, setEditorOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    async function load() {
      try {
        const [portfolioResult, sessionResult] = await Promise.all([
          supabase.from("portfolio_content").select("content").eq("slug", "main").maybeSingle(),
          supabase.auth.getSession(),
        ]);
        if (!active) return;
        if (portfolioResult.data?.content) {
          const merged = mergePortfolio(portfolioResult.data.content as Partial<Portfolio>);
          setContent(merged);
          setDraft(merged);
        }
        setSignedIn(Boolean(sessionResult.data.session));
      } catch {
        // The published page still renders from local content if the content service is unavailable.
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
      unsubscribe = () => data.subscription.unsubscribe();
    } catch {
      // Sign-in is only required for editing.
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const initials = useMemo(
    () =>
      content.name
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join(""),
    [content.name],
  );

  const contactHref = isEmail(content.email) ? `mailto:${content.email}` : content.linkedin;
  const contactLabel = isEmail(content.email) ? content.email : "LinkedIn";

  async function savePortfolio() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    setNotice("Saving…");
    const { error } = await supabase
      .from("portfolio_content")
      .update({
        content: draft as unknown as never,
        owner_id: userData.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", "main");
    if (error) {
      setNotice(error.message);
      return;
    }
    setContent(draft);
    setNotice("Saved");
    window.setTimeout(() => setNotice(""), 2200);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-portfolio-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Go to top">
            <span className="grid size-9 place-items-center bg-portfolio-gold font-display text-sm font-semibold text-portfolio-navy">
              {initials}
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">{content.name}</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-white/75 md:flex" aria-label="Page">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={content.linkedin}
            className="inline-flex items-center gap-1 text-sm font-medium text-portfolio-gold hover:underline"
          >
            LinkedIn <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-5 pb-3 text-sm text-white/75 md:hidden" aria-label="Page">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="shrink-0 hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="top" className="mx-auto grid max-w-6xl items-end gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:pt-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-portfolio-gold">{content.role}</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
            {content.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-portfolio-mist sm:text-xl">{content.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="portfolioLight" size="lg" asChild>
              <a href="#experience">View experience</a>
            </Button>
            <Button variant="portfolio" size="lg" type="button" onClick={() => openProfileAssistant()}>
              Ask AI
            </Button>
            <Button variant="portfolioGlass" size="lg" asChild>
              <a href={contactHref}>
                {contactLabel} <ArrowUpRight />
              </a>
            </Button>
          </div>
          <dl className="mt-10 grid gap-6 border-t border-portfolio-line pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-mist">Based in</dt>
              <dd className="mt-1 font-medium">{content.location}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-mist">Currently</dt>
              <dd className="mt-1 font-medium">{content.status}</dd>
            </div>
          </dl>
        </div>
        <figure className="lg:justify-self-end">
          <img
            src={portraitImage}
            alt={`Portrait of ${content.name}`}
            width={1024}
            height={1280}
            className="aspect-[4/5] w-full max-w-md object-cover object-[center_18%] lg:max-h-[640px]"
          />
          <figcaption className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-portfolio-mist">
            <span>{content.name}</span>
            <span>{content.location}</span>
          </figcaption>
        </figure>
      </section>

      <section id="about" className="border-t border-portfolio-line">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 sm:px-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-24">
          <h2 className="font-display text-3xl font-semibold">About</h2>
          <p className="max-w-3xl text-lg leading-relaxed text-foreground/90 sm:text-xl">{content.bio}</p>
        </div>
      </section>

      <section id="experience" className="border-t border-portfolio-line bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-24">
          <h2 className="font-display text-3xl font-semibold">Experience</h2>
          <ol className="space-y-5">
            {content.experience.map((item, index) => (
              <li key={`${item.role}-${index}`} className="border border-portfolio-line border-l-4 border-l-primary bg-portfolio-surface p-6 sm:p-8">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-display text-2xl font-semibold leading-snug">{item.role}</h3>
                  {item.period ? <p className="text-sm font-semibold text-portfolio-teal">{item.period}</p> : null}
                </div>
                <p className="mt-2 text-sm font-medium text-portfolio-mist">
                  {item.company}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                {item.summary ? <p className="mt-3 max-w-2xl leading-relaxed text-foreground/85">{item.summary}</p> : null}
                {item.duties?.length ? (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-gold">Duties</p>
                    <ul className="mt-3 space-y-2">
                      {item.duties.filter(Boolean).map((duty) => (
                        <li key={duty} className="flex gap-3 leading-relaxed">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{duty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <span className="sr-only">Role {String(index + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="projects" className="border-t border-portfolio-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-24">
          <h2 className="font-display text-3xl font-semibold">Projects</h2>
          <div>
            <p className="max-w-2xl leading-relaxed text-portfolio-mist">Systems and hardware Richard has built, from inventory software to safety, control, and power electronics.</p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {content.projects.map((project, index) => (
                <article key={`${project.title}-${index}`} className="border border-portfolio-line border-t-4 border-t-portfolio-teal bg-portfolio-surface p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-teal">{project.category}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold">{project.title}</h3>
                  <p className="mt-3 leading-relaxed text-portfolio-mist">{project.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="expertise" className="border-t border-portfolio-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)]">
            <h2 className="font-display text-3xl font-semibold">Expertise</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.skillGroups.map((group, index) => (
                <article key={group.label} className="border border-portfolio-line bg-portfolio-surface p-6 sm:p-7">
                  <h3
                    className={`text-xs font-semibold uppercase tracking-[0.14em] ${index % 3 === 1 ? "text-portfolio-teal" : index % 3 === 2 ? "text-portfolio-gold" : "text-primary"}`}
                  >
                    {group.label}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-primary/15 bg-primary/10 px-2.5 py-1 text-sm text-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section id="education" className="border-t border-portfolio-line bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-24">
          <h2 className="font-display text-3xl font-semibold">Education</h2>
          <div className="space-y-8">
            {content.education.map((item) => (
              <article key={item.qualification}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-display text-2xl font-semibold leading-snug">{item.qualification}</h3>
                  <p className="text-sm font-medium text-primary">{item.period}</p>
                </div>
                <p className="mt-2 text-sm font-medium text-portfolio-mist">{item.institution}</p>
                <p className="mt-3 max-w-2xl leading-relaxed text-foreground/85">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 bg-portfolio-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-24">
          <h2 className="font-display text-3xl font-semibold text-portfolio-gold">Contact</h2>
          <div>
            <p className="max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Happy to talk about systems, software, and technical roles.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="portfolio" size="lg" asChild>
                <a href={content.linkedin}>
                  LinkedIn <ArrowUpRight />
                </a>
              </Button>
              {isEmail(content.email) ? (
                <Button variant="portfolioGlass" size="lg" asChild>
                  <a href={`mailto:${content.email}`}>{content.email}</a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
        <footer className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-white/10 px-5 py-6 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} {content.name}</span>
          <button
            type="button"
            onClick={() => {
              setDraft(content);
              setEditorOpen(true);
            }}
            className="inline-flex items-center gap-1.5 text-left hover:text-white"
          >
            <Pencil className="size-3.5" aria-hidden="true" /> Edit portfolio
          </button>
        </footer>
      </section>

      {editorOpen ? (
        <EditorModal
          signedIn={signedIn}
          draft={draft}
          setDraft={setDraft}
          notice={notice}
          onSave={savePortfolio}
          onClose={() => setEditorOpen(false)}
        />
      ) : null}
      <ProfileAssistant profile={content} />
      {loading ? <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-primary" /> : null}
    </main>
  );
}

function EditorModal({
  signedIn,
  draft,
  setDraft,
  notice,
  onSave,
  onClose,
}: {
  signedIn: boolean;
  draft: Portfolio;
  setDraft: (value: Portfolio) => void;
  notice: string;
  onSave: () => Promise<void>;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  async function handleEmailAuth() {
    setAuthMessage("Please wait…");
    const result = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      setAuthMessage(result.error.message);
      return;
    }
    setAuthMessage(isSignup && !result.data.session ? "Check your email to confirm your account." : "Signed in.");
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) setAuthMessage(result.error.message);
  }

  function update<K extends keyof Portfolio>(key: K, value: Portfolio[K]) {
    setDraft({ ...draft, [key]: value });
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label="Portfolio editor">
      <div className="mx-auto flex h-full max-w-4xl flex-col overflow-hidden border border-portfolio-line bg-portfolio-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-portfolio-line px-5 py-4">
          <div>
            <p className="font-display text-xl font-semibold">Portfolio editor</p>
            <p className="text-xs text-portfolio-mist">Saved changes replace the published content.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close editor">
            <X />
          </Button>
        </div>
        {!signedIn ? (
          <div className="m-auto w-full max-w-sm p-6">
            <h2 className="font-display text-3xl font-semibold">Owner access</h2>
            <p className="mt-2 text-sm text-portfolio-mist">Sign in to edit the published portfolio.</p>
            <Button variant="portfolioLight" className="mt-7 w-full" onClick={handleGoogle}>
              Continue with Google
            </Button>
            <div className="my-5 flex items-center gap-3 text-xs text-portfolio-mist">
              <span className="h-px flex-1 bg-border" />
              or use email
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="auth-email">Email</Label>
                <Input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="auth-password">Password</Label>
                <Input id="auth-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2" />
              </div>
            </div>
            {authMessage ? <p className="mt-4 text-sm text-primary">{authMessage}</p> : null}
            <Button variant="portfolio" className="mt-5 w-full" onClick={handleEmailAuth}>
              {isSignup ? "Create owner account" : "Sign in"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setAuthMessage("");
              }}
              className="mt-4 w-full text-sm text-portfolio-mist hover:text-foreground"
            >
              {isSignup ? "Already have an account? Sign in" : "First time? Create an owner account"}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 sm:p-7">
              <div className="grid gap-6 sm:grid-cols-2">
                <EditField id="name" label="Name" value={draft.name} onChange={(value) => update("name", value)} />
                <EditField id="role" label="Professional title" value={draft.role} onChange={(value) => update("role", value)} />
                <EditField id="location" label="Location" value={draft.location} onChange={(value) => update("location", value)} />
                <EditField id="status" label="Current affiliation" value={draft.status} onChange={(value) => update("status", value)} />
                <EditField id="email" label="Email" value={draft.email} onChange={(value) => update("email", value)} />
                <EditField id="linkedin" label="LinkedIn URL" value={draft.linkedin} onChange={(value) => update("linkedin", value)} />
                <div className="sm:col-span-2">
                  <Label htmlFor="intro">Short introduction</Label>
                  <Textarea id="intro" rows={3} value={draft.intro} onChange={(event) => update("intro", event.target.value)} className="mt-2" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="bio">About</Label>
                  <Textarea id="bio" rows={5} value={draft.bio} onChange={(event) => update("bio", event.target.value)} className="mt-2" />
                </div>
              </div>

              <EditorSection
                title="Skill groups"
                onAdd={() => update("skillGroups", [...draft.skillGroups, { label: "New group", items: ["Skill"] }])}
              >
                {draft.skillGroups.map((group, index) => (
                  <div key={`${group.label}-${index}`} className="grid gap-3 border border-portfolio-line p-4 sm:grid-cols-2">
                    <EditField
                      id={`skill-label-${index}`}
                      label="Group"
                      value={group.label}
                      onChange={(value) => updateSkillGroup(draft, setDraft, index, { ...group, label: value })}
                    />
                    <EditField
                      id={`skill-items-${index}`}
                      label="Skills, separated by commas"
                      value={group.items.join(", ")}
                      onChange={(value) =>
                        updateSkillGroup(draft, setDraft, index, {
                          ...group,
                          items: value.split(",").map((item) => item.trim()).filter(Boolean),
                        })
                      }
                    />
                  </div>
                ))}
              </EditorSection>

              <EditorSection
                title="Experience"
                onAdd={() =>
                  update("experience", [
                    ...draft.experience,
                    { role: "New role", company: "Organisation", period: "Year", location: "", summary: "", duties: [] },
                  ])
                }
              >
                {draft.experience.map((item, index) => (
                  <div key={`${item.role}-${index}`} className="grid gap-3 border border-portfolio-line p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <EditField id={`role-${index}`} label="Role" value={item.role} onChange={(value) => updateExperience(draft, setDraft, index, "role", value)} />
                      <EditField id={`company-${index}`} label="Organisation" value={item.company} onChange={(value) => updateExperience(draft, setDraft, index, "company", value)} />
                      <EditField id={`period-${index}`} label="Period" value={item.period} onChange={(value) => updateExperience(draft, setDraft, index, "period", value)} />
                      <EditField id={`location-${index}`} label="Location" value={item.location} onChange={(value) => updateExperience(draft, setDraft, index, "location", value)} />
                    </div>
                    <EditField id={`summary-${index}`} label="Summary" value={item.summary} onChange={(value) => updateExperience(draft, setDraft, index, "summary", value)} />
                    <div>
                      <Label htmlFor={`duties-${index}`}>Duties, one per line</Label>
                      <Textarea
                        id={`duties-${index}`}
                        rows={4}
                        value={item.duties.join("\n")}
                        onChange={(event) => updateExperienceDuties(draft, setDraft, index, event.target.value.split("\n"))}
                        className="mt-2"
                      />
                    </div>
                  </div>
                ))}
              </EditorSection>

              <EditorSection
                title="Projects"
                onAdd={() =>
                  update("projects", [
                    ...draft.projects,
                    { title: "New project", category: "Category", description: "Describe this project.", image: "" },
                  ])
                }
              >
                {draft.projects.map((project, index) => (
                  <div key={`${project.title}-${index}`} className="grid gap-3 border border-portfolio-line p-4 sm:grid-cols-2">
                    <EditField id={`project-title-${index}`} label="Title" value={project.title} onChange={(value) => updateProject(draft, setDraft, index, "title", value)} />
                    <EditField id={`project-category-${index}`} label="Category" value={project.category} onChange={(value) => updateProject(draft, setDraft, index, "category", value)} />
                    <div className="sm:col-span-2">
                      <EditField id={`project-description-${index}`} label="Description" value={project.description} onChange={(value) => updateProject(draft, setDraft, index, "description", value)} />
                    </div>
                  </div>
                ))}
              </EditorSection>

              <EditorSection
                title="Education"
                onAdd={() =>
                  update("education", [
                    ...draft.education,
                    { qualification: "Qualification", institution: "Institution", period: "Year", detail: "Details." },
                  ])
                }
              >
                {draft.education.map((item, index) => (
                  <div key={`${item.qualification}-${index}`} className="grid gap-3 border border-portfolio-line p-4 sm:grid-cols-2">
                    <EditField id={`qualification-${index}`} label="Qualification" value={item.qualification} onChange={(value) => updateEducation(draft, setDraft, index, "qualification", value)} />
                    <EditField id={`institution-${index}`} label="Institution" value={item.institution} onChange={(value) => updateEducation(draft, setDraft, index, "institution", value)} />
                    <EditField id={`edu-period-${index}`} label="Period" value={item.period} onChange={(value) => updateEducation(draft, setDraft, index, "period", value)} />
                    <EditField id={`edu-detail-${index}`} label="Detail" value={item.detail} onChange={(value) => updateEducation(draft, setDraft, index, "detail", value)} />
                  </div>
                ))}
              </EditorSection>
            </div>
            <div className="flex items-center justify-between border-t border-portfolio-line px-5 py-4">
              <Button variant="ghost" onClick={() => void supabase.auth.signOut()}>
                <LogOut /> Sign out
              </Button>
              <div className="flex items-center gap-3">
                {notice ? (
                  <span className="flex items-center gap-1 text-sm text-primary">
                    {notice === "Saved" ? <Check className="size-4" /> : null}
                    {notice}
                  </span>
                ) : null}
                <Button variant="portfolio" onClick={() => void onSave()}>
                  <Save /> Save changes
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EditField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2" />
    </div>
  );
}

function EditorSection({ title, onAdd, children }: { title: string; onAdd: () => void; children: ReactNode }) {
  return (
    <section className="mt-9">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <Button variant="portfolioGlass" size="sm" onClick={onAdd}>
          <Plus /> Add
        </Button>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function updateProject(draft: Portfolio, setDraft: (value: Portfolio) => void, index: number, key: keyof Project, value: string) {
  const projects = draft.projects.map((project, itemIndex) => (itemIndex === index ? { ...project, [key]: value } : project));
  setDraft({ ...draft, projects });
}

function updateExperience(
  draft: Portfolio,
  setDraft: (value: Portfolio) => void,
  index: number,
  key: "role" | "company" | "period" | "location" | "summary",
  value: string,
) {
  const experience = draft.experience.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item));
  setDraft({ ...draft, experience });
}

function updateExperienceDuties(draft: Portfolio, setDraft: (value: Portfolio) => void, index: number, duties: string[]) {
  const experience = draft.experience.map((item, itemIndex) => (itemIndex === index ? { ...item, duties } : item));
  setDraft({ ...draft, experience });
}

function updateEducation(draft: Portfolio, setDraft: (value: Portfolio) => void, index: number, key: keyof Education, value: string) {
  const education = draft.education.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item));
  setDraft({ ...draft, education });
}

function updateSkillGroup(draft: Portfolio, setDraft: (value: Portfolio) => void, index: number, next: SkillGroup) {
  const skillGroups = draft.skillGroups.map((group, itemIndex) => (itemIndex === index ? next : group));
  setDraft({
    ...draft,
    skillGroups,
    skills: skillGroups.flatMap((group) => group.items),
  });
}
