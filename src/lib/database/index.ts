import { getFirestore } from "firebase-admin/firestore";
import { firebaseApp } from "../firebase/config";
import { createFirestoreDatabase } from "./firestore-database";
import { Database } from "./database";

const firestoreClient = getFirestore(firebaseApp);

export const database: Database = createFirestoreDatabase(firestoreClient);

export type { Database } from "./database";
