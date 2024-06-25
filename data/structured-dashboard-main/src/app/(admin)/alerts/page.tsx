import React from 'react';
import type { Metadata } from 'next';
import HomeContainer from 'components/home/HomeContainer';
import AlertsContainer from 'components/alerts/AlertsContainer';

export const metadata: Metadata = {
  title: 'Alerts',
};

export default function Default() {
  return <AlertsContainer />;
}
