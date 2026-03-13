import { PUBLIC_ID_LENGTH, STREAM_KEY_LENGTH } from "./shared";

const TOKEN_ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function createToken(length: number) {
  const values = Array.from({ length }, () => {
    const index = Math.floor(Math.random() * TOKEN_ALPHABET.length);
    return TOKEN_ALPHABET[index] ?? "";
  });
  return values.join("");
}

export function buildPublicId() {
  return createToken(PUBLIC_ID_LENGTH);
}

export function buildRtmpKey() {
  return createToken(STREAM_KEY_LENGTH);
}
