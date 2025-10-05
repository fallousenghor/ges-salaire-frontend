export function getLogoUrl(logo?: string | null): string | null {
  const API_URL = import.meta.env.VITE_API_URL ?? '';
  if (!logo) return null;
  const trimmed = logo.trim();
  // If it's already a full URL
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // If it already starts with a leading slash (server path)
  if (trimmed.startsWith('/')) return `${API_URL}${trimmed}`;
  // Otherwise assume it's a filename stored in uploads/logos
  return `${API_URL}/uploads/logos/${trimmed}`;
}
