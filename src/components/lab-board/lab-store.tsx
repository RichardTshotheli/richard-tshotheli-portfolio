import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { hashPassword } from "@/lib/passwords";
import {
  addEquipment,
  addLab,
  addSoftware,
  closeLab,
  createUser,
  findUser,
  LAB_BOARD_STORAGE_KEY,
  loadLabBoard,
  openLab,
  removeEquipment,
  removeLab,
  removeSoftware,
  resetPassword,
  resolveNote,
  saveLabBoard,
  signIn,
  signOut,
  submitNote,
  takeOverLab,
  updateEquipment,
  updateLab,
  updateOpenNote,
  updateSoftware,
  updateUserAccess,
  type ActionResult,
  type EquipmentDraft,
  type LabBoardState,
  type LabDraft,
  type NoteKind,
  type Role,
  type SoftwareDraft,
  type User,
  type VisitPurpose,
} from "@/lib/lab-board";

export type Result = { ok: true } | { ok: false; message: string };

const SESSION_KEY = "cse-lab-session";

type LabStoreValue = {
  ready: boolean;
  state: LabBoardState | null;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<Result>;
  logout: () => void;
  createAccount: (input: {
    name: string;
    username: string;
    password: string;
    role: Role;
    canOperateLabs: boolean;
  }) => Promise<Result>;
  setAccess: (userId: string, patch: { active?: boolean; canOperateLabs?: boolean; role?: Role }) => Result;
  resetPassword: (userId: string, password: string) => Promise<Result>;
  openLab: (labId: string, note: string) => Result;
  takeOverLab: (labId: string) => Result;
  updateOpenNote: (labId: string, note: string) => Result;
  closeLab: (labId: string) => Result;
  signIn: (labId: string, input: { name: string; identifier: string; purpose: VisitPurpose }) => Result;
  signOut: (attendanceId: string) => Result;
  addLab: (draft: LabDraft) => Result;
  updateLab: (labId: string, draft: LabDraft) => Result;
  removeLab: (labId: string) => Result;
  addEquipment: (labId: string, draft: EquipmentDraft) => Result;
  updateEquipment: (labId: string, equipmentId: string, draft: EquipmentDraft) => Result;
  removeEquipment: (labId: string, equipmentId: string) => Result;
  addSoftware: (labId: string, draft: SoftwareDraft) => Result;
  updateSoftware: (labId: string, softwareId: string, draft: SoftwareDraft) => Result;
  removeSoftware: (labId: string, softwareId: string) => Result;
  submitNote: (labId: string, kind: NoteKind, message: string) => Result;
  resolveNote: (noteId: string) => Result;
};

const LabStoreContext = createContext<LabStoreValue | null>(null);

export function LabStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LabBoardState | null>(null);
  const stateRef = useRef<LabBoardState | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loaded = loadLabBoard();
    stateRef.current = loaded;
    setState(loaded);
    setSessionId(window.sessionStorage.getItem(SESSION_KEY));
    setReady(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === LAB_BOARD_STORAGE_KEY) {
        const loaded = loadLabBoard();
        stateRef.current = loaded;
        setState(loaded);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const currentUser = state?.users.find((user) => user.id === sessionId && user.active) ?? null;

  useEffect(() => {
    if (!ready || !state || !sessionId) return;
    if (!state.users.some((user) => user.id === sessionId && user.active)) {
      window.sessionStorage.removeItem(SESSION_KEY);
      setSessionId(null);
    }
  }, [ready, state, sessionId]);

  const commit = useCallback((result: ActionResult): Result => {
    if (!result.ok) return { ok: false, message: result.message };
    saveLabBoard(result.state);
    stateRef.current = result.state;
    setState(result.state);
    return { ok: true };
  }, []);

  const actor = useCallback((): User | Result => {
    if (!currentUser) return { ok: false, message: "Sign in to continue." };
    return currentUser;
  }, [currentUser]);

  const value: LabStoreValue = {
    ready,
    state,
    currentUser,
    login: async (username, password) => {
      const current = stateRef.current;
      if (!current) return { ok: false, message: "The lab board is still loading." };
      if (!password) return { ok: false, message: "Enter your password." };
      const user = findUser(current, username, await hashPassword(password));
      if (!user) return { ok: false, message: "That username or password is not recognised, or the account is inactive." };
      window.sessionStorage.setItem(SESSION_KEY, user.id);
      setSessionId(user.id);
      return { ok: true };
    },
    logout: () => {
      window.sessionStorage.removeItem(SESSION_KEY);
      setSessionId(null);
    },
    createAccount: async (input) => {
      const current = stateRef.current;
      if (!current) return { ok: false, message: "The lab board is still loading." };
      if (input.password.trim().length < 6) return { ok: false, message: "Use a password of at least 6 characters." };
      const passwordHash = await hashPassword(input.password);
      return commit(
        createUser(current, currentUser, {
          name: input.name,
          username: input.username,
          passwordHash,
          role: input.role,
          canOperateLabs: input.canOperateLabs,
        }),
      );
    },
    setAccess: (userId, patch) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(updateUserAccess(state, user, userId, patch));
    },
    resetPassword: async (userId, password) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      if (password.trim().length < 6) return { ok: false, message: "Use a password of at least 6 characters." };
      return commit(resetPassword(state, user, userId, await hashPassword(password)));
    },
    openLab: (labId, note) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(openLab(state, labId, user, note));
    },
    takeOverLab: (labId) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(takeOverLab(state, labId, user));
    },
    updateOpenNote: (labId, note) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(updateOpenNote(state, labId, user, note));
    },
    closeLab: (labId) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(closeLab(state, labId, user));
    },
    signIn: (labId, input) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(signIn(state, labId, user, input));
    },
    signOut: (attendanceId) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(signOut(state, attendanceId, user));
    },
    addLab: (draft) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(addLab(state, user, draft));
    },
    updateLab: (labId, draft) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(updateLab(state, labId, user, draft));
    },
    removeLab: (labId) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(removeLab(state, labId, user));
    },
    addEquipment: (labId, draft) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(addEquipment(state, labId, user, draft));
    },
    updateEquipment: (labId, equipmentId, draft) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(updateEquipment(state, labId, equipmentId, user, draft));
    },
    removeEquipment: (labId, equipmentId) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(removeEquipment(state, labId, equipmentId, user));
    },
    addSoftware: (labId, draft) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(addSoftware(state, labId, user, draft));
    },
    updateSoftware: (labId, softwareId, draft) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(updateSoftware(state, labId, softwareId, user, draft));
    },
    removeSoftware: (labId, softwareId) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(removeSoftware(state, labId, softwareId, user));
    },
    submitNote: (labId, kind, message) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(submitNote(state, user, labId, kind, message));
    },
    resolveNote: (noteId) => {
      const user = actor();
      if (!state || "ok" in user) return state ? (user as Result) : { ok: false, message: "The lab board is still loading." };
      return commit(resolveNote(state, user, noteId));
    },
  };

  return <LabStoreContext.Provider value={value}>{children}</LabStoreContext.Provider>;
}

export function useLabStore() {
  const value = useContext(LabStoreContext);
  if (!value) throw new Error("useLabStore must be used within LabStoreProvider");
  return value;
}
