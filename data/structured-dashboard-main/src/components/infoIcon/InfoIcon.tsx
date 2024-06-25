import React from 'react';
import { GoInfo } from "react-icons/go";

interface InfoIconProps {
  tooltipText: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ tooltipText }) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="group flex items-center">
        <GoInfo className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        <div className="font-normal absolute left-full ml-3 hidden min-w-max rounded-md bg-black px-3 py-1 text-white group-hover:block text-xs">
          {tooltipText}
          {/* <div className="tooltip-arrow absolute top-1/2 -left-2 -translate-y-1/2 rotate-45 w-3 h-3 bg-black"></div> */}
        </div>
      </div>
    </div>
  );
};

export default InfoIcon;
