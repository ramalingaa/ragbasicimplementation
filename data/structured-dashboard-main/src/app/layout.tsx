import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body id={'root'}>
        <UserProvider>
          <AppWrappers>{children}</AppWrappers>
        </UserProvider>
      </body>
    </html>
  );
}
