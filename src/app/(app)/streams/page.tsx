import { Radio } from "lucide-react";

import StreamsClient from "@/components/streams/StreamsClient";

export default function StreamsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-primary">
        <Radio className="size-5" />
        <p className="text-sm font-semibold uppercase tracking-wide">Streams</p>
      </div>
      <StreamsClient />
    </div>
  );
}
