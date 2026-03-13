import { SignIn } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <Card className="w-full max-w-lg border-border/60 bg-background/80 backdrop-blur">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <LogIn className="size-5 text-primary" />
          Welcome back
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sign in to manage your streams, destinations, and analytics.
        </p>
      </CardHeader>
      <CardContent>
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </CardContent>
    </Card>
  );
}
