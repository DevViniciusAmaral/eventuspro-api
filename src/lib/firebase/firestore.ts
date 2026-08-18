import { getFirestore } from "firebase-admin/firestore";
import { firebaseApp } from "./config";

export const db = getFirestore(firebaseApp);
