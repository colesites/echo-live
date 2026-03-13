import { SignUp } from "@clerk/nextjs";
import { UserPlus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-lg border-border/60 bg-background/80 backdrop-blur">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <UserPlus className="size-5 text-primary" />
          Create your account
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Set up your church workspace in minutes.
        </p>
      </CardHeader>
      <CardContent>
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
      </CardContent>
    </Card>
  );
}
