// CustomNode.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { FaEllipsisV } from 'react-icons/fa';
import useDeleteBlock from 'hooks/blocks/useDeleteBlock';
import { useConfirmationMessageStore } from '../../zustand/confirmationMessage/confirmationMessageStore';
import { useBlocksStore } from '../../zustand/blocks/blocksStore';

interface CustomNodeData {
  label: string;
}

interface CustomNodeProps {
  id: string;
  data: CustomNodeData;
  isFirstNode?: boolean; // Add this prop
}

const CustomNode: React.FC<CustomNodeProps> = ({
  id,
  data,
  isFirstNode = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { deleteBlock } = useDeleteBlock();
  const { setConfirmationMessage } = useConfirmationMessageStore();
  const setIsBlocksSidebarOpen = useBlocksStore(
    (state) => state.setIsBlocksSidebarOpen,
  );

  const setSelectedBlockId = useBlocksStore(
    (state) => state.setSelectedBlockId,
  );

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div
      className={`bg-white border border-gray-300 rounded-lg px-6 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer relative w-48 ${
        isFirstNode ? 'border-2 border-blue-500' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setSelectedBlockId(id);
        setIsBlocksSidebarOpen(true);
      }}
    >
      <p className={`font-bold text-sm ${isFirstNode ? 'text-blue-500' : ''}`}>
        {data.label}
      </p>
      {isHovered && (
        <button
          type="button"
          className="text-gray-500 ml-auto"
          onClick={(e) => {
            toggleDropdown();
          }}
        >
          <FaEllipsisV size={12} />
        </button>
      )}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-10 right-2 bg-white border border-gray-300 rounded-md shadow-md z-10"
        >
          <button
            type="button"
            className="px-4 py-2 text-sm hover:bg-gray-100 w-full"
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit action
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmationMessage(
                'Delete Block',
                'Are you sure you want to delete this block? This action cannot be undone.',
                async () => {
                  await deleteBlock(id);
                },
              );
            }}
          >
            Delete
          </button>
        </div>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
