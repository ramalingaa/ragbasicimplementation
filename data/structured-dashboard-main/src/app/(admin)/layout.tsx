'use client';

// Chakra imports
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

import SecondaryTopBar from 'components/secondaryTopBar/SecondaryTopBar';
// Layout components
import Sidebar from 'components/sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import TopBar from 'components/topbar/TopBar';
import routes from 'routes';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '../../zustand/app/appStore';
import DataViewModal from 'components/harbor/DataViewModal';
import Notification from 'components/notifications/notification';
import CommandPalette from 'components/commandPalette/CommandPalette';
import ConfirmationMessage from 'components/confirmationDialog/ConfirmationDialog';
import useSetupWorkspace from 'hooks/workspace/useSetupWorkspace';
import NewInvitationsModal from 'components/settings/team/NewInvitationsModal';
import useDisclosure from 'hooks/useDisclosure';
import NewInvitationsNotifications from 'components/settings/team/NewInvitationsNotifications';
import useUserProfileInfo from 'hooks/settings/useUserProfileInfo';
import { TidioChat } from 'components/sidebar/components/TidioChat';
import { useCustomerSupportStore } from '../../zustand/customerSupport/customerSupportStore';
import { useAuthStore } from 'zustand/auth/authStore';
import useAuth from 'hooks/auth/useAuth';
import useFetchDataSources from 'hooks/harbor/useFetchDataSources';
import { useHarborStore } from 'zustand/harbor/harborStore';

interface DashboardLayoutProps extends PropsWithChildren {
  [x: string]: any;
}

// Custom Chakra theme
export default function AdminLayout(props: DashboardLayoutProps) {
  const { children, ...rest } = props;
  const [fixed] = useState(false);

  useEffect(() => {
    window.document.documentElement.dir = 'ltr';
  });

  const pathname = usePathname();
  const sidebarOpen = useSidebarStore((state) => state.isSidebarOpen);

  const routeName = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const name = pathSegments[pathSegments.length - 1];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, [pathname]);

  const showSecondayTopBar = [
    'home',
    'harbor',
    'queries',
    'reports',
    'blocks',
  ].includes(routeName.toLowerCase());
  const { user } = useAuthStore();
  const { initWorkspaceSettings } = useSetupWorkspace();
  const { llmModel } = useUserProfileInfo();
  const { currentWorkspace } = useWorkspaceStore();
  const { setComponentView } = useHarborStore();
  useAuth();
  useEffect(() => {
    initWorkspaceSettings();
    // setComponentView('source');
  }, [user?.sub, currentWorkspace]);

  const { chatVisible } = useCustomerSupportStore();

  return (
    <div>
      <Sidebar routes={routes} {...rest} />
      {/* right menu */}
      <main className={`${sidebarOpen ? 'lg:pl-[17.188rem]' : 'lg:pl-16'}`}>
        <div className={`flex-1 min-h-screen bg-[#f8f9fa]`}>
          <TopBar />
          {showSecondayTopBar && <SecondaryTopBar />}

          <div
            className={`mx-auto ${
              [
                'harbor',
                'workspace',
                'account',
                'billing',
                'settings',
              ].includes(routeName.toLowerCase())
                ? 'p-0'
                : 'p-[20px] md:p-[30px]'
            } relative ${
              showSecondayTopBar ? 'top-[6rem]' : 'top-12'
            } overflow-y-scroll bg-white`}
            style={{
              height: showSecondayTopBar
                ? 'calc(100vh - 6rem)'
                : 'calc(100vh - 4rem)',
            }}
          >
            {children}
            <DataViewModal />
          </div>
        </div>
      </main>
      <Notification />
      <CommandPalette />
      <ConfirmationMessage />
      {/* <NewInvitationsModal
        isOpen={isNewInvitationsModalOpen}
        onClose={onNewInvitationsModalClose}
      /> */}
      <NewInvitationsNotifications />

      {/* scripts */}
      <TidioChat visible={chatVisible} />
    </div>
  );
}
