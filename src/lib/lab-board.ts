import { format } from "date-fns";

export const LAB_BOARD_STORAGE_KEY = "cse-lab-board-v1";

export const LAB_KINDS = ["computer", "electronics", "networking", "general"] as const;
export type LabKind = (typeof LAB_KINDS)[number];

export const EQUIPMENT_CONDITIONS = ["working", "needs-repair", "out-of-service"] as const;
export type EquipmentCondition = (typeof EQUIPMENT_CONDITIONS)[number];

export const VISIT_PURPOSES = ["practical", "project", "study", "equipment", "other"] as const;
export type VisitPurpose = (typeof VISIT_PURPOSES)[number];

export type Equipment = {
  id: string;
  name: string;
  quantity: number;
  condition: EquipmentCondition;
  notes: string;
};

export type SoftwareItem = {
  id: string;
  name: string;
  version: string;
  installedOn: string;
};

export type Role = "admin" | "assistant";

export type User = {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  role: Role;
  active: boolean;
  canOperateLabs: boolean;
};

export type NoteKind = "maintenance" | "missing" | "other";

export type MaintenanceNote = {
  id: string;
  labId: string;
  authorId: string;
  authorName: string;
  kind: NoteKind;
  message: string;
  createdAt: string;
  status: "open" | "resolved";
};

export type Lab = {
  id: string;
  name: string;
  code: string;
  location: string;
  kind: LabKind;
  capacity: number;
  description: string;
  isOpen: boolean;
  openedAt: string | null;
  openedBy: string | null;
  openedByUserId: string | null;
  openNote: string;
  equipment: Equipment[];
  software: SoftwareItem[];
};

export type AttendanceEntry = {
  id: string;
  labId: string;
  name: string;
  identifier: string;
  purpose: VisitPurpose;
  enteredAt: string;
  leftAt: string | null;
};

export type LabBoardState = {
  labs: Lab[];
  attendance: AttendanceEntry[];
  users: User[];
  notes: MaintenanceNote[];
};

export type UserDraft = {
  name: string;
  username: string;
  passwordHash: string;
  role: Role;
  canOperateLabs: boolean;
};

export type LabDraft = {
  name: string;
  code: string;
  location: string;
  kind: LabKind;
  capacity: number;
  description: string;
};

export type EquipmentDraft = {
  name: string;
  quantity: number;
  condition: EquipmentCondition;
  notes: string;
};

export type SoftwareDraft = {
  name: string;
  version: string;
  installedOn: string;
};

export type ActionResult = { ok: true; state: LabBoardState } | { ok: false; message: string };

export const KIND_LABELS: Record<LabKind, string> = {
  computer: "Computer lab",
  electronics: "Electronics lab",
  networking: "Networking lab",
  general: "General lab",
};

export const CONDITION_LABELS: Record<EquipmentCondition, string> = {
  working: "Working",
  "needs-repair": "Needs repair",
  "out-of-service": "Out of service",
};

export const PURPOSE_LABELS: Record<VisitPurpose, string> = {
  practical: "Practical session",
  project: "Project work",
  study: "Study",
  equipment: "Using equipment",
  other: "Other",
};

export const NOTE_LABELS: Record<NoteKind, string> = {
  maintenance: "Maintenance",
  missing: "Missing item",
  other: "Other",
};

export const NOTE_KINDS = ["maintenance", "missing", "other"] as const;

export function canOperate(user: User | null | undefined) {
  return Boolean(user && user.active && user.role === "assistant" && user.canOperateLabs);
}

export function isAdmin(user: User | null | undefined) {
  return Boolean(user && user.active && user.role === "admin");
}

function equipment(id: string, name: string, quantity: number, condition: EquipmentCondition, notes = ""): Equipment {
  return { id, name, quantity, condition, notes };
}

function software(id: string, name: string, version: string, installedOn: string): SoftwareItem {
  return { id, name, version, installedOn };
}

function lab(partial: Lab): Lab {
  return partial;
}

export function seedLabBoard(): LabBoardState {
  return {
    attendance: [],
    users: [],
    notes: [],
    labs: [
      lab({
        id: "cse-computer-a",
        name: "Computer Lab A",
        code: "CSE-A",
        location: "Engineering building · Computer lab A",
        kind: "computer",
        capacity: 30,
        description: "Desktop computers for programming, simulation, and practical sessions.",
        isOpen: false,
        openedAt: null,
        openedBy: null,
        openedByUserId: null,
        openNote: "",
        equipment: [
          equipment("cse-a-pc", "Desktop computers", 30, "working"),
          equipment("cse-a-projector", "Projector", 1, "working"),
          equipment("cse-a-printer", "Printer", 1, "working", "Shared printer at the front of the lab"),
        ],
        software: [
          software("cse-a-vs", "Visual Studio", "2022", "All computers"),
          software("cse-a-py", "Python", "3.12", "All computers"),
          software("cse-a-pt", "Cisco Packet Tracer", "8.2", "All computers"),
          software("cse-a-arduino", "Arduino IDE", "2.3", "All computers"),
          software("cse-a-multi", "Multisim", "14", "All computers"),
        ],
      }),
      lab({
        id: "cse-computer-b",
        name: "Computer Lab B",
        code: "CSE-B",
        location: "Engineering building · Computer lab B",
        kind: "computer",
        capacity: 24,
        description: "Second computer lab for software, analysis, and networking practicals.",
        isOpen: false,
        openedAt: null,
        openedBy: null,
        openedByUserId: null,
        openNote: "",
        equipment: [
          equipment("cse-b-pc", "Desktop computers", 24, "working"),
          equipment("cse-b-switch", "Network switches", 4, "working"),
          equipment("cse-b-projector", "Projector", 1, "working"),
        ],
        software: [
          software("cse-b-matlab", "MATLAB", "R2024a", "All computers"),
          software("cse-b-vscode", "Visual Studio Code", "1.93", "All computers"),
          software("cse-b-wireshark", "Wireshark", "4.4", "All computers"),
          software("cse-b-proteus", "Proteus", "8.16", "PCs 1–12"),
        ],
      }),
      lab({
        id: "cse-electronics",
        name: "Electronics Lab",
        code: "CSE-E",
        location: "Engineering building · Electronics lab",
        kind: "electronics",
        capacity: 20,
        description: "Benches for electronics practicals, measurement, and prototyping.",
        isOpen: false,
        openedAt: null,
        openedBy: null,
        openedByUserId: null,
        openNote: "",
        equipment: [
          equipment("cse-e-scope", "Oscilloscopes", 10, "working"),
          equipment("cse-e-dmm", "Digital multimeters", 20, "working"),
          equipment("cse-e-psu", "DC power supplies", 10, "working"),
          equipment("cse-e-fg", "Function generators", 8, "working"),
          equipment("cse-e-bread", "Breadboards", 30, "working"),
          equipment("cse-e-solder", "Soldering stations", 6, "needs-repair", "Two stations need new tips"),
        ],
        software: [software("cse-e-arduino", "Arduino IDE", "2.3", "Bench computers")],
      }),
      lab({
        id: "cse-networking",
        name: "Networking Lab",
        code: "CSE-N",
        location: "Engineering building · Networking lab",
        kind: "networking",
        capacity: 16,
        description: "Routers, switches, and computers for networking practicals.",
        isOpen: false,
        openedAt: null,
        openedBy: null,
        openedByUserId: null,
        openNote: "",
        equipment: [
          equipment("cse-n-router", "Cisco routers", 8, "working"),
          equipment("cse-n-switch", "Cisco switches", 8, "working"),
          equipment("cse-n-pc", "Desktop computers", 16, "working"),
          equipment("cse-n-cable", "Patch cable sets", 16, "working"),
        ],
        software: [
          software("cse-n-pt", "Cisco Packet Tracer", "8.2", "All computers"),
          software("cse-n-gns", "GNS3", "2.2", "All computers"),
        ],
      }),
    ],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isLabKind(value: unknown): value is LabKind {
  return typeof value === "string" && (LAB_KINDS as readonly string[]).includes(value);
}

function isCondition(value: unknown): value is EquipmentCondition {
  return typeof value === "string" && (EQUIPMENT_CONDITIONS as readonly string[]).includes(value);
}

function isPurpose(value: unknown): value is VisitPurpose {
  return typeof value === "string" && (VISIT_PURPOSES as readonly string[]).includes(value);
}

function asEquipment(value: unknown): Equipment | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.name !== "string") return null;
  if (!isCondition(value.condition) || typeof value.quantity !== "number") return null;
  return {
    id: value.id,
    name: value.name,
    quantity: value.quantity,
    condition: value.condition,
    notes: typeof value.notes === "string" ? value.notes : "",
  };
}

function asSoftware(value: unknown): SoftwareItem | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.name !== "string") return null;
  return {
    id: value.id,
    name: value.name,
    version: typeof value.version === "string" ? value.version : "",
    installedOn: typeof value.installedOn === "string" ? value.installedOn : "",
  };
}

function asLab(value: unknown): Lab | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.name !== "string") return null;
  if (!isLabKind(value.kind) || typeof value.capacity !== "number") return null;
  const equipmentList = Array.isArray(value.equipment) ? value.equipment.map(asEquipment).filter((item) => item !== null) : [];
  const softwareList = Array.isArray(value.software) ? value.software.map(asSoftware).filter((item) => item !== null) : [];
  return {
    id: value.id,
    name: value.name,
    code: typeof value.code === "string" ? value.code : "",
    location: typeof value.location === "string" ? value.location : "",
    kind: value.kind,
    capacity: value.capacity,
    description: typeof value.description === "string" ? value.description : "",
    isOpen: value.isOpen === true,
    openedAt: typeof value.openedAt === "string" ? value.openedAt : null,
    openedBy: typeof value.openedBy === "string" ? value.openedBy : null,
    openedByUserId: typeof value.openedByUserId === "string" ? value.openedByUserId : null,
    openNote: typeof value.openNote === "string" ? value.openNote : "",
    equipment: equipmentList,
    software: softwareList,
  };
}

function asAttendance(value: unknown): AttendanceEntry | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.labId !== "string") return null;
  if (typeof value.name !== "string" || typeof value.identifier !== "string" || typeof value.enteredAt !== "string") return null;
  if (!isPurpose(value.purpose)) return null;
  return {
    id: value.id,
    labId: value.labId,
    name: value.name,
    identifier: value.identifier,
    purpose: value.purpose,
    enteredAt: value.enteredAt,
    leftAt: typeof value.leftAt === "string" ? value.leftAt : null,
  };
}

function asUser(value: unknown): User | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.name !== "string") return null;
  if (typeof value.username !== "string" || typeof value.passwordHash !== "string") return null;
  if (value.role !== "admin" && value.role !== "assistant") return null;
  return {
    id: value.id,
    name: value.name,
    username: value.username,
    passwordHash: value.passwordHash,
    role: value.role,
    active: value.active !== false,
    canOperateLabs: value.canOperateLabs === true,
  };
}

function asNote(value: unknown): MaintenanceNote | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.labId !== "string") return null;
  if (typeof value.authorId !== "string" || typeof value.authorName !== "string" || typeof value.message !== "string") return null;
  if (value.kind !== "maintenance" && value.kind !== "missing" && value.kind !== "other") return null;
  if (typeof value.createdAt !== "string") return null;
  return {
    id: value.id,
    labId: value.labId,
    authorId: value.authorId,
    authorName: value.authorName,
    kind: value.kind,
    message: value.message,
    createdAt: value.createdAt,
    status: value.status === "resolved" ? "resolved" : "open",
  };
}

export function loadLabBoard(): LabBoardState {
  if (typeof window === "undefined") return seedLabBoard();
  try {
    const raw = window.localStorage.getItem(LAB_BOARD_STORAGE_KEY);
    if (!raw) return seedLabBoard();
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !Array.isArray(parsed.labs)) return seedLabBoard();
    const labs = parsed.labs.map(asLab).filter((item) => item !== null);
    if (labs.length === 0) return seedLabBoard();
    const attendance = Array.isArray(parsed.attendance)
      ? parsed.attendance.map(asAttendance).filter((item) => item !== null)
      : [];
    const users = Array.isArray(parsed.users) ? parsed.users.map(asUser).filter((item) => item !== null) : [];
    const notes = Array.isArray(parsed.notes) ? parsed.notes.map(asNote).filter((item) => item !== null) : [];
    return { labs, attendance, users, notes };
  } catch {
    return seedLabBoard();
  }
}

export function saveLabBoard(state: LabBoardState) {
  window.localStorage.setItem(LAB_BOARD_STORAGE_KEY, JSON.stringify(state));
}

export function peopleInside(attendance: AttendanceEntry[], labId: string) {
  return attendance.filter((entry) => entry.labId === labId && entry.leftAt === null);
}

export function sortedLabs(labs: Lab[]) {
  return [...labs].sort((a, b) => Number(b.isOpen) - Number(a.isOpen) || a.name.localeCompare(b.name));
}

export function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return format(date, "d MMM yyyy, HH:mm");
}

export function isSameLocalDay(iso: string, now = new Date()) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

function requireLab(state: LabBoardState, labId: string): Lab | { ok: false; message: string } {
  const found = state.labs.find((item) => item.id === labId);
  if (!found) return { ok: false, message: "That lab is not on the board." };
  return found;
}

function isFailure(value: Lab | { ok: false; message: string }): value is { ok: false; message: string } {
  return "ok" in value;
}

function clip(value: string, max: number) {
  return value.trim().slice(0, max);
}

function parseCapacity(value: number) {
  if (!Number.isInteger(value) || value < 1 || value > 500) return null;
  return value;
}

function parseQuantity(value: number) {
  if (!Number.isInteger(value) || value < 0 || value > 9999) return null;
  return value;
}

function replaceLab(state: LabBoardState, labId: string, next: Lab): LabBoardState {
  return { ...state, labs: state.labs.map((item) => (item.id === labId ? next : item)) };
}

export function openLab(state: LabBoardState, labId: string, actor: User, note: string): ActionResult {
  if (!canOperate(actor)) return { ok: false, message: "Only a lab assistant with rights can open a lab." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  if (lab.isOpen) return { ok: false, message: "This lab is already open." };
  return {
    ok: true,
    state: replaceLab(state, labId, {
      ...lab,
      isOpen: true,
      openedAt: new Date().toISOString(),
      openedBy: actor.name,
      openedByUserId: actor.id,
      openNote: clip(note, 400),
    }),
  };
}

export function takeOverLab(state: LabBoardState, labId: string, actor: User): ActionResult {
  if (!canOperate(actor)) return { ok: false, message: "Only a lab assistant with rights can take over a lab." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  if (!lab.isOpen) return { ok: false, message: "Open the lab before taking over duty." };
  if (lab.openedByUserId === actor.id) return { ok: false, message: "You are already on duty in this lab." };
  return {
    ok: true,
    state: replaceLab(state, labId, {
      ...lab,
      openedAt: new Date().toISOString(),
      openedBy: actor.name,
      openedByUserId: actor.id,
    }),
  };
}

export function updateOpenNote(state: LabBoardState, labId: string, actor: User, note: string): ActionResult {
  if (!canOperate(actor)) return { ok: false, message: "Only a lab assistant with rights can update the open note." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  if (!lab.isOpen) return { ok: false, message: "Open the lab before updating the note." };
  return {
    ok: true,
    state: replaceLab(state, labId, {
      ...lab,
      openNote: clip(note, 400),
    }),
  };
}

export function closeLab(state: LabBoardState, labId: string, actor: User): ActionResult {
  if (!canOperate(actor)) return { ok: false, message: "Only a lab assistant with rights can close a lab." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  if (!lab.isOpen) return { ok: false, message: "This lab is already closed." };
  const now = new Date().toISOString();
  return {
    ok: true,
    state: {
      ...state,
      labs: state.labs.map((item) =>
        item.id === labId
          ? { ...item, isOpen: false, openedAt: null, openedBy: null, openedByUserId: null, openNote: "" }
          : item,
      ),
      attendance: state.attendance.map((entry) =>
        entry.labId === labId && entry.leftAt === null ? { ...entry, leftAt: now } : entry,
      ),
    },
  };
}

export function signIn(
  state: LabBoardState,
  labId: string,
  actor: User,
  input: { name: string; identifier: string; purpose: VisitPurpose },
): ActionResult {
  if (!canOperate(actor)) return { ok: false, message: "Only a lab assistant with rights can mark the register." };
  const name = clip(input.name, 80);
  const identifier = clip(input.identifier, 40);
  if (!name) return { ok: false, message: "Enter the person's name." };
  if (!identifier) return { ok: false, message: "Enter a student or staff number." };
  if (!isPurpose(input.purpose)) return { ok: false, message: "Choose a reason for the visit." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  if (!lab.isOpen) return { ok: false, message: "Open the lab before people register to enter." };
  const inside = peopleInside(state.attendance, labId);
  if (inside.length >= lab.capacity) {
    return {
      ok: false,
      message: `This lab is full (${lab.capacity} people). Sign someone out before another person enters.`,
    };
  }
  const duplicate = inside.some((entry) => entry.identifier.toLowerCase() === identifier.toLowerCase());
  if (duplicate) {
    return { ok: false, message: "This number is already signed in. Sign them out before registering again." };
  }
  const entry: AttendanceEntry = {
    id: crypto.randomUUID(),
    labId,
    name,
    identifier,
    purpose: input.purpose,
    enteredAt: new Date().toISOString(),
    leftAt: null,
  };
  return { ok: true, state: { ...state, attendance: [entry, ...state.attendance] } };
}

export function signOut(state: LabBoardState, attendanceId: string, actor: User): ActionResult {
  if (!canOperate(actor)) return { ok: false, message: "Only a lab assistant with rights can update the register." };
  const entry = state.attendance.find((item) => item.id === attendanceId);
  if (!entry) return { ok: false, message: "That attendance entry was not found." };
  if (entry.leftAt) return { ok: false, message: "This person has already signed out." };
  const now = new Date().toISOString();
  return {
    ok: true,
    state: {
      ...state,
      attendance: state.attendance.map((item) => (item.id === attendanceId ? { ...item, leftAt: now } : item)),
    },
  };
}

export function addLab(state: LabBoardState, actor: User, draft: LabDraft): ActionResult {
  if (!isAdmin(actor)) return { ok: false, message: "Only an admin can add a lab." };
  const name = clip(draft.name, 80);
  if (!name) return { ok: false, message: "Enter a lab name." };
  if (!isLabKind(draft.kind)) return { ok: false, message: "Choose the kind of lab." };
  const capacity = parseCapacity(draft.capacity);
  if (capacity === null) return { ok: false, message: "Capacity must be a whole number from 1 to 500." };
  const next: Lab = {
    id: crypto.randomUUID(),
    name,
    code: clip(draft.code, 20),
    location: clip(draft.location, 120),
    kind: draft.kind,
    capacity,
    description: clip(draft.description, 280),
    isOpen: false,
    openedAt: null,
    openedBy: null,
    openedByUserId: null,
    openNote: "",
    equipment: [],
    software: [],
  };
  return { ok: true, state: { ...state, labs: [...state.labs, next] } };
}

export function updateLab(state: LabBoardState, labId: string, actor: User, draft: LabDraft): ActionResult {
  if (!isAdmin(actor)) return { ok: false, message: "Only an admin can edit lab details." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  const name = clip(draft.name, 80);
  if (!name) return { ok: false, message: "Enter a lab name." };
  if (!isLabKind(draft.kind)) return { ok: false, message: "Choose the kind of lab." };
  const capacity = parseCapacity(draft.capacity);
  if (capacity === null) return { ok: false, message: "Capacity must be a whole number from 1 to 500." };
  const inside = peopleInside(state.attendance, labId).length;
  if (capacity < inside) {
    return { ok: false, message: `Capacity must be at least ${inside}, the number of people inside now.` };
  }
  return {
    ok: true,
    state: replaceLab(state, labId, {
      ...lab,
      name,
      code: clip(draft.code, 20),
      location: clip(draft.location, 120),
      kind: draft.kind,
      capacity,
      description: clip(draft.description, 280),
    }),
  };
}

export function removeLab(state: LabBoardState, labId: string, actor: User): ActionResult {
  if (!isAdmin(actor)) return { ok: false, message: "Only an admin can remove a lab." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  return {
    ok: true,
    state: {
      ...state,
      labs: state.labs.filter((item) => item.id !== labId),
      attendance: state.attendance.filter((entry) => entry.labId !== labId),
      notes: state.notes.filter((note) => note.labId !== labId),
    },
  };
}

export function addEquipment(state: LabBoardState, labId: string, actor: User, draft: EquipmentDraft): ActionResult {
  if (!isAdmin(actor)) return { ok: false, message: "Only an admin can update equipment." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  const name = clip(draft.name, 80);
  if (!name) return { ok: false, message: "Enter the equipment name." };
  if (!isCondition(draft.condition)) return { ok: false, message: "Choose the condition." };
  const quantity = parseQuantity(draft.quantity);
  if (quantity === null) return { ok: false, message: "Quantity must be a whole number from 0 to 9999." };
  const item: Equipment = {
    id: crypto.randomUUID(),
    name,
    quantity,
    condition: draft.condition,
    notes: clip(draft.notes, 200),
  };
  return { ok: true, state: replaceLab(state, labId, { ...lab, equipment: [...lab.equipment, item] }) };
}

export function updateEquipment(state: LabBoardState, labId: string, equipmentId: string, actor: User, draft: EquipmentDraft): ActionResult {
  if (!isAdmin(actor)) return { ok: false, message: "Only an admin can update equipment." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  if (!lab.equipment.some((item) => item.id === equipmentId)) {
    return { ok: false, message: "That equipment item was not found." };
  }
  const name = clip(draft.name, 80);
  if (!name) return { ok: false, message: "Enter the equipment name." };
  if (!isCondition(draft.condition)) return { ok: false, message: "Choose the condition." };
  const quantity = parseQuantity(draft.quantity);
  if (quantity === null) return { ok: false, message: "Quantity must be a whole number from 0 to 9999." };
  return {
    ok: true,
    state: replaceLab(state, labId, {
      ...lab,
      equipment: lab.equipment.map((item) =>
        item.id === equipmentId
          ? { ...item, name, quantity, condition: draft.condition, notes: clip(draft.notes, 200) }
          : item,
      ),
    }),
  };
}

export function removeEquipment(state: LabBoardState, labId: string, equipmentId: string, actor: User): ActionResult {
  if (!isAdmin(actor)) return { ok: false, message: "Only an admin can update equipment." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  return {
    ok: true,
    state: replaceLab(state, labId, { ...lab, equipment: lab.equipment.filter((item) => item.id !== equipmentId) }),
  };
}

export function addSoftware(state: LabBoardState, labId: string, actor: User, draft: SoftwareDraft): ActionResult {
  if (!isAdmin(actor)) return { ok: false, message: "Only an admin can update software." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  const name = clip(draft.name, 80);
  if (!name) return { ok: false, message: "Enter the software name." };
  const item: SoftwareItem = {
    id: crypto.randomUUID(),
    name,
    version: clip(draft.version, 40),
    installedOn: clip(draft.installedOn, 80) || "All computers",
  };
  return { ok: true, state: replaceLab(state, labId, { ...lab, software: [...lab.software, item] }) };
}

export function updateSoftware(state: LabBoardState, labId: string, softwareId: string, actor: User, draft: SoftwareDraft): ActionResult {
  if (!isAdmin(actor)) return { ok: false, message: "Only an admin can update software." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  if (!lab.software.some((item) => item.id === softwareId)) {
    return { ok: false, message: "That software item was not found." };
  }
  const name = clip(draft.name, 80);
  if (!name) return { ok: false, message: "Enter the software name." };
  return {
    ok: true,
    state: replaceLab(state, labId, {
      ...lab,
      software: lab.software.map((item) =>
        item.id === softwareId
          ? {
              ...item,
              name,
              version: clip(draft.version, 40),
              installedOn: clip(draft.installedOn, 80) || "All computers",
            }
          : item,
      ),
    }),
  };
}

export function removeSoftware(state: LabBoardState, labId: string, softwareId: string, actor: User): ActionResult {
  if (!isAdmin(actor)) return { ok: false, message: "Only an admin can update software." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  return {
    ok: true,
    state: replaceLab(state, labId, { ...lab, software: lab.software.filter((item) => item.id !== softwareId) }),
  };
}

function usernameOk(value: string) {
  return /^[a-z0-9._-]{3,24}$/.test(value);
}

function activeAdmins(users: User[]) {
  return users.filter((user) => user.role === "admin" && user.active);
}

export function createUser(state: LabBoardState, actor: User | null, draft: UserDraft): ActionResult {
  const firstAccount = state.users.length === 0;
  if (!firstAccount && !isAdmin(actor)) return { ok: false, message: "Only an admin can add people." };
  if (firstAccount && draft.role !== "admin") return { ok: false, message: "The first account must be an admin." };
  const name = clip(draft.name, 80);
  const username = clip(draft.username, 24).toLowerCase();
  if (!name) return { ok: false, message: "Enter the person's name." };
  if (!usernameOk(username)) return { ok: false, message: "Username must be 3–24 letters, numbers, dots, or hyphens." };
  if (!draft.passwordHash) return { ok: false, message: "Enter a password." };
  if (state.users.some((user) => user.username === username)) {
    return { ok: false, message: "That username is already in use." };
  }
  const user: User = {
    id: crypto.randomUUID(),
    name,
    username,
    passwordHash: draft.passwordHash,
    role: firstAccount ? "admin" : draft.role,
    active: true,
    canOperateLabs: firstAccount ? false : draft.role === "assistant" && draft.canOperateLabs,
  };
  return { ok: true, state: { ...state, users: [...state.users, user] } };
}

export function updateUserAccess(
  state: LabBoardState,
  actor: User,
  userId: string,
  patch: { active?: boolean; canOperateLabs?: boolean; role?: Role },
): ActionResult {
  if (!isAdmin(actor)) return { ok: false, message: "Only an admin can change access." };
  const target = state.users.find((user) => user.id === userId);
  if (!target) return { ok: false, message: "That person was not found." };
  const nextActive = patch.active ?? target.active;
  const nextRole = patch.role ?? target.role;
  if (target.role === "admin" && target.active && (!nextActive || nextRole !== "admin") && activeAdmins(state.users).length <= 1) {
    return { ok: false, message: "Keep at least one active admin account." };
  }
  return {
    ok: true,
    state: {
      ...state,
      users: state.users.map((user) =>
        user.id === userId
          ? {
              ...user,
              active: nextActive,
              role: nextRole,
              canOperateLabs: nextRole === "assistant" ? (patch.canOperateLabs ?? user.canOperateLabs) : false,
            }
          : user,
      ),
    },
  };
}

export function resetPassword(state: LabBoardState, actor: User, userId: string, passwordHash: string): ActionResult {
  if (!isAdmin(actor)) return { ok: false, message: "Only an admin can reset a password." };
  if (!state.users.some((user) => user.id === userId)) return { ok: false, message: "That person was not found." };
  if (!passwordHash) return { ok: false, message: "Enter a new password." };
  return {
    ok: true,
    state: {
      ...state,
      users: state.users.map((user) => (user.id === userId ? { ...user, passwordHash } : user)),
    },
  };
}

export function findUser(state: LabBoardState, username: string, passwordHash: string) {
  const key = username.trim().toLowerCase();
  return state.users.find((user) => user.username === key && user.passwordHash === passwordHash && user.active) ?? null;
}

export function submitNote(state: LabBoardState, actor: User, labId: string, kind: NoteKind, message: string): ActionResult {
  if (!canOperate(actor)) return { ok: false, message: "Only a lab assistant with rights can send a note to the admin." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  const text = clip(message, 500);
  if (!text) return { ok: false, message: "Write what needs attention." };
  if (kind !== "maintenance" && kind !== "missing" && kind !== "other") {
    return { ok: false, message: "Choose what the note is about." };
  }
  const note: MaintenanceNote = {
    id: crypto.randomUUID(),
    labId,
    authorId: actor.id,
    authorName: actor.name,
    kind,
    message: text,
    createdAt: new Date().toISOString(),
    status: "open",
  };
  return { ok: true, state: { ...state, notes: [note, ...state.notes] } };
}

export function resolveNote(state: LabBoardState, actor: User, noteId: string): ActionResult {
  if (!isAdmin(actor)) return { ok: false, message: "Only an admin can mark a note as handled." };
  if (!state.notes.some((note) => note.id === noteId)) return { ok: false, message: "That note was not found." };
  return {
    ok: true,
    state: {
      ...state,
      notes: state.notes.map((note) => (note.id === noteId ? { ...note, status: "resolved" } : note)),
    },
  };
}
