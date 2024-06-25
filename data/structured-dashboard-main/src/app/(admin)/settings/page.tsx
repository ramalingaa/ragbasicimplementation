'use client';

import { useRouter } from 'next/navigation';
// Custom components
import Card from 'components/card/Card';
import ClearAllIntegrationsSection from 'components/settings/ClearAllIntegrationsSection';
import ClearAllReportsSection from 'components/settings/ClearAllReportsSection';
import ClearSessionHistorySection from 'components/settings/ClearSessionHistorySection';
import DeleteAccountSection from 'components/settings/DeleteAccountSection';
import SettingsPageLayout from 'layouts/SettingsPageLayout';

export default function Settings() {
  const router = useRouter();

  return (
    <>
      <SettingsPageLayout />
      
    </>
  );
}