'use client';

// chakra imports
import Brand from 'components/sidebar/components/Brand';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon
} from '@heroicons/react/24/outline';

import { IRoute } from 'types/navigation';
// Assets
import { useSidebarStore } from '../../zustand/app/appStore';
import { usePathname } from 'next/navigation';
import SidebarUserProfile from './components/SidebarUserProfile';
import TrialBanner from 'components/trailBanner/TrailBanner';
import WorkspaceSelectMenu from './components/WorkspaceSelectMenu';

interface SidebarResponsiveProps {
  routes: IRoute[];
}

interface SidebarProps extends SidebarResponsiveProps {
  [x: string]: any;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function Sidebar(props: SidebarProps) {
  const { routes } = props;

  const sidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

  const pathname = usePathname();

  const routeName = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const name = pathSegments[pathSegments.length - 1];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, [pathname]);

  const mobileScreenSidebarOpen = useSidebarStore((state) => state.mobileScreenSidebarOpen);
  const setMobileScreenSidebarOpen = useSidebarStore((state) => state.setMobileScreenSidebarOpen);


  return (
    <>
      <Transition.Root show={mobileScreenSidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 lg:hidden" onClose={setMobileScreenSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setMobileScreenSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <Brand />
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {routes.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.path}
                                className={classNames(
                                  routeName.toLowerCase() === item.name.toLowerCase()
                                    ? 'bg-gray-100 text-black'
                                    : 'text-[#232529] hover:text-black hover:bg-sidebar-link-hover',
                                  mobileScreenSidebarOpen ? 'items-center content-center p-2 pl-1' : 'place-content-center p-2',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                )}
                              >
                                <item.icon
                                  className={classNames(
                                    // routeName.toLowerCase() === item.name.toLowerCase() ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                    'h-[1rem] w-[1rem] shrink-0',
                                  )}
                                  aria-hidden="true"
                                />
                                {mobileScreenSidebarOpen && <span className='tracking-tighter font-medium place-content-center text-[0.875rem] h-full my-auto'>
                                  {item.name}
                                </span>}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="w-full mb-4 mt-auto items-center justify-center">
                        <WorkspaceSelectMenu />
                        {sidebarOpen && <div className="border-t border-[#eeeff1] my-4" />}
                        {/* <TrialBanner /> */}
                        <SidebarUserProfile />
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop min-width: 200px; max-width: 350px; */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex ${sidebarOpen ? 'lg:w-[17.188rem] lg:max-w-[21.875rem] lg:min-w-[15.625rem]' : 'lg:w-16'} lg:flex-col`}>
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-[#eeeff1] bg-[#FBFBFB]">
          <Brand />
          <nav className="flex flex-1 flex-col px-6">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {routes.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.path}
                        className={classNames(
                          routeName.toLowerCase() === item.name.toLowerCase()
                            ? 'bg-gray-100 text-black'
                            : ' text-[#232529] hover:text-black hover:bg-sidebar-link-hover',
                          sidebarOpen ? 'items-center content-center p-2 pl-1' : 'place-content-center p-2',
                          'group flex rounded-md text-sm leading-6 font-medium h-8'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            routeName.toLowerCase() === item.name.toLowerCase()
                              ? '' : '',
                            'h-[1rem] w-[1rem] shrink-0',
                            `mx-1.5 flex justify-center w-auto`,
                            sidebarOpen && "mr-[0.375rem]",

                          )}
                          aria-hidden="true"
                        />
                        {sidebarOpen && <span className='tracking-tighter font-medium place-content-center text-[0.875rem] h-full my-auto'>
                          {item.name}
                        </span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="w-full mb-4 mt-auto items-center justify-center">
                {sidebarOpen && <WorkspaceSelectMenu />}
                {sidebarOpen && <div className="border-t border-[#eeeff1] my-4" />}
                {/* {sidebarOpen && <TrialBanner />} */}
                <SidebarUserProfile />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
