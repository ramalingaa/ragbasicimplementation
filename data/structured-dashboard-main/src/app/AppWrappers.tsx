'use client';
import { ReactNode } from 'react';
import 'styles/global.css';
import 'styles/App.css';
import 'styles/Contact.css';
import 'styles/MiniCalendar.css';

export default function AppWrappers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
