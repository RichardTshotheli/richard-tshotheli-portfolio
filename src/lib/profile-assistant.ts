export type AssistantProfile = {
  name: string;
  role: string;
  intro: string;
  bio: string;
  location: string;
  status: string;
  email: string;
  linkedin: string;
  skillGroups: { label: string; items: string[] }[];
  experience: {
    role: string;
    company: string;
    period: string;
    location: string;
    summary: string;
    duties: string[];
  }[];
  education: { qualification: string; institution: string; period: string; detail: string }[];
  projects?: { title: string; category: string; description: string }[];
};

export type ChatTurn = { role: "user" | "assistant"; text: string };

type Memory = {
  discussedAbout: boolean;
  discussedExperience: boolean;
  discussedSkills: boolean;
  discussedEducation: boolean;
  discussedContact: boolean;
  discussedFocus: boolean;
  lastCompany: string;
};

const roleGuides: { test: RegExp; title: string; skills: string[]; note: string; strength: "aligned" | "partial" }[] = [
  {
    test: /software|programmer|full[- ]?stack|web develop|application develop/,
    title: "software development",
    skills: ["C#", "C++", "JavaScript", "Python", "HTML", "Software development", "SDLC", "Software system analysis", "Embarcadero", "PIC programming"],
    note: "Those skills are published. His job titles are laboratory supervision and system monitoring, not a dedicated software developer post.",
    strength: "partial",
  },
  {
    test: /cyber|information security|infosec/,
    title: "cybersecurity",
    skills: ["Cisco networking", "Linux", "Ubuntu", "System monitoring", "Network monitoring tools"],
    note: "Cybersecurity is on his public headline. The portfolio does not list a cybersecurity job, certification, or security project.",
    strength: "partial",
  },
  {
    test: /cloud|azure|saas/,
    title: "cloud support",
    skills: ["Microsoft Azure", "SaaS", "Microsoft Endpoint Configuration Manager", "Linux"],
    note: "Cloud support is on his headline, with Azure and related skills listed. There is no cloud-engineer job title.",
    strength: "partial",
  },
  {
    test: /database|dba|mysql|oracle|sql/,
    title: "database work",
    skills: ["MySQL", "Oracle Database", "Data analysis", "Data processing"],
    note: "Database administrator is part of his headline, backed by MySQL and Oracle. No database-administrator job title is listed.",
    strength: "partial",
  },
  {
    test: /network|cisco|packet tracer|scada/,
    title: "networks and monitoring",
    skills: ["Cisco networking", "Packet Tracer", "SCADA", "Linux", "Ubuntu", "Network monitoring tools", "System monitoring", "Real-time monitoring", "Remote monitoring"],
    note: "This lines up with his system monitoring work at Kapsch TrafficCom.",
    strength: "aligned",
  },
  {
    test: /desktop support|service desk|help desk|end user|it support/,
    title: "desktop and service desk support",
    skills: ["Desktop computers", "Remote desktop", "Service desk", "Service delivery", "Application support", "Microsoft Office", "Microsoft Endpoint Configuration Manager"],
    note: "Desktop support and service desk skills are listed. His recorded roles are monitoring and laboratory supervision.",
    strength: "partial",
  },
  {
    test: /electronic|electrical|robot|embedded|pic\b/,
    title: "electronics",
    skills: ["Digital electronics", "Electrical engineering", "Electronics", "Logic design", "Robotics", "PIC programming"],
    note: "Electronics is a headline discipline and a skill group, alongside his computer systems qualification.",
    strength: "partial",
  },
  {
    test: /machine learning|\bai\b|artificial intelligence|data scien/,
    title: "AI and machine learning",
    skills: ["Artificial intelligence", "Machine learning", "Data analysis", "Statistics", "Python"],
    note: "AI and machine learning are listed skills. The profile does not describe a machine-learning job or project.",
    strength: "partial",
  },
  {
    test: /laborator|lectur|teaching|supervisor|components manager/,
    title: "laboratory supervision",
    skills: ["Laboratory skills", "Laboratory safety", "Supervision", "Teaching", "University lecturing", "Team leadership", "Management"],
    note: "This matches his current role at Tshwane University of Technology.",
    strength: "aligned",
  },
  {
    test: /monitor|traffic|mobility/,
    title: "system monitoring",
    skills: ["System monitoring", "Real-time monitoring", "Remote monitoring", "Network monitoring tools", "Linux", "SCADA"],
    note: "This matches his system monitoring engineer role at Kapsch TrafficCom from July 2023 to July 2024.",
    strength: "aligned",
  },
];

const absentTools = [
  "React", "Angular", "Vue", "Node.js", "Java", "PHP", "Ruby", "Golang", "Rust", "Swift", "Kotlin",
  "AWS", "Google Cloud", "Kubernetes", "Docker", "Terraform", "CCNA", "CCNP", "Security+", "CISSP",
  "CEH", "Django", "Spring", ".NET", "ASP.NET", "Power BI", "Tableau", "SAP", "Salesforce",
];

const stopWords = new Set(["the", "and", "his", "her", "him", "you", "your", "about", "what", "tell", "does", "did", "can", "how", "for", "with", "from", "that", "this", "have", "has", "was", "were", "are", "who", "where", "when", "why", "richard", "tshotheli"]);

export function openProfileAssistant() {
  window.dispatchEvent(new Event("open-profile-assistant"));
}

export function conversationPrompts(profile: AssistantProfile, history: ChatTurn[]) {
  const memory = readMemory(profile, history);
  const prompts = [];
  if (!memory.discussedAbout) prompts.push(`Who is ${firstName(profile)}?`);
  else if (!memory.discussedExperience) prompts.push("Tell me about his work");
  else prompts.push("What did he do in that role?");
  if (!memory.discussedSkills) prompts.push("What is he good at?");
  else prompts.push("Tell me about his software skills");
  if (!memory.discussedEducation) prompts.push("Where did he study?");
  else if (!memory.discussedContact) prompts.push("How can I reach him?");
  else if (!memory.discussedFocus) prompts.push("What projects has he built?");
  else prompts.push("What else should I know?");
  return prompts.slice(0, 3);
}

export function answerQuestion(profile: AssistantProfile, raw: string, history: ChatTurn[] = []) {
  const question = raw.trim();
  const first = firstName(profile);
  if (!question) return `Ask me anything published about ${first}. I keep this conversation, so you can follow up.`;

  const q = question.toLowerCase();
  const memory = readMemory(profile, history);

  if (isAssistantIdentity(q)) {
    return `I'm the assistant on ${first}'s portfolio. I can talk through his work, studies, skills, focus, and how to reach him. I stay with the published profile, and I remember this chat so the next question can build on the last one.`;
  }
  if (isGreeting(q)) return `Hello. I can chat about ${first}: who he is, where he has worked, what he studied, and the skills on his profile. Where should we start?`;
  if (isThanks(q)) return `Glad that helped. We can keep going — another role, a skill, his studies, or how to contact him.`;
  if (isBye(q)) return `Goodbye. If you want the original profile later, his LinkedIn is ${profile.linkedin}.`;
  if (isPrivate(q)) return `${first}'s age, salary, phone number, home address, and personal life are not on this portfolio. I can keep talking about his professional background.`;
  if (isFollowUp(q)) return continueThread(profile, q, memory);
  if (isFitQuestion(q) || looksLikeJobPost(question)) return `${fitAnswer(profile, question)} If you'd rather talk through the work itself, just say which role.`;
  if (isContact(q)) return contactAnswer(profile);
  if (isEducation(q)) return `${educationAnswer(profile)} I can connect that to his current work if you want.`;
  if (isSkillsOverview(profile, q)) return skillsOverview(profile);
  if (isExperienceOverview(q)) return experienceOverview(profile);
  if (isAbout(q)) return `${aboutAnswer(profile)} I can go into his jobs, skills, or studies next.`;
  if (isFocus(q)) return focusAnswer(profile);

  const hits = rankChunks(profile, q).filter((hit) => hit.score > 0);
  if (hits.length) return narrate(profile, hits, memory);

  const named = skillsInText(profile, question);
  if (named.length) return skillDetail(profile, named);

  return `I don't have that on ${first}'s portfolio or public professional profile, so I won't guess. We've been talking from the published record: work, skills, studies, focus, and contact. Ask about one of those, or name a tool or employer.`;
}

function continueThread(profile: AssistantProfile, q: string, memory: Memory) {
  const first = firstName(profile);
  if (/\b(duties|responsibilities|day to day|what did he do|there|that role|that job|more about (it|that|him there))\b/.test(q)) {
    const item = experienceByCompany(profile, memory.lastCompany) ?? profile.experience[0];
    return item ? roleDetail(item) : `Tell me which role you mean and I'll open it up.`;
  }
  if (/\b(other|before that|previous|earlier|the first|the second|next one)\b/.test(q)) {
    const other = profile.experience.find((item) => !memory.lastCompany || !item.company.toLowerCase().includes(memory.lastCompany.toLowerCase().split(" ")[0] ?? ""));
    return other ? roleDetail(other) : experienceOverview(profile);
  }
  if (!memory.discussedExperience) return experienceOverview(profile);
  if (/\b(skill|good at|tools)\b/.test(q) || !memory.discussedSkills) return skillsOverview(profile);
  if (!memory.discussedEducation) return `${educationAnswer(profile)} Want me to tie that back to the jobs?`;
  if (!memory.discussedFocus) return focusAnswer(profile);
  if (!memory.discussedContact) return contactAnswer(profile);
  return `That's the published story I have on ${first}. Ask about a specific employer, skill, or kind of work and I'll stay on that.`;
}

function narrate(profile: AssistantProfile, hits: { id: string; score: number }[], memory: Memory) {
  const top = hits[0];
  if (!top) return experienceOverview(profile);
  if (top.id.startsWith("exp-")) {
    const item = profile.experience[Number(top.id.slice(4))];
    return item ? roleDetail(item) : experienceOverview(profile);
  }
  if (top.id.startsWith("group-")) {
    const group = profile.skillGroups[Number(top.id.slice(6))];
    if (!group) return skillsOverview(profile);
    return `${group.label} on the profile: ${joinList(group.items)}. ${memory.discussedExperience ? "I can link any of those to a role." : "I can also walk through where he has used this kind of work."}`;
  }
  if (top.id.startsWith("skill-")) {
    const skill = allSkills(profile)[Number(top.id.slice(6))];
    return skill ? skillDetail(profile, [skill]) : skillsOverview(profile);
  }
  if (top.id.startsWith("edu-")) return educationAnswer(profile);
  if (top.id.startsWith("focus-")) {
    const item = profile.projects?.[Number(top.id.slice(6))];
    return item ? `${item.title} is one of the projects on his portfolio (${item.category}). ${item.description}` : focusAnswer(profile);
  }
  if (top.id === "contact") return contactAnswer(profile);
  if (top.id === "place") return `${firstName(profile)} is listed in ${profile.location}. His current role is in Soshanguve, Gauteng, and his qualification was completed in Pretoria.`;
  return aboutAnswer(profile);
}

function roleDetail(item: AssistantProfile["experience"][number]) {
  const duties = item.duties?.filter(Boolean) ?? [];
  const place = [item.company, item.location].filter(Boolean).join(", ");
  const dutyText = duties.length ? ` The published duties are: ${duties.join("; ")}.` : "";
  return `${item.role} at ${place}${item.period ? `, ${item.period}` : ""}. ${item.summary}${dutyText} Ask if you want the other role, or the skills that sit beside this work.`;
}

function experienceOverview(profile: AssistantProfile) {
  if (!profile.experience.length) return "No work history is listed on the portfolio yet.";
  const lines = profile.experience.map((item) => `${item.role} at ${item.company}${item.period ? ` (${item.period})` : ""}`);
  return `${firstName(profile)} has ${profile.experience.length === 1 ? "one published role" : `${profile.experience.length} published roles`}: ${joinList(lines)}. Say which one you want and I'll go through the duties.`;
}

function skillsOverview(profile: AssistantProfile) {
  const groups = profile.skillGroups.filter((group) => group.items.length);
  if (!groups.length) return "No skills are listed on the portfolio yet.";
  return `${firstName(profile)}'s skills are grouped as ${joinList(groups.map((group) => group.label.toLowerCase()))}. Name a group, or a tool such as Python, Azure, or Cisco, and I'll talk about that one.`;
}

function skillDetail(profile: AssistantProfile, skills: string[]) {
  const first = firstName(profile);
  const lines = skills.slice(0, 4).map((skill) => {
    const group = profile.skillGroups.find((item) => item.items.some((entry) => entry.toLowerCase() === skill.toLowerCase()));
    return `${skill}${group ? ` (${group.label})` : ""}`;
  });
  return `Yes. ${first}'s profile lists ${joinList(lines)}. I only count it when it is published, so if a tool is missing I will say so. Want the rest of that group?`;
}

function educationAnswer(profile: AssistantProfile) {
  if (!profile.education.length) return "No education record is listed on the portfolio.";
  return profile.education
    .map((item) => `${item.qualification} at ${item.institution}, ${item.period}. ${item.detail}`)
    .join(" ");
}

function focusAnswer(profile: AssistantProfile) {
  const items = profile.projects ?? [];
  if (!items.length) return "No projects are listed on the portfolio yet.";
  return `${firstName(profile)}'s published projects are ${joinList(items.map((item) => item.title))}. Ask about one and I'll use the description on the portfolio.`;
}

function aboutAnswer(profile: AssistantProfile) {
  return `${profile.name} is a ${profile.role.toLowerCase()} in ${profile.location}. ${profile.intro} ${profile.bio}`;
}

function contactAnswer(profile: AssistantProfile) {
  const email = profile.email.includes("@") ? ` Email on the portfolio: ${profile.email}.` : " No public email is listed.";
  return `You can reach ${profile.name} on LinkedIn: ${profile.linkedin}.${email} He is currently with ${profile.status}.`;
}

function fitAnswer(profile: AssistantProfile, question: string) {
  const first = firstName(profile);
  const guide = roleGuides.find((item) => item.test.test(question.toLowerCase()));
  const named = skillsInText(profile, question);
  const supporting = guide ? guide.skills.filter((skill) => hasSkill(profile, skill)) : [];
  const overlap = unique([...named, ...supporting]).slice(0, 8);
  const missing = absentTools.filter((tool) => mentioned(question, tool) && !hasSkill(profile, tool));
  const aligned = guide?.strength === "aligned" && supporting.length >= 3;
  const verdict = aligned || (named.length >= 4 && missing.length === 0) ? "a reasonable fit on the published profile" : named.length + supporting.length >= 2 ? "a partial fit" : "a limited fit";
  const parts = [`On the published profile, ${first} looks like ${verdict}${guide ? ` for ${guide.title}` : ""}.`];
  if (overlap.length) parts.push(`What supports that: ${joinList(overlap)}.`);
  else parts.push("I can't see an overlap with the skills or roles on the portfolio.");
  if (guide) parts.push(guide.note);
  if (missing.length) parts.push(`Not listed: ${joinList(missing)}.`);
  if (/\b\d+\+?\s+years\b/i.test(question)) parts.push("The dated roles are one year at Kapsch TrafficCom, July 2023 to July 2024, and the TUT role from March 2025.");
  parts.push("That is a reading of the public profile, not an employer's decision.");
  return parts.join(" ");
}

function rankChunks(profile: AssistantProfile, q: string) {
  const words = q.toLowerCase().split(/[^a-z0-9#+]+/).filter((word) => word.length > 2 && !stopWords.has(word));
  const chunks: { id: string; text: string }[] = [
    { id: "about", text: `${profile.name} ${profile.role} ${profile.intro} ${profile.bio} ${profile.status}` },
    { id: "place", text: `${profile.location} Pretoria Soshanguve Gauteng based lives` },
    { id: "contact", text: `${profile.linkedin} ${profile.email} contact reach` },
  ];
  profile.experience.forEach((item, index) => {
    chunks.push({ id: `exp-${index}`, text: `${item.role} ${item.company} ${item.period} ${item.location} ${item.summary} ${(item.duties ?? []).join(" ")}` });
  });
  profile.skillGroups.forEach((group, index) => {
    chunks.push({ id: `group-${index}`, text: `${group.label} ${group.items.join(" ")}` });
  });
  allSkills(profile).forEach((skill, index) => chunks.push({ id: `skill-${index}`, text: skill }));
  profile.education.forEach((item, index) => {
    chunks.push({ id: `edu-${index}`, text: `${item.qualification} ${item.institution} ${item.period} ${item.detail}` });
  });
  (profile.projects ?? []).forEach((item, index) => {
    chunks.push({ id: `focus-${index}`, text: `${item.title} ${item.category} ${item.description}` });
  });
  return chunks
    .map((chunk) => ({ id: chunk.id, score: words.reduce((total, word) => total + (hasWord(chunk.text, word) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score || specificity(b.id) - specificity(a.id));
}

function readMemory(profile: AssistantProfile, history: ChatTurn[]): Memory {
  const blob = history.map((turn) => turn.text).join("\n").toLowerCase();
  const recent = history.slice(-4).map((turn) => turn.text).join("\n").toLowerCase();
  let lastCompany = "";
  let lastAt = -1;
  for (const item of profile.experience) {
    const key = item.company.toLowerCase().split(" ")[0] ?? "";
    const at = recent.lastIndexOf(key);
    if (key && at >= lastAt) {
      lastAt = at;
      lastCompany = item.company;
    }
  }
  return {
    discussedAbout: /is a computer systems engineer/.test(blob),
    discussedExperience: /Say which one you want|The published duties are|Ask if you want the other role/.test(blob),
    discussedSkills: /skills are grouped|Want the rest of that group/.test(blob),
    discussedEducation: /Advanced Diploma|No education record/.test(blob),
    discussedContact: /You can reach/.test(blob),
    discussedFocus: /published projects|No projects are listed/.test(blob),
    lastCompany,
  };
}

function specificity(id: string) {
  if (id.startsWith("skill-")) return 5;
  if (id.startsWith("exp-") || id.startsWith("group-")) return 4;
  if (id.startsWith("edu-") || id.startsWith("focus-")) return 3;
  return 1;
}

function experienceByCompany(profile: AssistantProfile, company: string) {
  if (!company) return undefined;
  const key = company.toLowerCase().split(" ")[0] ?? "";
  return profile.experience.find((item) => item.company.toLowerCase().includes(key));
}

function isFollowUp(q: string) {
  return /^(yes|yeah|yep|ok|okay|sure|please|more|go on|continue|and|also)\b/.test(q) || /\b(tell me more|what else|anything else|go deeper|the other one|before that|that role|that job|his duties|what did he do|there)\b/.test(q);
}

function isFitQuestion(q: string) {
  if (/\b(current|previous)\s+(job|role|position)\b/.test(q)) return false;
  return /\b(qualify|qualified for|fit for|good fit|suitab|candidate|hiring for|job description|right for|eligible)\b/.test(q);
}

function looksLikeJobPost(text: string) {
  return text.length > 280 || (text.length > 80 && /\b(requirements|we are looking|must have|minimum of)\b/i.test(text));
}

function isExperienceOverview(q: string) {
  return /\b(experience|his work|work history|career|jobs|employment|roles)\b/.test(q) && !/\b(kapsch|tshwane|tut|python|java|azure)\b/.test(q);
}

function isSkillsOverview(profile: AssistantProfile, q: string) {
  const namesAGroup = profile.skillGroups.some((group) => q.includes(group.label.toLowerCase()));
  if (namesAGroup || skillsInText(profile, q).length) return false;
  return /\b(skills|skill set|good at|technologies|tech stack|what can he do)\b/.test(q);
}

function isEducation(q: string) {
  return /\b(education|degree|diploma|studied|study|university|graduate|qualification)\b/.test(q);
}

function isContact(q: string) {
  return /\b(contact|email|e-mail|linkedin|reach him|get in touch|phone)\b/.test(q);
}

function isAbout(q: string) {
  return /\b(who is|about him|about richard|tell me about him|what does he do|introduce)\b/.test(q);
}

function isFocus(q: string) {
  return /\b(focus|projects?|what has he built|what did he build|built)\b/.test(q);
}

function isGreeting(q: string) {
  return /^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(q);
}

function isThanks(q: string) {
  return /\b(thank|thanks|cheers)\b/.test(q);
}

function isBye(q: string) {
  return /^(bye|goodbye|see you|that's all|that is all)\b/.test(q);
}

function isAssistantIdentity(q: string) {
  return /\b(who are you|what are you|are you (an )?ai|are you a bot|what can you do)\b/.test(q);
}

function isPrivate(q: string) {
  return /\b(age|how old|salary|pay|package|phone number|home address|id number|married|girlfriend|boyfriend|religion|politic)\b/.test(q);
}

function skillsInText(profile: AssistantProfile, text: string) {
  return allSkills(profile).filter((skill) => mentioned(text, skill));
}

function hasSkill(profile: AssistantProfile, skill: string) {
  return allSkills(profile).some((item) => item.toLowerCase() === skill.toLowerCase());
}

function allSkills(profile: AssistantProfile) {
  return profile.skillGroups.flatMap((group) => group.items);
}

function hasWord(text: string, word: string) {
  return mentioned(text, word);
}

function mentioned(text: string, phrase: string) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9#+])${escaped}([^a-z0-9#+]|$)`, "i").test(text);
}

function unique(items: string[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function joinList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function firstName(profile: AssistantProfile) {
  return profile.name.split(" ")[0] || profile.name;
}
