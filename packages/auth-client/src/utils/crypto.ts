import SHA from "sha.js";
import { fromString, toString } from "uint8arrays";

export const BASE10 = "base10";
export const BASE16 = "base16";
export const BASE64 = "base64pad";
export const UTF8 = "utf8";

export function hashMessage(message: string): string {
  const result = SHA("sha256").update(fromString(message, UTF8)).digest();
  return toString(result, BASE16);
}
