/**
 * Financial sensitive data patterns.
 * IBAN, RIB, credit card numbers (Luhn validated).
 */

/**
 * Validate IBAN checksum using MOD-97 algorithm.
 * @param {string} iban
 * @returns {boolean}
 */
function validateIBAN(iban) {
  const cleaned = iban.replace(/[\s\-]/g, '').toUpperCase();
  if (cleaned.length < 15 || cleaned.length > 34) return false;
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let remainder = 0;
  for (const char of numeric) {
    remainder = (remainder * 10 + parseInt(char, 10)) % 97;
  }
  return remainder === 1;
}

/**
 * Validate credit card number using Luhn algorithm.
 * @param {string} number
 * @returns {boolean}
 */
function luhnCheck(number) {
  const digits = number.replace(/[\s\-]/g, '');
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export const financialPatterns = [
  {
    id: 'iban',
    label: 'IBAN',
    category: 'financial',
    // IBAN: 2 letters + 2 digits + up to 30 alphanumeric chars
    regex: /\b[A-Z]{2}\d{2}[\s]?(?:[A-Z0-9]{4}[\s]?){3,7}[A-Z0-9]{1,4}\b/g,
    validate: (match) => validateIBAN(match),
    placeholder: 'IBAN',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'rib',
    label: 'RIB français',
    category: 'financial',
    // French RIB: 5 (bank) + 5 (branch) + 11 (account) + 2 (key)
    regex: /\b\d{5}[\s]?\d{5}[\s]?[A-Z0-9]{11}[\s]?\d{2}\b/g,
    validate: null,
    placeholder: 'RIB',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'card_visa',
    label: 'Carte Visa',
    category: 'financial',
    regex: /\b4\d{3}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g,
    validate: (match) => luhnCheck(match),
    placeholder: 'CARD',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'card_mastercard',
    label: 'Carte Mastercard',
    category: 'financial',
    // Covers classic range 51xx-55xx and new range 2221-2720
    regex: /\b(?:5[1-5]\d{2}|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g,
    validate: (match) => luhnCheck(match),
    placeholder: 'CARD',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'card_amex',
    label: 'Carte American Express',
    category: 'financial',
    regex: /\b3[47]\d{2}[\s\-]?\d{6}[\s\-]?\d{5}\b/g,
    validate: (match) => luhnCheck(match),
    placeholder: 'CARD',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'card_discover',
    label: 'Carte Discover',
    category: 'financial',
    // Discover: starts with 6011, 65, or 644-649
    regex: /\b(?:6011|65\d{2}|64[4-9]\d)[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g,
    validate: (match) => luhnCheck(match),
    placeholder: 'CARD',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'swift_bic',
    label: 'Code SWIFT/BIC',
    category: 'financial',
    // SWIFT/BIC: 8 or 11 chars — 4 letters (bank) + 2 letters (country) + 2 alphanum (location) + optional 3 (branch)
    regex: /\b[A-Z]{6}[A-Z0-9]{2}(?:[A-Z0-9]{3})?\b/g,
    validate: (match) => {
      const cleaned = match.trim();
      if (cleaned.length !== 8 && cleaned.length !== 11) return false;
      // First 4 must be letters (bank code)
      if (!/^[A-Z]{4}/.test(cleaned)) return false;
      // Chars 5-6 must be letters (ISO country code)
      if (!/^[A-Z]{2}$/.test(cleaned.slice(4, 6))) return false;
      return true;
    },
    placeholder: 'SWIFT',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'crypto_btc',
    label: 'Adresse Bitcoin',
    category: 'financial',
    // Legacy (1...), SegWit (3...), Bech32 (bc1...)
    regex: /\b(?:[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{25,89})\b/g,
    validate: null,
    placeholder: 'CRYPTO',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'crypto_eth',
    label: 'Adresse Ethereum',
    category: 'financial',
    // Ethereum: 0x + 40 hex chars
    regex: /\b0x[0-9a-fA-F]{40}\b/g,
    validate: null,
    placeholder: 'CRYPTO',
    risk: 'high',
    enabled: true,
  },
];
