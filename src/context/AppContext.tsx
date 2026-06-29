'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  avatar?: string | null;
}

interface AppSettings {
  currency: string;
  factoryName: string;
  registrationNumber: string;
  tin: string;
  address: string;
  district: string;
  phone: string;
  email: string;
}

interface AppContextType {
  currentUser: AppUser | null;
  settings: AppSettings;
  formatCurrency: (amount: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({
  children,
  currentUser,
  settings,
}: {
  children: ReactNode;
  currentUser: AppUser | null;
  settings: AppSettings;
}) {
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: settings.currency,
      maximumFractionDigits: 0,
    }).format(amount);

    if (settings.currency === 'UGX') {
      return formatted.replace('USh', 'UGX');
    }
    return formatted;
  };

  return (
    <AppContext.Provider value={{ currentUser, settings, formatCurrency }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
