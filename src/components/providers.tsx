"use client";

import type React from 'react';
import { Provider as JotaiProvider } from 'jotai';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      {children}
    </JotaiProvider>
  );
}
