"use client";

import * as React from "react";
import { Loader2, Mail, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden {...props}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A11.998 11.998 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A11.998 11.998 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.61l4 3.11C6.22 6.87 8.87 4.76 12 4.76Z"
      />
    </svg>
  );
}

export function SignInCard() {
  const [showEmail, setShowEmail] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailSent, setEmailSent] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [emailLoading, setEmailLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEmailLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setEmailLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEmailSent(true);
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Sign in to Colevitate</CardTitle>
        <CardDescription>Save your results and pick up where you left off.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          type="button"
          size="lg"
          className="w-full gap-2"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
        >
          {googleLoading ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
          Continue with Google
        </Button>

        {error ? <p className="text-center text-xs text-destructive">{error}</p> : null}

        {!showEmail ? (
          <button
            type="button"
            onClick={() => setShowEmail(true)}
            className="text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            or continue with email
          </button>
        ) : emailSent ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border bg-muted/30 px-4 py-5 text-center">
            <MailCheck className="size-5 text-muted-foreground" />
            <p className="text-sm font-medium">Check your email</p>
            <p className="text-xs text-muted-foreground">
              We sent a sign-in link to {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-2">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Button type="submit" variant="outline" size="sm" className="gap-1.5" disabled={emailLoading}>
              {emailLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Mail className="size-3.5" />
              )}
              Send magic link
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
