const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const cleanValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanValue(item))
      .filter((item) => item !== null && item !== undefined);
  }

  if (isPlainObject(value)) {
    return cleanObject(value);
  }

  return value;
};

export const cleanObject = <T>(obj: Record<string, unknown>): T => {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const cleaned = cleanValue(value);

    if (cleaned !== null && cleaned !== undefined) {
      result[key] = cleaned;
    }
  }

  return result as T;
};
