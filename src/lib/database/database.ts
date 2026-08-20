export interface Database {
  create: <T extends Record<string, any>>(
    collectionName: string,
    data: T,
  ) => Promise<{ id: string }>;

  findOne: <T>(
    collectionName: string,
    field: string,
    value: any,
  ) => Promise<(T & { id: string }) | null>;

  findMany: <T>(
    collectionName: string,
    field: string,
    value: any,
  ) => Promise<(T & { id: string })[]>;

  findById: <T>(
    collectionName: string,
    id: string,
  ) => Promise<(T & { id: string }) | null>;

  list: <T>(collectionName: string) => Promise<(T & { id: string })[]>;

  update: <T extends Record<string, any>>(
    collectionName: string,
    id: string,
    data: Partial<T>,
  ) => Promise<void>;

  delete: (collectionName: string, id: string) => Promise<void>;
}
