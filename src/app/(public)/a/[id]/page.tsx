import PublicAudioPlayer from "@/components/public/PublicAudioPlayer";

type AudioPlayerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AudioPlayerPage({
  params,
}: AudioPlayerPageProps) {
  const { id } = await params;
  return <PublicAudioPlayer publicId={id} />;
}
