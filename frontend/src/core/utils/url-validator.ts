export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  if (url.startsWith('data:image/')) {
    return true;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}