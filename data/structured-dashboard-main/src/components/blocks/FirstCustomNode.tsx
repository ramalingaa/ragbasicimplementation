import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { FaEllipsisV } from 'react-icons/fa';
import { IoMdRadioButtonOn } from 'react-icons/io';
import useDeleteBlock from 'hooks/blocks/useDeleteBlock';
import { useConfirmationMessageStore } from '../../zustand/confirmationMessage/confirmationMessageStore';
import { useBlocksStore } from '../../zustand/blocks/blocksStore';

interface CustomNodeData {
  label: string;
  trigger?: {
    name: string;
    type: string;
  };
}

interface FirstCustomNodeProps {
  id: string;
  data: CustomNodeData;
}

const FirstCustomNode: React.FC<FirstCustomNodeProps> = ({ id, data }) => {
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

if (data.trigger) {
  return (
    <div
      className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex flex-col hover:bg-gray-100 cursor-pointer relative px-10 py-4"
      style={{ width: '300px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setSelectedBlockId(id);
        setIsBlocksSidebarOpen(true);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 border border-blue-300 rounded-full p-1 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-blue-500"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <span className="font-medium text-xs text-gray-500 mr-1">
            {data.trigger.name}
          </span>
        </div>
        <div className="flex items-center">
          <span className="px-1 py-0.5 rounded-md bg-[#bee3f8] text-[#2a4365] text-xs mr-2">
            {data.trigger.type}
          </span>
          {isHovered && (
            <button
              type="button"
              className="text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown();
              }}
            >
              <FaEllipsisV size={12} />
            </button>
          )}
        </div>
      </div>
      <div className="w-full border-t border-gray-300 mt-2 pt-2">
        <span className="text-xs text-gray-500">No description</span>
      </div>
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
}

  return (
    <div
      className="bg-white border-2 border-blue-500 rounded-lg px-10 py-6 flex items-center justify-between hover:bg-gray-100 cursor-pointer relative w-200"
      style={{ borderStyle: 'dashed', width: '300px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setSelectedBlockId(id);
        setIsBlocksSidebarOpen(true);
      }}
    >
      <div className="flex items-center">
        <IoMdRadioButtonOn size={16} className="text-gray-500 mr-2" />
        <span className="font-medium text-xs text-gray-500">{data.label}</span>
      </div>
      {isHovered && (
        <button
          type="button"
          className="text-gray-500 ml-auto"
          onClick={(e) => {
            e.stopPropagation();
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

export default FirstCustomNode;
