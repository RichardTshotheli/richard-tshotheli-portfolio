import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";

import portraitImage from "@/assets/richard-portrait.jpg";
import { ProfileAssistant } from "@/components/profile-assistant";
import { openProfileAssistant } from "@/lib/profile-assistant";
import { Button } from "@/components/ui/button";

type Project = { title: string; category: string; description: string; image: string; href?: "/labs" };
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
      title: "Laboratory Board",
      category: "Laboratory operations",
      description:
        "Open a lab when people need it, register attendance as they enter, and keep equipment and computer-lab software up to date.",
      image: "",
      href: "/labs",
    },
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
  const content = fallback;

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
            <Link to="/labs" className="transition-colors hover:text-white">
              Labs
            </Link>
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
          <Link to="/labs" className="shrink-0 hover:text-white">
            Labs
          </Link>
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
              <Link to="/labs">Laboratory board</Link>
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
                  {project.href === "/labs" ? (
                    <Link to="/labs" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                      Open the board <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  ) : null}
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
        <footer className="mx-auto max-w-6xl border-t border-white/10 px-5 py-6 text-sm text-white/70 sm:px-8">
          <span>© {new Date().getFullYear()} {content.name}</span>
        </footer>
      </section>

      <ProfileAssistant profile={content} />
    </main>
  );
}
