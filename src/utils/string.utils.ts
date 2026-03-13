const MAX_INITIALS = 2;

export function getInitials(value?: string | null) {
  if (!value) {
    return "";
  }
  const words = value.trim().split(/\s+/);
  const initials = words
    .slice(0, MAX_INITIALS)
    .map((word) => word[0])
    .join("");
  return initials.toUpperCase();
}

export function isLocalAsset(value?: string | null) {
  if (!value) {
    return false;
  }
  return value.startsWith("/") || value.startsWith("data:");
}
