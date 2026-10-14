import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { useMemo } from "react";

import portraitImage from "@/assets/richard-portrait.jpg";
import { ProfileAssistant } from "@/components/profile-assistant";
import { openProfileAssistant } from "@/lib/profile-assistant";
import { Button } from "@/components/ui/button";

type Project = {
  title: string;
  category: string;
  summary: string;
  description: string;
  problem?: string;
  solution?: string;
  technologies: string[];
  features?: string[];
  role?: string;
  results?: string;
  architecture?: string[];
  featured?: boolean;
};
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
  headline: string;
  intro: string;
  about: string[];
  bio: string;
  location: string;
  status: string;
  email: string;
  linkedin: string;
  github: string;
  skills: string[];
  skillGroups: SkillGroup[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
};

const fallback: Portfolio = {
  name: "Richard Tshotheli",
  role: "Computer Systems Engineer",
  headline: "Computer Systems Engineering | Cloud & Infrastructure | Software Development | IoT & AI",
  intro:
    "Computer Systems Engineering professional with hands-on experience in software development, cloud technologies, IT infrastructure, networking, embedded systems, IoT and AI. I build practical systems that combine software, hardware and intelligent technologies to solve real-world problems.",
  about: [
    "I am a Computer Systems Engineering professional with a strong interest in cloud computing, IT infrastructure, software development, IoT and artificial intelligence. My experience combines system support, software development and hands-on engineering projects involving web applications, databases, embedded systems and machine learning.",
    "I enjoy designing complete solutions—from configuring infrastructure and databases to developing applications and integrating hardware. I am particularly interested in Cloud & Infrastructure, Systems Support, Software Engineering and intelligent systems, where I can continue developing practical solutions while expanding my engineering expertise.",
  ],
  bio: "",
  location: "Gauteng, South Africa",
  status: "Tshwane University of Technology",
  email: "",
  linkedin: "https://www.linkedin.com/in/richard-tshotheli-069450277",
  github: "https://github.com/RichardTshotheli",
  skills: [],
  skillGroups: [
    {
      label: "Cloud & Infrastructure",
      items: ["Microsoft Azure", "Windows Server", "PowerShell", "Virtual Machines", "Networking", "DNS", "DHCP", "TCP/IP", "Firewalls", "Cloud Support", "Linux", "Cisco networking"],
    },
    {
      label: "Software Development",
      items: ["Python", "C#", "Java", "Flask", "PHP", "HTML", "CSS", "JavaScript", "SQL", "REST APIs", "Git/GitHub"],
    },
    {
      label: "Databases",
      items: ["MySQL", "SQL", "Database Design", "CRUD", "Data Management"],
    },
    {
      label: "IoT & Embedded Systems",
      items: ["ESP32", "Arduino", "PlatformIO", "Sensors", "Microcontrollers", "Embedded C", "IoT Integration"],
    },
    {
      label: "AI & Data",
      items: ["TensorFlow/Keras", "CNNs", "Machine Learning", "Google Colab", "Jupyter", "MATLAB", "Data Analysis"],
    },
    {
      label: "Tools & Platforms",
      items: ["VS Code", "GitHub", "XAMPP", "Docker", "Virtual Machines", "Proteus"],
    },
  ],
  experience: [
    {
      role: "Laboratory Assistants Supervisor & CSE Components Manager",
      company: "Tshwane University of Technology",
      period: "Mar 2025 – Present",
      location: "Soshanguve, Gauteng",
      summary: "Technical and practical work in the Engineering and Technical department: software, laboratory support, and component inventory.",
      duties: [
        "Supervise laboratory assistants for Computer Systems Engineering",
        "Develop and support software used in the computer systems engineering environment",
        "Manage computer systems engineering components and laboratory inventory",
        "Support laboratory safety and day-to-day laboratory operations",
        "Coordinate practical laboratory work for the Engineering and Technical department",
      ],
    },
    {
      role: "System Monitoring Engineer",
      company: "Kapsch TrafficCom South Africa",
      period: "Jul 2023 – Jul 2024",
      location: "South Africa",
      summary: "Technical monitoring and support for tolling infrastructure, including E-TOLL operations.",
      duties: [
        "Monitored tolling infrastructure and system events",
        "Investigated incidents and supported operational reliability",
        "Verified camera image quality",
        "Monitored sensors and vehicle classification",
        "Supported transaction and data monitoring",
      ],
    },
    {
      role: "Software development",
      company: "Dynamics DNA",
      period: "",
      location: "",
      summary: "Software development on practical systems.",
      duties: [],
    },
    {
      role: "Cloud support training",
      company: "Netcampus",
      period: "",
      location: "",
      summary: "Cloud support training.",
      duties: [],
    },
  ],
  education: [
    {
      qualification: "Advanced Diploma, Computer Systems Engineering",
      institution: "Tshwane University of Technology",
      period: "2025 – Present",
      detail: "Pretoria. Advanced Diploma in computer systems engineering.",
    },
    {
      qualification: "National Diploma, Computer Systems Engineering",
      institution: "Tshwane University of Technology",
      period: "2018 – 2023",
      detail: "Pretoria. National Diploma in computer systems engineering and computer technology.",
    },
  ],
  projects: [
    {
      title: "Smart Inventory Management System",
      category: "Full-stack software",
      featured: true,
      summary: "A role-based inventory platform for component requests, approvals, documents and stock tracking.",
      description:
        "Smart Inventory Management System is a role-based platform for component requests, approvals, document management and inventory tracking.",
      problem: "Stock, component requests and approvals were hard to follow when the records were not in one system.",
      solution: "A role-based inventory platform that records stock, requests, approvals and related documents in one place.",
      technologies: ["HTML", "CSS", "JavaScript", "SQL", "REST APIs"],
      features: ["Role-based access", "Component requests", "Approvals", "Document management", "Inventory tracking"],
      role: "Designed and developed the system, including the request and approval flow and the inventory records.",
      results: "Developed a role-based inventory management platform supporting component requests, approvals, document management and inventory tracking.",
    },
    {
      title: "IoT Fire & Gas Monitoring System",
      category: "ESP32 / IoT",
      featured: true,
      summary: "Hardware and software for monitoring fire and gas conditions, with a web dashboard and alerts.",
      description:
        "IoT Fire and Gas Monitoring System connects sensors to an ESP32, then to a network, database and web dashboard for real-time monitoring and alerts.",
      problem: "Fire and gas conditions need to be seen as they happen, not only checked on site.",
      solution: "Sensors report through an ESP32 to a network path that stores readings and shows them on a web dashboard, with alerts when conditions need attention.",
      technologies: ["ESP32", "Sensors", "IoT Integration", "Web dashboard"],
      features: ["Real-time monitoring", "Sensor readings", "Web dashboard", "Alerts"],
      role: "Built the monitoring path from the sensors and ESP32 through to the dashboard and alerts.",
      results: "A working hardware and software system for fire and gas monitoring, rather than a software-only demo.",
      architecture: ["Sensors", "ESP32", "Network / API", "Database", "Web dashboard", "Alerts"],
    },
    {
      title: "CNN Image Classification",
      category: "Machine learning",
      featured: true,
      summary: "A convolutional neural network for image classification, with a measured validation result.",
      description: "CNN image classification project. The published result is 93.85% validation accuracy.",
      problem: "Images needed to be classified by a model that could be measured against held-out validation data.",
      solution: "Trained a convolutional neural network for image classification and recorded how it performed on validation data.",
      technologies: ["Python", "TensorFlow/Keras", "CNNs", "Google Colab"],
      features: ["Convolutional neural network", "Training and validation", "Image classification"],
      role: "Prepared the model, trained it, and recorded the validation result.",
      results: "93.85% validation accuracy achieved on CNN image classification.",
    },
    {
      title: "NYC Taxi Trip Duration Prediction",
      category: "Data science",
      featured: true,
      summary: "A prediction project that estimates how long a New York taxi trip will take.",
      description: "NYC taxi trip duration prediction uses trip data to estimate how long a journey takes.",
      problem: "Trip duration is not obvious from pickup and drop-off alone, so it has to be predicted from the trip data.",
      solution: "A data science model that learns from New York taxi trips and estimates journey duration.",
      technologies: ["Python", "Data Analysis", "Jupyter"],
      features: ["Trip data", "Duration prediction", "Model evaluation"],
      role: "Explored the trip data and built the duration prediction.",
      results: "Uses trip data to estimate how long a New York taxi journey takes.",
    },
    {
      title: "Smart Car",
      category: "Embedded systems",
      summary: "A vehicle project that combines electronics and control for smarter car functions.",
      description: "Smart Car is a vehicle project that combines electronics and control for smarter car functions.",
      technologies: ["Embedded systems", "Electronics"],
    },
    {
      title: "Remote Room Temperature Controller",
      category: "Control systems",
      summary: "A controller for reading room temperature and adjusting it from a remote point.",
      description: "Remote Room Temperature Controller reads room temperature and adjusts it from a remote point.",
      technologies: ["Sensors", "Control systems"],
    },
    {
      title: "Smart Security System",
      category: "Security",
      summary: "A security system that brings sensing and control together to monitor a space.",
      description: "Smart Security System brings sensing and control together to monitor a space.",
      technologies: ["Sensors", "Embedded systems"],
    },
    {
      title: "Intercom System",
      category: "Communications",
      summary: "An intercom system for voice communication between points in a building or site.",
      description: "Intercom System provides voice communication between points in a building or site.",
      technologies: ["Electronics", "Communications"],
    },
    {
      title: "DC Power Supply",
      category: "Electronics",
      summary: "A built DC power supply that provides a controlled direct-current source.",
      description: "DC Power Supply is a built supply that provides a controlled direct-current source.",
      technologies: ["Electronics", "Power"],
    },
  ],
};

fallback.bio = fallback.about.join(" ");
fallback.skills = fallback.skillGroups.flatMap((group) => group.items);

const nav = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#cv", label: "CV" },
  { href: "#contact", label: "Contact" },
];

const cvHref = `${import.meta.env.BASE_URL}richard-tshotheli-cv.html`;

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
          "Computer Systems Engineering, cloud and infrastructure, software development, IoT and AI. Portfolio of Richard Tshotheli.",
      },
      { property: "og:title", content: "Richard Tshotheli — Computer Systems Engineer" },
      {
        property: "og:description",
        content: "Cloud and infrastructure, software, IoT and AI. Based in Gauteng, South Africa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const content = fallback;
  const featured = content.projects.filter((project) => project.featured);
  const otherProjects = content.projects.filter((project) => !project.featured);

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
          <nav className="hidden items-center gap-5 text-sm text-white/75 lg:flex" aria-label="Page">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={content.linkedin} aria-label="LinkedIn" className="grid size-9 place-items-center text-portfolio-gold hover:text-white">
              <Linkedin className="size-4" />
            </a>
            <a href={content.github} aria-label="GitHub" className="grid size-9 place-items-center text-portfolio-gold hover:text-white">
              <Github className="size-4" />
            </a>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-5 pb-3 text-sm text-white/75 lg:hidden" aria-label="Page">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="shrink-0 hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="top" className="mx-auto grid max-w-6xl items-end gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:pt-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-portfolio-gold">{content.headline}</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
            {content.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-portfolio-mist sm:text-xl">{content.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="portfolioLight" size="lg" asChild>
              <a href="#projects">View projects</a>
            </Button>
            <Button variant="portfolio" size="lg" asChild>
              <a href={cvHref}>Download CV</a>
            </Button>
            <Button variant="portfolioGlass" size="lg" asChild>
              <a href="#contact">
                Contact me <ArrowUpRight />
              </a>
            </Button>
            <Button variant="portfolioGlass" size="lg" type="button" onClick={() => openProfileAssistant()}>
              Ask AI
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
          <h2 className="font-display text-3xl font-semibold">About me</h2>
          <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-foreground/90">
            {content.about.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="border-t border-portfolio-line bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-24">
          <h2 className="font-display text-3xl font-semibold">Experience</h2>
          <ol className="space-y-5">
            {content.experience.map((item, index) => (
              <li key={`${item.company}-${index}`} className="border border-portfolio-line border-l-4 border-l-primary bg-portfolio-surface p-6 sm:p-8">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-display text-2xl font-semibold leading-snug">{item.role}</h3>
                  {item.period ? <p className="text-sm font-semibold text-portfolio-teal">{item.period}</p> : null}
                </div>
                <p className="mt-2 text-sm font-medium text-portfolio-mist">
                  {item.company}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                {item.summary ? <p className="mt-3 max-w-2xl leading-relaxed text-foreground/85">{item.summary}</p> : null}
                {item.duties.length ? (
                  <ul className="mt-5 space-y-2">
                    {item.duties.map((duty) => (
                      <li key={duty} className="flex gap-3 leading-relaxed">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{duty}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="projects" className="border-t border-portfolio-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-24">
          <h2 className="font-display text-3xl font-semibold">Projects</h2>
          <div className="space-y-6">
            <p className="max-w-2xl leading-relaxed text-portfolio-mist">
              Software, IoT, machine learning and electronics. The first four are the projects to read first.
            </p>
            {featured.map((project) => (
              <article key={project.title} className="border border-portfolio-line border-t-4 border-t-portfolio-teal bg-portfolio-surface p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-teal">{project.category}</p>
                <h3 className="mt-3 font-display text-3xl font-semibold">{project.title}</h3>
                <p className="mt-3 max-w-3xl text-lg leading-relaxed">{project.summary}</p>
                <dl className="mt-6 space-y-4">
                  <ProjectFact label="Problem" value={project.problem} />
                  <ProjectFact label="Solution" value={project.solution} />
                  <ProjectFact label="My role" value={project.role} />
                  <ProjectFact label="Results" value={project.results} />
                </dl>
                {project.features?.length ? (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-gold">Key features</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {project.features.map((feature) => (
                        <li key={feature} className="rounded-md border border-primary/15 bg-primary/10 px-2.5 py-1 text-sm">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <TechList items={project.technologies} />
                {project.architecture?.length ? (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-gold">Architecture</p>
                    <ol className="mt-3 flex flex-wrap items-center gap-2">
                      {project.architecture.map((step, index) => (
                        <li key={step} className="flex items-center gap-2">
                          <span className="rounded-md border border-portfolio-line bg-secondary px-2.5 py-1 text-sm">{step}</span>
                          {index < project.architecture!.length - 1 ? <span className="text-portfolio-teal">→</span> : null}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </article>
            ))}
            <div className="grid gap-5 md:grid-cols-2">
              {otherProjects.map((project) => (
                <article key={project.title} className="border border-portfolio-line bg-portfolio-surface p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-teal">{project.category}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold">{project.title}</h3>
                  <p className="mt-3 leading-relaxed text-portfolio-mist">{project.summary}</p>
                  <TechList items={project.technologies} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="border-t border-portfolio-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)]">
            <h2 className="font-display text-3xl font-semibold">Skills</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.skillGroups.map((group, index) => (
                <article key={group.label} className="border border-portfolio-line bg-portfolio-surface p-6 sm:p-7">
                  <h3 className={`text-xs font-semibold uppercase tracking-[0.14em] ${index % 3 === 1 ? "text-portfolio-teal" : index % 3 === 2 ? "text-portfolio-gold" : "text-primary"}`}>
                    {group.label}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item} className="rounded-md border border-primary/15 bg-primary/10 px-2.5 py-1 text-sm text-foreground">
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
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-24">
          <h2 className="font-display text-3xl font-semibold">Education</h2>
          <div className="space-y-10">
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

      <section id="cv" className="border-t border-portfolio-line">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 sm:px-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-24">
          <h2 className="font-display text-3xl font-semibold">CV</h2>
          <div>
            <p className="max-w-2xl text-lg leading-relaxed">
              The downloadable CV is the Cloud &amp; Infrastructure version. The rest of this page still shows the software, IoT and AI work.
            </p>
            <Button variant="portfolio" size="lg" className="mt-6" asChild>
              <a href={cvHref}>
                Download CV <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 bg-portfolio-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-24">
          <h2 className="font-display text-3xl font-semibold text-portfolio-gold">Contact</h2>
          <div>
            <p className="max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Open to Cloud &amp; Infrastructure, systems support, software and IoT roles.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="portfolio" size="lg" asChild>
                <a href={content.linkedin}>
                  <Linkedin /> LinkedIn
                </a>
              </Button>
              <Button variant="portfolioGlass" size="lg" asChild>
                <a href={content.github}>
                  <Github /> GitHub
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

function ProjectFact({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-portfolio-gold">{label}</dt>
      <dd className="mt-1 max-w-3xl leading-relaxed text-foreground/90">{value}</dd>
    </div>
  );
}

function TechList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-md bg-portfolio-navy px-2.5 py-1 text-xs font-medium text-white">
          {item}
        </li>
      ))}
    </ul>
  );
}
