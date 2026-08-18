import { getAuth } from "firebase-admin/auth";
import { firebaseApp } from "./config";

export const auth = getAuth(firebaseApp);
