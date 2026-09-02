// Prints the audit-person searches (src/app/api/audit-person/route.ts)
// that aren't on the editorial roster yet, ranked by frequency — the
// prioritized backlog for who to add to famousPeopleContent.ts next.
// See supabase/migrations/0009_audit_search_log.sql and prompt.md (Tier 1.1).
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const PAGE_SIZE = 1000;
const counts = new Map();
let from = 0;

for (;;) {
  const { data, error } = await supabase
    .from('audit_search_log')
    .select('canonical_name')
    .range(from, from + PAGE_SIZE - 1);

  if (error) {
    console.error('Failed to read audit_search_log:', error.message);
    process.exit(1);
  }
  for (const row of data) {
    counts.set(row.canonical_name, (counts.get(row.canonical_name) ?? 0) + 1);
  }
  if (data.length < PAGE_SIZE) break;
  from += PAGE_SIZE;
}

const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);

if (ranked.length === 0) {
  console.log('No missing-roster searches logged yet.');
} else {
  console.log(`${ranked.length} distinct missing-roster name(s), most-searched first:\n`);
  for (const [name, count] of ranked) {
    console.log(`  ${String(count).padStart(4)}  ${name}`);
  }
}
