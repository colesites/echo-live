import { SignIn } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="w-full max-w-lg">
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <LogIn className="size-5 text-primary" />
          Welcome back
        </div>
        <p className="text-sm text-muted-foreground">
          Sign in to manage your streams, destinations, and analytics.
        </p>
      </div>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
