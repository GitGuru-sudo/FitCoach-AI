import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const rawConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

const parseFirebaseConfig = () => {
  if (!rawConfig) {
    return null;
  }

  try {
    return JSON.parse(rawConfig);
  } catch {
    return null;
  }
};

const firebaseConfig = parseFirebaseConfig();

export const firebaseApp: FirebaseApp | null = firebaseConfig
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : null;

export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const googleProvider = new GoogleAuthProvider();
export const firebaseConfigReady = Boolean(firebaseConfig);
