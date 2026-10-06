import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import {
  addEquipment,
  addLab,
  addSoftware,
  closeLab,
  LAB_BOARD_STORAGE_KEY,
  loadLabBoard,
  openLab,
  removeEquipment,
  removeLab,
  removeSoftware,
  saveLabBoard,
  signIn,
  signOut,
  updateEquipment,
  updateLab,
  updateOpenNote,
  updateSoftware,
  type ActionResult,
  type EquipmentDraft,
  type LabBoardState,
  type LabDraft,
  type SoftwareDraft,
  type VisitPurpose,
} from "@/lib/lab-board";

export type Result = { ok: true } | { ok: false; message: string };

type LabStoreValue = {
  ready: boolean;
  state: LabBoardState | null;
  openLab: (labId: string, openedBy: string, note: string) => Result;
  updateOpenNote: (labId: string, openedBy: string, note: string) => Result;
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
};

const LabStoreContext = createContext<LabStoreValue | null>(null);

export function LabStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LabBoardState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadLabBoard());
    setReady(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === LAB_BOARD_STORAGE_KEY) setState(loadLabBoard());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((result: ActionResult): Result => {
    if (!result.ok) return { ok: false, message: result.message };
    saveLabBoard(result.state);
    setState(result.state);
    return { ok: true };
  }, []);

  const value: LabStoreValue = {
    ready,
    state,
    openLab: (labId, openedBy, note) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(openLab(state, labId, openedBy, note));
    },
    updateOpenNote: (labId, openedBy, note) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(updateOpenNote(state, labId, openedBy, note));
    },
    closeLab: (labId) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(closeLab(state, labId));
    },
    signIn: (labId, input) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(signIn(state, labId, input));
    },
    signOut: (attendanceId) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(signOut(state, attendanceId));
    },
    addLab: (draft) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(addLab(state, draft));
    },
    updateLab: (labId, draft) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(updateLab(state, labId, draft));
    },
    removeLab: (labId) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(removeLab(state, labId));
    },
    addEquipment: (labId, draft) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(addEquipment(state, labId, draft));
    },
    updateEquipment: (labId, equipmentId, draft) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(updateEquipment(state, labId, equipmentId, draft));
    },
    removeEquipment: (labId, equipmentId) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(removeEquipment(state, labId, equipmentId));
    },
    addSoftware: (labId, draft) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(addSoftware(state, labId, draft));
    },
    updateSoftware: (labId, softwareId, draft) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(updateSoftware(state, labId, softwareId, draft));
    },
    removeSoftware: (labId, softwareId) => {
      if (!state) return { ok: false, message: "The lab board is still loading." };
      return commit(removeSoftware(state, labId, softwareId));
    },
  };

  return <LabStoreContext.Provider value={value}>{children}</LabStoreContext.Provider>;
}

export function useLabStore() {
  const value = useContext(LabStoreContext);
  if (!value) throw new Error("useLabStore must be used within LabStoreProvider");
  return value;
}
