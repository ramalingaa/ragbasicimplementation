import create  from "zustand";

type CommandPaletteState = {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
};

export const useCommandPaletteStore = create<CommandPaletteState>(
    (set) => ({
        isOpen: false,
        setOpen: (isOpen) => set({ isOpen }),
    })
);