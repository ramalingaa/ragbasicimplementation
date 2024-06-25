import useThemeColors from 'hooks/useThemeColors';
import React, { ReactNode } from 'react';

interface DashboardContainerProps {
  children: ReactNode;
  noBackground?: boolean;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  children,
  noBackground = false,
}) => {
  const { themeContainerBgColor } = useThemeColors();

  return (
    <div
      className={`flex w-full rounded-md flex-col ${!noBackground ? 'bg-white' : 'bg-transparent'} p-4 mt-4 mb-10 items-center justify-center ${!noBackground ? 'shadow-md' : 'shadow-none'}`}
    >
      {children}
    </div>
  );
};

export default DashboardContainer;
