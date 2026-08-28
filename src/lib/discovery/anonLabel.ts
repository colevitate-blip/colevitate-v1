import { randomInt } from "node:crypto";

// Same word lists/style as settings/actions.ts's generateSlug() (adjective +
// animal), but space-separated Title Case for on-screen display rather than
// a hyphenated URL slug — this is what a browsing stranger or a pending
// request's inbox row shows in place of a real name until a connection is
// mutually accepted (see supabase/migrations/0008_anonymous_discovery.sql).
const ADJECTIVES = [
  "Clever", "Calm", "Bold", "Quiet", "Swift", "Bright", "Gentle", "Brave",
  "Curious", "Witty", "Sunny", "Cosmic", "Vivid", "Mellow", "Nimble", "Keen",
];
const ANIMALS = [
  "Otter", "Falcon", "Panda", "Fox", "Heron", "Lynx", "Chameleon", "Sparrow",
  "Badger", "Dolphin", "Raven", "Koala", "Wren", "Gecko", "Orca", "Hare",
];

export function generateAnonLabel(): string {
  const adjective = ADJECTIVES[randomInt(ADJECTIVES.length)];
  const animal = ANIMALS[randomInt(ANIMALS.length)];
  return `${adjective} ${animal}`;
}
