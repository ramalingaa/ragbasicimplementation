import create from 'zustand';

interface SelectedColumns {
  joining: { first: string | null; second: string | null };
  syncing: { first: string | null; second: string | null };
}

interface Connection {
  dataSources: string[];
  selectedColumns: SelectedColumns;
  id: string;
}

interface AssociationSelectedColumns {
  joining: { first: string | null; second: string | null };
}

interface Association {
  dataSources: string[];
  selectedColumns: AssociationSelectedColumns;
  id: string;
}

type RegistryState = {
  connections: Connection[];
  setConnections: (connections: Connection[]) => void;
  associations: Association[];
  setAssociations: (associations: Association[]) => void;
};

export const useRegistryStore = create<RegistryState>((set) => ({
  connections: [],
  setConnections: (connections) => set({ connections }),
  associations: [],
  setAssociations: (associations) => set({ associations }),
}));
