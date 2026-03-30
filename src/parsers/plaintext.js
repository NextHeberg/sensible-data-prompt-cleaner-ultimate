/**
 * Plain text parser (txt, md, log, etc.)
 * No transformation needed — returns the file content as-is.
 */
export async function parsePlaintext(file) {
  return await file.text();
}
