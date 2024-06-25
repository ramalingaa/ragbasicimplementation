import React from 'react';
import type { Metadata } from 'next';
import HomeContainer from 'components/home/HomeContainer';

export const metadata: Metadata = {
  title: 'Home',
};

export default function Default() {
  return <HomeContainer />;
}
