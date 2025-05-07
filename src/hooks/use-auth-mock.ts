"use client";
import type { UserAccountType, User } from '@/types';
import { atom, useAtom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
};

// Using jotaiWithStorage to persist mock auth state in localStorage
const authStorage = createJSONStorage<AuthState>(() => localStorage);
const authStateAtom = atomWithStorage<AuthState>('mockAuthState', initialAuthState, authStorage);

// Derived atoms
export const isAuthenticatedAtom = atom((get) => get(authStateAtom).isAuthenticated);
export const currentUserAtom = atom((get) => get(authStateAtom).user);
export const userTypeAtom = atom((get) => get(currentUserAtom)?.accountType ?? null);

export const useAuthMock = () => {
  const [authState, setAuthState] = useAtom(authStateAtom);

  const login = (name: string, accountType: UserAccountType) => {
    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      accountType,
    };
    setAuthState({ isAuthenticated: true, user: mockUser });
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, user: null });
  };

  // Example function to easily switch user types for testing
  const simulateLogin = (type: UserAccountType) => {
    if (type === 'client') {
      login('Test Client', 'client');
    } else {
      login('Test Vendor', 'vendor');
    }
  };
  
  return { ...authState, login, logout, simulateLogin };
};
