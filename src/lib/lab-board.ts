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
    return { labs, attendance };
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

export function openLab(state: LabBoardState, labId: string, openedBy: string, note: string): ActionResult {
  const name = clip(openedBy, 80);
  if (!name) return { ok: false, message: "Enter the name of the person opening the lab." };
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  if (lab.isOpen) return { ok: false, message: "This lab is already open. Update the note, or close it first." };
  return {
    ok: true,
    state: replaceLab(state, labId, {
      ...lab,
      isOpen: true,
      openedAt: new Date().toISOString(),
      openedBy: name,
      openNote: clip(note, 400),
    }),
  };
}

export function updateOpenNote(state: LabBoardState, labId: string, openedBy: string, note: string): ActionResult {
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  if (!lab.isOpen) return { ok: false, message: "Open the lab before updating the note." };
  const name = clip(openedBy, 80);
  return {
    ok: true,
    state: replaceLab(state, labId, {
      ...lab,
      openedBy: name || lab.openedBy,
      openNote: clip(note, 400),
    }),
  };
}

export function closeLab(state: LabBoardState, labId: string): ActionResult {
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  if (!lab.isOpen) return { ok: false, message: "This lab is already closed." };
  const now = new Date().toISOString();
  return {
    ok: true,
    state: {
      labs: state.labs.map((item) =>
        item.id === labId
          ? { ...item, isOpen: false, openedAt: null, openedBy: null, openNote: "" }
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
  input: { name: string; identifier: string; purpose: VisitPurpose },
): ActionResult {
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

export function signOut(state: LabBoardState, attendanceId: string): ActionResult {
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

export function addLab(state: LabBoardState, draft: LabDraft): ActionResult {
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
    openNote: "",
    equipment: [],
    software: [],
  };
  return { ok: true, state: { ...state, labs: [...state.labs, next] } };
}

export function updateLab(state: LabBoardState, labId: string, draft: LabDraft): ActionResult {
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

export function removeLab(state: LabBoardState, labId: string): ActionResult {
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  return {
    ok: true,
    state: {
      labs: state.labs.filter((item) => item.id !== labId),
      attendance: state.attendance.filter((entry) => entry.labId !== labId),
    },
  };
}

export function addEquipment(state: LabBoardState, labId: string, draft: EquipmentDraft): ActionResult {
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

export function updateEquipment(state: LabBoardState, labId: string, equipmentId: string, draft: EquipmentDraft): ActionResult {
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

export function removeEquipment(state: LabBoardState, labId: string, equipmentId: string): ActionResult {
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  return {
    ok: true,
    state: replaceLab(state, labId, { ...lab, equipment: lab.equipment.filter((item) => item.id !== equipmentId) }),
  };
}

export function addSoftware(state: LabBoardState, labId: string, draft: SoftwareDraft): ActionResult {
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

export function updateSoftware(state: LabBoardState, labId: string, softwareId: string, draft: SoftwareDraft): ActionResult {
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

export function removeSoftware(state: LabBoardState, labId: string, softwareId: string): ActionResult {
  const lab = requireLab(state, labId);
  if (isFailure(lab)) return lab;
  return {
    ok: true,
    state: replaceLab(state, labId, { ...lab, software: lab.software.filter((item) => item.id !== softwareId) }),
  };
}
