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
    regex: /\b5[1-5]\d{2}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g,
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
];
