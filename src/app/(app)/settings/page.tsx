import SettingsClient from "@/components/settings/SettingsClient";
import { requireAuth } from "@/utils/require-auth";

type SettingsPageProps = {
  searchParams: Promise<{ streamId?: string }>;
};

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const { streamId } = await searchParams;
  await requireAuth();
  return <SettingsClient defaultStreamId={streamId} />;
}
