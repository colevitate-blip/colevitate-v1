import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { joinTeamByCode } from "@/app/[locale]/(personality)/teams/actions";
import { loginRedirectTarget, localizedPath } from "@/lib/i18n/serverRedirect";

export default async function JoinCirclePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect(await loginRedirectTarget(`/circle/join/${code}`));
  }

  let circleId: string;
  try {
    circleId = await joinTeamByCode(code);
  } catch {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Invalid Invite Code</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This invite code doesn&apos;t match any circle. Double-check the code and try again.
        </p>
      </div>
    );
  }

  redirect(await localizedPath(`/circle/${circleId}`));
}
