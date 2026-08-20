import { Firestore, Timestamp } from "firebase-admin/firestore";
import { Database } from "./database";
import { toAppError } from "../firebase/error-mapper";

const parseTimestamps = (data: Record<string, any>) => {
  const parsed = { ...data };
  if (parsed.createdAt instanceof Timestamp) {
    parsed.createdAt = parsed.createdAt.toDate();
  }
  if (parsed.updatedAt instanceof Timestamp) {
    parsed.updatedAt = parsed.updatedAt.toDate();
  }
  return parsed;
};

const wrap = async <T>(operation: () => Promise<T>) => {
  try {
    return await operation();
  } catch (error) {
    throw toAppError(error);
  }
};

export const createFirestoreDatabase = (firestore: Firestore): Database => ({
  create: (collectionName, data) =>
    wrap(async () => {
      const doc = await firestore
        .collection(collectionName)
        .add({ ...data, createdAt: Timestamp.now() });
      return { id: doc.id };
    }),

  findOne: (collectionName, field, value) =>
    wrap(async () => {
      const snapshot = await firestore
        .collection(collectionName)
        .where(field, "==", value)
        .get();
      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      return { id: doc.id, ...parseTimestamps(doc.data()) } as any;
    }),

  findMany: (collectionName, field, value) =>
    wrap(async () => {
      const snapshot = await firestore
        .collection(collectionName)
        .where(field, "==", value)
        .get();
      if (snapshot.empty) return [];

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...parseTimestamps(doc.data()),
      })) as any;
    }),

  findById: (collectionName, id) =>
    wrap(async () => {
      const snapshot = await firestore.collection(collectionName).doc(id).get();
      if (!snapshot.exists) return null;

      return {
        id: snapshot.id,
        ...parseTimestamps(snapshot.data() ?? {}),
      } as any;
    }),

  list: (collectionName) =>
    wrap(async () => {
      const snapshot = await firestore.collection(collectionName).get();
      if (snapshot.empty) return [];

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...parseTimestamps(doc.data()),
      })) as any;
    }),

  update: (collectionName, id, data) =>
    wrap(async () => {
      await firestore
        .collection(collectionName)
        .doc(id)
        .update({ ...data, updatedAt: Timestamp.now() });
    }),

  delete: (collectionName, id) =>
    wrap(async () => {
      await firestore.collection(collectionName).doc(id).delete();
    }),
});
