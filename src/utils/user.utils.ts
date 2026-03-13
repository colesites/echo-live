import {
  DEFAULT_CHURCH_NAME,
  EMAIL_LOCAL_PART_SEPARATOR,
} from "@/constants/user.constants";
import type { AuthUser } from "@/lib/schemas/auth-user.schema";

export function getChurchNameFromProfile(profile: AuthUser | null) {
  if (!profile) {
    return DEFAULT_CHURCH_NAME;
  }

  if (profile.fullName) {
    return profile.fullName;
  }

  if (profile.primaryEmail) {
    const [localPart] = profile.primaryEmail.split(EMAIL_LOCAL_PART_SEPARATOR);
    if (localPart) {
      return localPart;
    }
  }

  return DEFAULT_CHURCH_NAME;
}
