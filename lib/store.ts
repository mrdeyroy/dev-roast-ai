import { create } from "zustand";
import type { RoastMode, ProfileType } from "./utils";
import type { RoastResult } from "./types/roast";

export type ValidationStatus = "idle" | "checking" | "valid" | "invalid";

interface RoastInput {
  profileType: ProfileType;
  profileUrl: string;
  linkedInText: string;
  roastMode: RoastMode;
  placementMode: boolean;
}

interface RoastStore {
  input: RoastInput;
  setInput: (input: Partial<RoastInput>) => void;
  resetInput: () => void;

  isLoading: boolean;
  loadingProgress: number;
  loadingStep: string;
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setLoadingStep: (step: string) => void;

  currentRoastId: string | null;
  roastResult: RoastResult | null;
  setCurrentRoastId: (id: string | null) => void;
  setRoastResult: (result: RoastResult | null) => void;

  error: string | null;
  setError: (error: string | null) => void;

  validationStatus: ValidationStatus;
  validationMessage: string;
  setValidation: (status: ValidationStatus, message?: string) => void;
}

const defaultInput: RoastInput = {
  profileType: "github",
  profileUrl: "",
  linkedInText: "",
  roastMode: "recruiter",
  placementMode: false,
};

export const useRoastStore = create<RoastStore>((set) => ({
  input: defaultInput,
  setInput: (input) =>
    set((state) => ({ input: { ...state.input, ...input } })),
  resetInput: () => set({ input: defaultInput }),

  isLoading: false,
  loadingProgress: 0,
  loadingStep: "",
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setLoadingStep: (step) => set({ loadingStep: step }),

  currentRoastId: null,
  roastResult: null,
  setCurrentRoastId: (id) => set({ currentRoastId: id }),
  setRoastResult: (result) => set({ roastResult: result }),

  error: null,
  setError: (error) => set({ error }),

  validationStatus: "idle",
  validationMessage: "",
  setValidation: (status, message = "") => set({ validationStatus: status, validationMessage: message }),
}));
