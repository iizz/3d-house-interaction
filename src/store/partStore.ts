import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type PartStore = {
  selectedPart: string | null;
  setSelectedPart: (part: string | null) => void;
};

export const usePartStore = create<PartStore>()(
  devtools(
    (set) => ({
      selectedPart: null,
      setSelectedPart: (part) => set({ selectedPart: part }),
    }),
    { name: 'PartStore' }
  )
);
