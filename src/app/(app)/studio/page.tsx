import StudioHub from "@/components/studio/StudioHub";
import { requireAuth } from "@/utils/require-auth";

export default async function StudioHubPage() {
  await requireAuth();
  return <StudioHub />;
}
