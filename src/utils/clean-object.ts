export const cleanObject = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map(cleanObject) as T;
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, value]) => value !== null && value !== undefined)
        .map(([key, value]) => [key, cleanObject(value)]),
    ) as T;
  }

  return value;
};
