export const FALLBACK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

type ImageSource = string | { url?: string | null } | null | undefined;

/**
 * Resolve an image URL from a plain string or an object with a `url` field,
 * falling back to a transparent placeholder when nothing is available.
 */
export function getImageUrl(
  source: ImageSource,
  fallback: string = FALLBACK_IMAGE,
): string {
  if (!source) return fallback;
  if (typeof source === "string") return source || fallback;
  return source.url || fallback;
}
