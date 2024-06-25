'use client';
import { PropsWithChildren, useState } from 'react';

// Chakra imports

// Layout components
import { SidebarContext } from 'contexts/SidebarContext';
import { isWindowAvailable } from 'utils/navigation';

// Custom Chakra theme

interface AuthProps extends PropsWithChildren {}

export default function AuthLayout({ children }: AuthProps) {
  // states and functions
  const [toggleSidebar, setToggleSidebar] = useState(false);
  if (isWindowAvailable()) document.documentElement.dir = 'ltr';
  return (
    <div>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <div
          className='float-right min-h-screen w-full bg-white relative h-full'
          style={{
            transition:"all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)",
            transitionDuration:".2s, .2s, .35s",
            transitionProperty:"top, bottom, width",
            transitionTimingFunction:"linear, linear, ease"
          }}
        >
          <div className='mx-auto min-h-screen'>
            {children}
          </div>
        </div>
      </SidebarContext.Provider>
    </div>
  );
}
