import SHA from "sha.js";

export const BASE10 = "base10";
export const BASE16 = "base16";
export const BASE64 = "base64pad";
export const UTF8 = "utf8";

export function hashMessage(message: string): string {
  return SHA("sha256").update(Buffer.from(message)).digest("hex");
}
