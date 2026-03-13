import SettingsClient from "@/components/settings/SettingsClient";

type SettingsPageProps = {
  searchParams: Promise<{ streamId?: string }>;
};

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const { streamId } = await searchParams;
  return <SettingsClient defaultStreamId={streamId} />;
}
