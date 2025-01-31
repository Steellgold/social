export const generateId = (size: number = 12): string => {
  const chars = "0123456789";
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  
  let id = "";
  for (let i = 0; i < size; i++) {
    id += chars[bytes[i] % chars.length];
  }
  
  return id;
};