import { randomInt } from "node:crypto";

// Excludes ambiguous characters (0/O, 1/I/L) since these codes may be read
// aloud or typed by hand, unlike a URL-only share slug.
const INVITE_CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateInviteCode(length = 8): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += INVITE_CODE_ALPHABET[randomInt(INVITE_CODE_ALPHABET.length)];
  }
  return code;
}
