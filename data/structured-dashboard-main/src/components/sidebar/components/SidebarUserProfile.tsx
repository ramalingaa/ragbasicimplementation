import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FaBook, FaSlack } from 'react-icons/fa';
import { FiInfo, FiSettings } from "react-icons/fi";
import { MdLogout, MdOutlineContactSupport } from "react-icons/md";
import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';
import { useSidebarStore } from '../../../zustand/app/appStore';
import { useAuthStore } from 'zustand/auth/authStore';
import { TidioChat } from './TidioChat';
import { RiCustomerService2Fill } from "react-icons/ri";
import { useCustomerSupportStore } from '../../../zustand/customerSupport/customerSupportStore';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const SidebarUserProfile = () => {
  const { user, isLoading } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const mobileScreenSidebarOpen = useSidebarStore((state) => state.mobileScreenSidebarOpen);
  const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

  const handleImageClick = () => {
    if (!isSidebarOpen) setSidebarOpen(true);
    setIsMenuOpen((prev) => !prev);
  };

  const {
    chatVisible,
    setChatVisible
  } = useCustomerSupportStore();

  const menuItems = [
    {
      name: 'About',
      href: 'https://www.structuredlabs.io',
      icon: <FiInfo />,
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    {
      name: 'Join Slack',
      href: 'https://join.slack.com/t/structured-users/shared_invite/zt-265ong01f-UHP6BP3FzvOmMQDIKty_JQ',
      icon: <FaSlack />,
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    {
      name: 'Contact Us',
      href: 'mailto:support@structuredlabs.io',
      icon: <MdOutlineContactSupport />,
      target: '',
      rel: '',
    },
    {
      name: 'Support Chat',
      href: '#',
      icon: <RiCustomerService2Fill />,
      target: '',
      rel: '',
      onclick: () => setChatVisible(!chatVisible),
    },
    {
      name: 'Documentation',
      href: 'https://docs.structuredlabs.io/intro',
      icon: <FaBook />,
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <FiSettings />,
      target: '',
      rel: '',
      onclick: () => router.push('/settings'),
    },
  ];

  return (
    <div
      className="relative w-full flex justify-center items-center"
    >
      <Menu as="div" className="relative inline-block text-left w-full">
        <Menu.Button className={`inline-flex w-full min-w-fit justify-center gap-x-1.5 rounded-md bg-[#FBFBFB] ${(isSidebarOpen || mobileScreenSidebarOpen) ? 'px-3 hover:bg-gray-100' : ''} py-2 text-sm font-semibold text-gray-900  border-none`}
          onClick={handleImageClick}
        >
          <div className="flex w-full">
            <div className="flex flex-row items-center justify-center w-full self-center gap-x-1.5">
              <img
                className="rounded-full w-8 h-8 min-w-fit"
                src={user?.picture ?? ''}
                alt="Profile"
              />
              {(isSidebarOpen || mobileScreenSidebarOpen) && (
                <span className="max-w-36 truncate font-normal text-md">
                  { user?.name ? user.name : 'Loading...'}
                </span>
              )}
            </div>
          </div>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute mt-2 origin-bottom bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none rounded-lg bg-[menuBg] z-50 bottom-full min-w-48 lg:left-[1.5rem] left-[2.4rem]">
            <div className="flex-col p-2.5 py-1">
              {
                menuItems.map((item, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <a
                        href={item.href}
                        target={item.target}
                        rel={item.rel}
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                          "flex flex-row items-center p-2 rounded-md hover:bg-[hoverBg]"
                        )}
                        onClick={item.onclick}
                      >
                        {item.icon}
                        <span className="ml-2 tracking-tighter font-normal place-content-center text-[0.875rem] h-full my-auto">
                          {item.name}
                        </span>
                      </a>
                    )}
                  </Menu.Item>
                ))
              }
              <div className="border-t-[1px] my-1 border border-[#eeeff1]" />
              <Menu.Item >
                {({ active }) => (
                  <a
                    href={'/api/auth/logout'}
                    target={''}
                    rel={''}
                    className={classNames(
                      active ? 'bg-gray-100 text-red-btn-bg' : 'text-red-btn-hover',
                      'block px-4 py-2 text-sm',
                      "flex flex-row items-center p-2 rounded-md hover:bg-[hoverBg]"
                    )}
                    onClick={() => (window.location.href = '/api/auth/logout')}
                  >
                    <MdLogout />
                    <span className="ml-2 tracking-tighter font-normal place-content-center text-[0.875rem] h-full my-auto">
                      Log out
                    </span>
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <TidioChat visible={chatVisible} />
    </div>
  );
};

export default SidebarUserProfile;
