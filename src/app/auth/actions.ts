"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { localizedPath } from "@/lib/i18n/serverRedirect";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(await localizedPath("/"));
}
