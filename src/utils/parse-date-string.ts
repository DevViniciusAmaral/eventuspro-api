export const parseDateString = <T>(obj: any) => {
  const formatted = { ...obj };
  if (obj.createdAt) formatted.createdAt = obj.createdAt.toDate();
  if (obj.updatedAt) formatted.updatedAt = obj.updatedAt.toDate();
  return formatted;
};
