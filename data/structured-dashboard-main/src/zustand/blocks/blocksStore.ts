// useBlocksStore.ts
import { DataSource } from '../../interfaces/DataTypes';
import create from 'zustand';

export type Block = {
  id: string;
  blockName: string;
  blockPrompt?: string;
  blockDataSource?: DataSource;
  blockResults?: any[];
  blockMetric?: string;
};

type BlocksState = {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
  addBlock: (block: Block) => void;
  removeBlock: (blockId: string) => void;
  addBlockResults: (blockId: string, results: any[]) => void; // New setter
  blocksChosenDataSource: DataSource | null;
  setBlocksChosenDataSource: (dataSource: DataSource | null) => void;
  isBlockCreationModalOpen: boolean;
  setIsBlockCreationModalOpen: (isOpen: boolean) => void;
  blocksChosenTemplate: string | null;
  setBlocksChosenTemplate: (template: string | null) => void;
  isBlocksSidebarOpen: boolean;
  setIsBlocksSidebarOpen: (isOpen: boolean) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (blockId: string | null) => void;
  selectedBlock: Block | null;
  setSelectedBlock: (block: Block | null) => void;
  blockCreationName: string;
  setBlockCreationName: (name: string) => void;
};

export const useBlocksStore = create<BlocksState>((set) => ({
  blocks: [],
  selectedBlock: null,
  setSelectedBlock: (block) => set({ selectedBlock: block }),
  setBlocks: (blocks) => set({ blocks }),
  addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
  removeBlock: (blockId) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== blockId),
    })),
  addBlockResults: (blockId, results) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === blockId ? { ...block, blockResults: results } : block,
      ),
    })),
  blocksChosenDataSource: null,
  setBlocksChosenDataSource: (dataSource) =>
    set({ blocksChosenDataSource: dataSource }),
  isBlockCreationModalOpen: false,
  setIsBlockCreationModalOpen: (isOpen) =>
    set({ isBlockCreationModalOpen: isOpen }),
  blocksChosenTemplate: null,
  setBlocksChosenTemplate: (template) =>
    set({ blocksChosenTemplate: template }),
  isBlocksSidebarOpen: false,
  setIsBlocksSidebarOpen: (isOpen) => set({ isBlocksSidebarOpen: isOpen }),
  selectedBlockId: null,
  setSelectedBlockId: (blockId) => set({ selectedBlockId: blockId }),
  blockCreationName: '',
  setBlockCreationName: (name) => set({ blockCreationName: name }),
}));
