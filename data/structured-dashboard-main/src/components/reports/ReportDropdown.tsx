import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import { useReportsStore } from '../../zustand/reports/reportsStore';

interface ReportDropdownProps {
  report: any;
  onDrillDown: (report: any) => void;
  isLoading: boolean;
  onViewMode?: boolean;
  itemId?: string;
}

export const ReportDropdown: React.FC<ReportDropdownProps> = ({
  report,
  onDrillDown,
  isLoading,
  onViewMode,
  itemId,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { removeItemFromReportBoxes } = useReportsStore();

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowDropdown((prevState) => !prevState);
  };

  const handleDrillDownClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDrillDown(report);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log('Item ID:', itemId);
    removeItemFromReportBoxes(itemId);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="relative text-gray-500"
        onClick={toggleDropdown}
      >
        <FaEllipsisV size={12} />
      </button>
      {showDropdown && (
        <div
          className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10 min-w-[120px]"
          ref={dropdownRef}
        >
          {onViewMode ? (
            <button
              type="button"
              className={`px-4 py-2 text-sm hover:bg-gray-100 w-full flex items-center justify-center ${
                isLoading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              onClick={handleDrillDownClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
              ) : null}
              Drill Down
            </button>
          ) : (
            <button
              type="button"
              className="pl-2 pr-4 py-1 text-sm hover:bg-gray-100 w-full flex items-center justify-start gap-x-2 text-red-500"
              onClick={handleDeleteClick}
            >
              <TiDelete className="ml-1 text-sm text-red-500" />{' '}
              <span className="text-sm text-red-500">Delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
