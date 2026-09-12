"use client";

import * as React from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "./client";
import { loadRemoteProfileMeta, type ProfileMeta } from "@/lib/personality/storage";

interface AuthContextValue {
  user: User | null;
  /** True until the initial session check resolves. */
  authLoading: boolean;
  profileMeta: ProfileMeta | null;
  /**
   * Signs out on the same browser Supabase client AuthProvider itself
   * listens to (below), so onAuthStateChange picks it up and user/profileMeta
   * clear immediately — the previous approach posted to a server action that
   * only signed out the server's own client, leaving this client's session
   * (and anything reading useAuth(), like the account row in the mobile
   * menu) stuck showing the signed-in state until a full reload.
   */
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [profileMeta, setProfileMeta] = React.useState<ProfileMeta | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);

      if (data.user) {
        loadRemoteProfileMeta(data.user.id).then((meta) => {
          setProfileMeta({
            displayName: meta?.displayName || data.user?.user_metadata?.full_name || null,
            avatarUrl: meta?.avatarUrl || data.user?.user_metadata?.avatar_url || null,
            isPublic: meta?.isPublic || false,
            shareSlug: meta?.shareSlug || null,
          });
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadRemoteProfileMeta(session.user.id).then((meta) => {
          setProfileMeta({
            displayName: meta?.displayName || session.user?.user_metadata?.full_name || null,
            avatarUrl: meta?.avatarUrl || session.user?.user_metadata?.avatar_url || null,
            isPublic: meta?.isPublic || false,
            shareSlug: meta?.shareSlug || null,
          });
        });
      } else {
        setProfileMeta(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = React.useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }, [router]);

  const value = React.useMemo(
    () => ({ user, authLoading, profileMeta, signOut }),
    [user, authLoading, profileMeta, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
