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

type EmailMode = "password" | "magiclink";
type PasswordAction = "signin" | "signup";

export function SignInCard({ next }: { next?: string }) {
  const [emailMode, setEmailMode] = React.useState<EmailMode>("password");
  const [passwordAction, setPasswordAction] = React.useState<PasswordAction>("signin");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [emailSent, setEmailSent] = React.useState(false);
  const [signupConfirmSent, setSignupConfirmSent] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);

  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [emailLoading, setEmailLoading] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const callbackUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback${
    next ? `?next=${encodeURIComponent(next)}` : ""
  }`;

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  async function handleMagicLinkSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEmailLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl,
      },
    });
    setEmailLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEmailSent(true);
  }

  async function handlePasswordAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEmailLoading(true);
    const supabase = createClient();

    if (passwordAction === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setEmailLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      window.location.href = next || "/";
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: callbackUrl },
    });
    setEmailLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      window.location.href = next || "/";
      return;
    }
    setSignupConfirmSent(true);
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email above first.");
      return;
    }
    setError(null);
    setResetLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: callbackUrl,
    });
    setResetLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setResetSent(true);
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

        <div className="relative flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-1 rounded-lg bg-muted/40 p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmailMode("password");
                setError(null);
              }}
              className={`flex-1 rounded-md px-2 py-1 font-medium transition-colors ${
                emailMode === "password"
                  ? "bg-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setEmailMode("magiclink");
                setError(null);
              }}
              className={`flex-1 rounded-md px-2 py-1 font-medium transition-colors ${
                emailMode === "magiclink"
                  ? "bg-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Magic link
            </button>
          </div>

          {emailMode === "password" ? (
            resetSent ? (
              <div className="flex flex-col items-center gap-2 rounded-lg border bg-muted/30 px-4 py-5 text-center">
                <MailCheck className="size-5 text-muted-foreground" />
                <p className="text-sm font-medium">Check your email</p>
                <p className="text-xs text-muted-foreground">
                  We sent a password reset link to {email}.
                </p>
              </div>
            ) : signupConfirmSent ? (
              <div className="flex flex-col items-center gap-2 rounded-lg border bg-muted/30 px-4 py-5 text-center">
                <MailCheck className="size-5 text-muted-foreground" />
                <p className="text-sm font-medium">Check your email</p>
                <p className="text-xs text-muted-foreground">
                  We sent a confirmation link to {email}. Confirm to finish creating your account.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordAuth} className="flex flex-col gap-2">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  autoComplete={passwordAction === "signin" ? "current-password" : "new-password"}
                />
                <Button type="submit" variant="outline" size="sm" disabled={emailLoading}>
                  {emailLoading ? <Loader2 className="size-3.5 animate-spin" /> : null}
                  {passwordAction === "signin" ? "Sign in" : "Create account"}
                </Button>
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordAction((a) => (a === "signin" ? "signup" : "signin"))
                    }
                    className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {passwordAction === "signin"
                      ? "Need an account? Sign up"
                      : "Have an account? Sign in"}
                  </button>
                  {passwordAction === "signin" ? (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={resetLoading}
                      className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Forgot password?
                    </button>
                  ) : null}
                </div>
              </form>
            )
          ) : emailSent ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-muted/30 px-4 py-5 text-center">
              <MailCheck className="size-5 text-muted-foreground" />
              <p className="text-sm font-medium">Check your email</p>
              <p className="text-xs text-muted-foreground">
                We sent a sign-in link to {email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleMagicLinkSignIn} className="flex flex-col gap-2">
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
        </div>
      </CardContent>
    </Card>
  );
}
