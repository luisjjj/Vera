import { create } from 'zustand';
import { Platform } from '@/types/models';

interface OnboardingState {
  step: number;
  displayName: string;
  niche: string;
  platforms: Platform[];
  toneOfVoice: string;
  goals: string[];
  setStep: (step: number) => void;
  setDisplayName: (name: string) => void;
  setNiche: (niche: string) => void;
  setPlatforms: (platforms: Platform[]) => void;
  togglePlatform: (platform: Platform) => void;
  setToneOfVoice: (tone: string) => void;
  setGoals: (goals: string[]) => void;
  toggleGoal: (goal: string) => void;
  reset: () => void;
}

const initialState = {
  step: 1,
  displayName: '',
  niche: '',
  platforms: [] as Platform[],
  toneOfVoice: '',
  goals: [] as string[],
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setDisplayName: (displayName) => set({ displayName }),
  setNiche: (niche) => set({ niche }),
  setPlatforms: (platforms) => set({ platforms }),
  togglePlatform: (platform) =>
    set((state) => ({
      platforms: state.platforms.includes(platform)
        ? state.platforms.filter((p) => p !== platform)
        : [...state.platforms, platform],
    })),
  setToneOfVoice: (toneOfVoice) => set({ toneOfVoice }),
  setGoals: (goals) => set({ goals }),
  toggleGoal: (goal) =>
    set((state) => ({
      goals: state.goals.includes(goal)
        ? state.goals.filter((g) => g !== goal)
        : [...state.goals, goal],
    })),
  reset: () => set(initialState),
}));
