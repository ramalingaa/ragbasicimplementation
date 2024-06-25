'use client';

import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '../../zustand/app/appStore';
import InfoIcon from "components/infoIcon/InfoIcon";

const TopBar = () => {
  const pathname = usePathname();

  const routeName = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return 'Home';
    const name = pathSegments[pathSegments.length - 1];
    return name;
  }, [pathname]);

  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

  const mobileScreenSidebarOpen = useSidebarStore((state) => state.mobileScreenSidebarOpen);
  const setMobileScreenSidebarOpen = useSidebarStore((state) => state.setMobileScreenSidebarOpen);

  const infoMap: any = {
    'harbor': 'Central data hub with easy integrations.',
    'queries': 'Ask and explore data easily.',
    'reports': 'Create and share data stories together.',
    'blocks': 'Simplify workflows with automation.',
  }

  return (
    <div className={`fixed top-0 z-10 h-12 flex items-center justify-between p-4 bg-white border-b-[1px] border-[#eeeff1] w-fill-available ${!['harbor', 'queries', 'reports', 'blocks'].includes(routeName.toLowerCase()) && 'border-b-[1px]'}`}
    >
      <div className="flex flex-row items-center justify-center">
        <button
          onClick={() => {
            setSidebarOpen(!isSidebarOpen)
            setMobileScreenSidebarOpen(!mobileScreenSidebarOpen)
          }}
          aria-label="Toggle sidebar"
          className="p-2 px-2 mr-1 bg-offwhite-800 hover:bg-gray-100 rounded-md"
        >
          <GiHamburgerMenu />
        </button>
        <div className="flex flex-row capitalize gap-x-2 font-semibold text-[#232529]"
          style={{
            fontSize: '1rem',
            lineHeight: '1.25rem',
            letterSpacing: '-0.02em',
          }}
        >
          <span className="text-[#232529]">{routeName || 'Home'}</span>
          {infoMap[routeName.toLowerCase()] && (
            <InfoIcon tooltipText={infoMap[routeName.toLowerCase()]} />
          )}
        </div>
      </div>
      <div className="right">
        <SearchBar />
      </div>
    </div>

  );
};

import { MdKeyboardCommandKey } from "react-icons/md";
import { TbLetterK } from "react-icons/tb";
import { MdOutlineSearch } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";

import { MdKeyboardControlKey } from "react-icons/md";
import { useCommandPaletteStore } from "../../zustand/commandPalette/commandPaletteStore";

const SearchBar = () => {
  const [isAppleDevice, setIsAppleDevice] = useState(true);

  useEffect(() => {
    // Check if window object is defined (i.e., if running on client-side)
    if (typeof window !== 'undefined') {
      const isApple = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      setIsAppleDevice(isApple);
    }
  }, []);
  const {
    setOpen
  } = useCommandPaletteStore();
  return (
    <div className="flex flex-row items-center justify-center h-full text-sm cursor-pointer"
      onClick={() => setOpen(true)}
    >
      <div id="wrapper" className="flex flex-row items-center justify-center border-[1px] border-[#eeeff1] p-1 rounded-md">
        <AiOutlineSearch className="h-4 w-4 mr-1" />
        <div id="wrapper" className="flex flex-row items-center justify-center border-[1px] border-[#eeeff1] p-1 rounded-md">
          {isAppleDevice ?
            <MdKeyboardCommandKey className="h-3 w-3 font-semibold" />
            : <MdKeyboardControlKey className="h-3 w-3 font-semibold" />
          }
          <TbLetterK className="h-3 w-3 font-semibold" />
        </div>
      </div>
    </div>
  )
}

export default TopBar;
