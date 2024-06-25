'use client';
import { useCallback, useEffect, useMemo } from 'react';

import { IRoute } from 'types/navigation';
import Link from 'next/link';
import SidebarUserProfile from './SidebarUserProfile';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '../../../zustand/app/appStore';

interface SidebarLinksProps {
  routes: IRoute[];
}

export function SidebarLinks(props: SidebarLinksProps) {
  const { routes } = props;

  const pathname = usePathname();


  const activeRoute = useCallback(
    (routeName: string) => pathname?.includes(routeName),
    [pathname],
  );

  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);

  const routeName = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const name = pathSegments[pathSegments.length - 1];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, [pathname]);

  useEffect(() => {
    document.title = routeName;
  }, [routeName]);

  const createLinks = (routes: IRoute[]) => {
    const specialLinks = routes.filter(
      (route) => route.layout === '/docs' || route.name === 'Settings',
    );
    const otherRoutes = routes.filter(
      (route) => route.layout !== '/docs' && route.name !== 'Settings',
    );

    return (
      <>
        {otherRoutes.map((route, index) => (
          <Link
          key={index}
            href={route.layout + route.path}
            className="w-full"
          >
            <div
              className={`transition-bg duration-0 cursor-pointer my-1.5 py-1.5 mx-2 flex items-center ${isSidebarOpen ? 'justify-start pl-1' : 'justify-center'} ${activeRoute(route.path.toLowerCase()) ? 'border-gray-100 bg-black' : 'hover:bg-gray-200 bg-transparent'} border-opacity-50 rounded-lg w-auto`}
            >
                {route.icon}
              {isSidebarOpen && (
                <p
                  className={`${activeRoute(route.path.toLowerCase()) ? 'text-neutral-100 font-bold' : 'text-black font-normal'
                    } text-md w-full`}
                >
                  {route.name}
                </p>
              )}
            </div>
          </Link>
        ))}
        <div className="cursor-pointer absolute bottom-4 w-full">
          <SidebarUserProfile />
        </div>
      </>
    );
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
