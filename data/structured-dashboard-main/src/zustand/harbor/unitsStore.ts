import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UnitsState {
    units: any | null,
    setUnits: (units: any) => void,
    filteredUnits: any | null,
    setFilteredUnits: (units: any) => void,
    filterText: string,
    setFilterText: (text: string) => void,
}

export const unitsStore = create<UnitsState, [["zustand/persist", UnitsState]]>(
    persist(
        (set, get) => ({
            units: [],
            setUnits: (units: any) => set({ units }),
            filteredUnits: [],
            setFilteredUnits: (filteredUnits: any) => set({ filteredUnits }),
            filterText: '',
            setFilterText: (text: string) => set({ filterText: text }),
        }),
        {
            name: 'unitsStore',
        },
    ),
)

// export const useWorkspaceStore = useStore(workspaceStore,  (state) => state);
export const useUnitsStore = unitsStore;
