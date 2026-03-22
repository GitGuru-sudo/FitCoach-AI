"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";

import { apiFetch, ApiError } from "@/lib/api";
import { auth, firebaseConfigReady, googleProvider } from "@/lib/firebase";
import type { AppUser, CoachTone } from "@/types";

type SaveProfileInput = {
  username: string;
  avatar: string;
  weeklyGoal: number;
  coachTone: CoachTone;
};

type AuthContextValue = {
  firebaseUser: User | null;
  profile: AppUser | null;
  authLoading: boolean;
  profileLoading: boolean;
  firebaseReady: boolean;
  authError: string;
  signInWithGoogleProvider: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  saveProfile: (input: SaveProfileInput) => Promise<AppUser>;
  refreshProfile: () => Promise<AppUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const fetchProfile = useCallback(async (currentUser: User) => {
    const token = await currentUser.getIdToken();

    try {
      const response = await apiFetch<{ profileComplete: boolean; user: AppUser | null }>("/users/me", {
        token,
      });
      setProfile(response.user);
      return response.user;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setProfile(null);
        return null;
      }

      throw error;
    }
  }, []);

  useEffect(() => {
    if (!firebaseConfigReady || !auth) {
      setAuthLoading(false);
      setAuthError(
        "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_CONFIG to start the app.",
      );
      return;
    }

    // Process redirect result to catch any errors from the redirect flow
    getRedirectResult(auth).catch((error) => {
      setAuthError(error.message || "Failed to complete redirect login");
    });

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setFirebaseUser(nextUser);
      setAuthLoading(false);

      if (!nextUser) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);

      try {
        await fetchProfile(nextUser);
      } catch (error) {
        setAuthError(
          error instanceof Error ? error.message : "Unable to load your profile right now.",
        );
      } finally {
        setProfileLoading(false);
      }
    });

    return unsubscribe;
  }, [fetchProfile]);

  const signInWithGoogleProvider = async () => {
    if (!auth) {
      return;
    }

    setAuthError("");
    googleProvider.setCustomParameters({ prompt: "select_account" });

    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      await signInWithRedirect(auth, googleProvider as GoogleAuthProvider);
      return;
    }

    await signInWithPopup(auth, googleProvider as GoogleAuthProvider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
      return;
    }

    setAuthError("");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!auth) {
      return;
    }

    setAuthError("");
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = async () => {
    if (!auth) {
      return;
    }

    await signOut(auth);
  };

  const saveProfile = async (input: SaveProfileInput) => {
    if (!firebaseUser) {
      throw new Error("You need to sign in first");
    }

    const token = await firebaseUser.getIdToken();
    const response = await apiFetch<{ user: AppUser }>("/users/profile", {
      method: "POST",
      token,
      body: input,
    });
    setProfile(response.user);
    return response.user;
  };

  const refreshProfile = async () => {
    if (!firebaseUser) {
      setProfile(null);
      return null;
    }

    setProfileLoading(true);

    try {
      return await fetchProfile(firebaseUser);
    } finally {
      setProfileLoading(false);
    }
  };

  const value = {
    firebaseUser,
    profile,
    authLoading,
    profileLoading,
    firebaseReady: firebaseConfigReady,
    authError,
    signInWithGoogleProvider,
    signInWithEmail,
    signUpWithEmail,
    signOutUser,
    saveProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
};
