import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type StepStore = {
  step: number;
  setStep: (step: number) => void;
};

export const useStepStore = create<StepStore>()(
  devtools(
    (set) => ({
      step: 1,
      setStep: (step) => set({ step }),
    }),
    { name: 'StepStore', enabled: true }
  )
);
