'use client';

// BlocksContainer.tsx
import React from 'react';
import BlockCard from './BlockCard';
import { useBlocksStore } from '../../zustand/blocks/blocksStore';
import EmptyState from 'components/emptyState/EmptyState';
import BlocksCreationModal from './BlocksCreationModal';

const BlocksContainer: React.FC = () => {
  const blocks = useBlocksStore((state) => state.blocks);

  const { isBlockCreationModalOpen, setIsBlockCreationModalOpen } =
    useBlocksStore();

  if (blocks.length === 0) {
    return (
      <>
        <EmptyState
          title="No blocks"
          desciption="Get started by creating a new block."
        />
        <BlocksCreationModal
          isOpen={isBlockCreationModalOpen}
          onClose={() => setIsBlockCreationModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blocks.map((block) => (
        <BlockCard key={block.id} block={block} />
      ))}
      <BlocksCreationModal
        isOpen={isBlockCreationModalOpen}
        onClose={() => setIsBlockCreationModalOpen(false)}
      />
    </div>
  );
};

export default BlocksContainer;
