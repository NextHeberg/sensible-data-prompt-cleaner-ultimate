/**
 * Identity-related sensitive data patterns.
 * Email addresses, phone numbers (FR + international), French INSEE/SSN.
 */
export const identityPatterns = [
  {
    id: 'email',
    label: 'Adresse e-mail',
    category: 'identity',
    regex: /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/g,
    validate: null,
    placeholder: 'EMAIL',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'phone_fr',
    label: 'Téléphone français',
    category: 'identity',
    // French mobile and landline: 0X XX XX XX XX or +33 X XX XX XX XX
    regex: /(?:(?:\+|00)33[\s.\-]?|0)[1-9](?:[\s.\-]?\d{2}){4}/g,
    validate: null,
    placeholder: 'PHONE',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'phone_intl',
    label: 'Téléphone international',
    category: 'identity',
    // International E.164 format: +XX... (6 to 14 digits)
    // Lookbehind/lookahead prevent matching inside longer strings
    regex: /(?<![A-Za-z0-9])\+(?:[0-9][\s.\-]?){6,14}[0-9](?![0-9])/g,
    validate: null,
    placeholder: 'PHONE',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'insee',
    label: 'Numéro INSEE / Sécu',
    category: 'identity',
    // French social security number: 1 or 2, then YY MM (dept)(3)(3)(2) key
    regex: /\b[12]\s?\d{2}\s?(?:0[1-9]|1[0-2])\s?(?:0[1-9]|[1-9]\d|2[AB])\s?\d{3}\s?\d{3}\s?\d{2}\b/g,
    validate: null,
    placeholder: 'INSEE',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'name_fr',
    label: 'Prénom/Nom (expérimental)',
    category: 'identity',
    // Heuristic: two capitalized words side by side not at sentence start
    // This will have false positives — disabled by default
    regex: /(?<![.!?]\s)(?<![.!?]\n)\b([A-ZÁÀÂÄÉÈÊËÎÏÔÙÛÜÇ][a-záàâäéèêëîïôùûüç\-]{1,20})\s([A-ZÁÀÂÄÉÈÊËÎÏÔÙÛÜÇ][A-ZÁÀÂÄÉÈÊËÎÏÔÙÛÜÇa-záàâäéèêëîïôùûüç\-]{1,25})\b/g,
    validate: null,
    placeholder: 'NOM',
    risk: 'low',
    enabled: false,
    experimental: true,
  },
];
