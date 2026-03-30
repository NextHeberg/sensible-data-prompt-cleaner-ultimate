/**
 * Central pattern registry.
 * All pattern files are imported here and exported as a flat array.
 */
import { networkPatterns } from './network.js';
import { identityPatterns } from './identity.js';
import { financialPatterns } from './financial.js';
import { credentialPatterns } from './credentials.js';
import { addressPatterns } from './addresses.js';

export const PATTERNS = [
  ...credentialPatterns,  // credentials first (highest risk, more specific)
  ...identityPatterns,
  ...financialPatterns,
  ...networkPatterns,
  ...addressPatterns,
];

export const CATEGORIES = {
  credentials: {
    label: 'Identifiants & Secrets',
    icon: 'key',
    color: 'red',
  },
  identity: {
    label: 'Identité personnelle',
    icon: 'user',
    color: 'orange',
  },
  financial: {
    label: 'Données financières',
    icon: 'credit-card',
    color: 'yellow',
  },
  network: {
    label: 'Réseau & Infrastructure',
    icon: 'globe',
    color: 'blue',
  },
  address: {
    label: 'Adresses & Localisation',
    icon: 'map-pin',
    color: 'purple',
  },
};

export { networkPatterns, identityPatterns, financialPatterns, credentialPatterns, addressPatterns };
