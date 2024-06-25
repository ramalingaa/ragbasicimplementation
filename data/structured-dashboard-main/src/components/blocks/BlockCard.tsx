// BlockCard.tsx
import React from 'react';
import { FaPencilAlt, FaDatabase } from 'react-icons/fa';
import { Block, useBlocksStore } from '../../zustand/blocks/blocksStore';

interface BlockCardProps {
  block: Block;
}

const BlockCard: React.FC<BlockCardProps> = ({ block }) => {
  const setSelectedBlock = useBlocksStore((state) => state.setSelectedBlock);

  const handleClick = () => {
    setSelectedBlock(block);
  };

  return (
    <div
      className="border border-gray-300 rounded-lg p-4 h-40 flex flex-col hover:bg-gray-50 cursor-pointer relative"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full uppercase">
            Draft
          </span>
        </div>
        <button
          type="button"
          className="relative text-gray-500 rounded-full hover:bg-gray-200 p-2 transition duration-300 ease-in-out"
        >
          <FaPencilAlt size={12} />
        </button>
      </div>
      {block.blockDataSource ? (
        <div className="flex w-full items-center mt-4">
          <div className="flex flex-row items-center justify-start text-sm">
            <div className="flex flex-row items-center justify-center mr-3 text-sm">
              <FaDatabase size={16} />
            </div>
            <div className="flex flex-col max-w-[13rem] truncate text-sm">
              <span className="truncate" style={{ fontSize: '0.775rem' }}>
                {block.blockDataSource?.name}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 font-bold text-sm flex items-center text-ellipsis">
          {block.blockName.replace(/^"|"$/g, '')}
        </p>
      )}
    </div>
  );
};

export default BlockCard;
