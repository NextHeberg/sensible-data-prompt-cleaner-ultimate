/**
 * YAML parser using js-yaml.
 * Returns the raw YAML text for the worker to process.
 */
import jsYaml from 'js-yaml';

export async function parseYaml(file) {
  const text = await file.text();
  try {
    jsYaml.load(text); // validate
  } catch {
    throw new Error('Fichier YAML invalide : impossible de le parser.');
  }
  return text;
}

/**
 * Post-process: re-dump cleaned YAML text.
 * Called on the cleaned output if fileFormat === 'yaml'.
 */
export function reformatYaml(cleanedText) {
  try {
    const parsed = jsYaml.load(cleanedText);
    return jsYaml.dump(parsed, { lineWidth: -1, quotingType: '"' });
  } catch {
    return cleanedText;
  }
}
