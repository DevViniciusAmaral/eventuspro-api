import { getAuth } from "firebase-admin/auth";
import { firebaseApp } from "../firebase/config";
import { createFirebaseAuthProvider } from "./firebase-auth-provider";

const firebaseAuthClient = getAuth(firebaseApp);

export const authProvider = createFirebaseAuthProvider(firebaseAuthClient);

export type { AuthProvider, DecodedAuthToken } from "./auth-provider";
