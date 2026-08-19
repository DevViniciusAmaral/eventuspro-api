import { Timestamp } from "firebase-admin/firestore";
import { db } from "../../lib/firebase";
import { UserRepository } from "./models/repository";

const collection = db.collection("users");

export const userRepository: UserRepository = {
  create: async (data) => {
    const doc = await collection.add({ ...data, createdAt: Timestamp.now() });
    return { id: doc.id };
  },
  findOne: async (filter, value) => {
    const snapshot = await collection.where(filter, "==", value).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data() as any;
    const createdAt = data.createdAt.toMillis() as string;

    return { id: doc.id, ...data, createdAt };
  },
};
