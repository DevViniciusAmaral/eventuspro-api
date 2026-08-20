import { Auth } from "firebase-admin/auth";
import { AuthProvider } from "./auth-provider";
import { toAppError } from "../firebase/error-mapper";

export const createFirebaseAuthProvider = (auth: Auth): AuthProvider => ({
  verifyToken: async (token: string) => {
    try {
      const decoded = await auth.verifyIdToken(token);
      return { uid: decoded.uid, email: decoded.email as string };
    } catch (error) {
      throw toAppError(error);
    }
  },
});
