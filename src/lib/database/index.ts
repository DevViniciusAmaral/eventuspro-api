import { getFirestore } from "firebase-admin/firestore";
import { firebaseApp } from "../firebase/config";
import { createFirestoreDatabase } from "./firestore-database";
import { Database } from "./database";

export const firestore = getFirestore(firebaseApp);

export const database: Database = createFirestoreDatabase(firestore);

export type { Database } from "./database";
