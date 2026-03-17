import CreateStreamForm from "@/components/dashboard/CreateStreamForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-6 rounded-[28px] border border-border/70 bg-card/70 p-6 shadow-[0_24px_60px_-45px_rgba(0,0,0,0.9)]">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <Badge className="w-fit border border-primary/30 bg-primary/10 text-primary">
            Control Room
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">
            Schedule, stream, and measure with confidence.
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Keep your production pipeline clean: create streams, track live
            audiences, and review recordings in one place.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Create Stream</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[620px]">
            <DialogHeader>
              <DialogTitle>Create a stream</DialogTitle>
              <DialogDescription>
                Set a title, pick the type, and add an optional image.
              </DialogDescription>
            </DialogHeader>
            <CreateStreamForm />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
