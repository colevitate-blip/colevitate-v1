import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session cookie on every request. Called from src/proxy.ts.
 *
 * Pass `initialResponse` when another middleware step (next-intl's locale routing) already
 * produced a response — its headers/status (redirect location, rewrite markers, NEXT_LOCALE
 * cookie) are preserved instead of being silently dropped by a fresh NextResponse.next().
 */
export async function updateSession(request: NextRequest, initialResponse?: NextResponse) {
  let response = initialResponse ?? NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          // A redirect has no downstream request to forward, so its headers/status are
          // left untouched. Otherwise rebuild from the mutated request (so the forwarded
          // request carries the refreshed cookies) while preserving any headers a prior
          // middleware step already set.
          const isRedirect = response.headers.has("location");
          response = isRedirect ? response : NextResponse.next({ request, headers: response.headers });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // Revalidates the session with the Supabase server (do not remove — a stale
  // local cookie check would let an expired session look signed-in).
  await supabase.auth.getUser();

  return response;
}
