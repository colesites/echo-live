import PublicVideoPlayer from "@/components/public/PublicVideoPlayer";

type VideoPlayerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VideoPlayerPage({
  params,
}: VideoPlayerPageProps) {
  const { id } = await params;
  return <PublicVideoPlayer publicId={id} />;
}
