"use client";

import * as React from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "./client";
import { loadRemoteProfileMeta, type ProfileMeta } from "@/lib/personality/storage";

interface AuthContextValue {
  user: User | null;
  /** True until the initial session check resolves. */
  authLoading: boolean;
  profileMeta: ProfileMeta | null;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [profileMeta, setProfileMeta] = React.useState<ProfileMeta | null>(null);

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

  const value = React.useMemo(
    () => ({ user, authLoading, profileMeta }),
    [user, authLoading, profileMeta]
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
