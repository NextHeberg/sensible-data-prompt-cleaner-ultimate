/**
 * .env file parser.
 * Returns the raw text — the credentials pattern handles KEY=value replacement.
 */
export async function parseEnv(file) {
  return await file.text();
}
