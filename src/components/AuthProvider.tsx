import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signOut as fbSignOut, type User } from 'firebase/auth';
import { auth } from '@core/config/firebase';
import { subscribeToCustomerProfile, registerCustomerProfile } from '@core/services/userService';
import type { UserProfile } from '@core/types';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  initializing: boolean;
  /** Opens the sign-in modal if needed, then resolves with the ready profile. Rejects if the rider cancels. */
  requireProfile: () => Promise<UserProfile>;
  signOut: () => Promise<void>;
  modalOpen: boolean;
  closeModal: () => void;
  resolveModal: (p: UserProfile) => void;
  rejectModal: () => void;
}

const Ctx = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('AuthProvider is missing');
  return v;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const waiters = useRef<{ resolve: (p: UserProfile) => void; reject: () => void }[]>([]);

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setInitializing(false); if (!u) setProfile(null); }), []);

  useEffect(() => {
    if (!user) return undefined;
    return subscribeToCustomerProfile(user.uid, setProfile, () => setProfile(null));
  }, [user]);

  const requireProfile = useCallback((): Promise<UserProfile> => {
    if (profile) return Promise.resolve(profile);
    return new Promise<UserProfile>((resolve, reject) => {
      waiters.current.push({ resolve, reject });
      setModalOpen(true);
    });
  }, [profile]);

  const resolveModal = useCallback((p: UserProfile) => {
    setModalOpen(false);
    waiters.current.forEach((w) => w.resolve(p));
    waiters.current = [];
  }, []);

  const rejectModal = useCallback(() => {
    setModalOpen(false);
    waiters.current.forEach((w) => w.reject());
    waiters.current = [];
  }, []);

  const closeModal = useCallback(() => rejectModal(), [rejectModal]);

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
  }, []);

  return (
    <Ctx.Provider value={{ user, profile, initializing, requireProfile, signOut, modalOpen, closeModal, resolveModal, rejectModal }}>
      {children}
    </Ctx.Provider>
  );
}

/** Creates the customer's profile doc once their phone is verified but no profile exists yet. */
export async function completeSignup(name: string, email: string): Promise<void> {
  await registerCustomerProfile({ name, email });
}
