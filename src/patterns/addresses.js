/**
 * Address-related patterns (heuristic).
 * French postal addresses, French ZIP codes.
 * Note: These are confidence-level "possible" detections due to heuristic nature.
 */

// Top French cities for ZIP+city anchoring (partial list for common cities)
const FRENCH_CITIES = new Set([
  'paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'montpellier',
  'strasbourg', 'bordeaux', 'lille', 'rennes', 'reims', 'toulon', 'saint-etienne',
  'le havre', 'grenoble', 'dijon', 'angers', 'villeurbanne', 'nimes',
  'clermont-ferrand', 'le mans', 'aix-en-provence', 'brest', 'tours', 'amiens',
  'limoges', 'metz', 'perpignan', 'besançon', 'orleans', 'mulhouse', 'rouen',
  'caen', 'nancy', 'argenteuil', 'montreuil', 'roubaix', 'dunkerque', 'avignon',
  'poitiers', 'versailles', 'créteil', 'pau', 'fort-de-france', 'la rochelle',
  'antibes', 'cannes', 'saint-denis', 'courbevoie', 'nanterre', 'vitry-sur-seine',
  'colombes', 'asnières-sur-seine', 'rueil-malmaison', 'saint-paul', 'champigny',
  'boulogne-billancourt', 'levallois-perret', 'issy-les-moulineaux', 'calais',
  'mérignac', 'pessac', 'vénissieux', 'cergy', 'évry', 'melun', 'chartres',
  'troyes', 'laval', 'quimper', 'lorient', 'saint-nazaire', 'beauvais', 'valence',
  'bayonne', 'la seyne-sur-mer', 'thionville', 'annecy', 'draguignan', 'hyères',
  'fréjus', 'saint-quentin', 'évreux', 'colmar', 'bourges', 'ajaccio', 'bastia',
  'cayenne', 'saint-pierre', 'pointe-à-pitre', 'basse-terre',
]);

export const addressPatterns = [
  {
    id: 'address_fr',
    label: 'Adresse française (possible)',
    category: 'address',
    // French street address: number + street type keyword + name
    regex: /\b\d{1,4}\s*(?:bis|ter|quater)?\s*,?\s*(?:rue|avenue|av\.|boulevard|bd\.|chemin|impasse|allée|route|voie|place|square|passage|cité|villa|résidence|quartier|hameau|lieu[-\s]dit)\s+(?:de\s+la?\s+|du\s+|des\s+|de\s+|l[ea]\s+)?[A-ZÁÀÂÄÉÈÊËÎÏÔÙÛÜÇ][a-záàâäéèêëîïôùûüç\s\-]{2,50}/gi,
    validate: null,
    placeholder: 'ADRESSE',
    risk: 'medium',
    enabled: true,
    confidence: 'possible',
  },
  {
    id: 'zip_fr',
    label: 'Code postal français',
    category: 'address',
    // French ZIP codes: 5 digits, starting with 01-95 or 97 (overseas)
    regex: /\b(?:0[1-9]|[1-8]\d|9[0-5])\d{3}\b|\b97[1-6]\d{2}\b/g,
    validate: null,
    placeholder: 'CP',
    risk: 'low',
    enabled: false, // off by default — too many false positives (any 5-digit number)
  },
  {
    id: 'zip_city_fr',
    label: 'CP + Ville française',
    category: 'address',
    // ZIP followed by a known French city name (case-insensitive)
    regex: /\b(?:0[1-9]|[1-8]\d|9[0-5])\d{3}[\s,\-]+([A-ZÁÀÂÄÉÈÊËÎÏÔÙÛÜÇ][a-záàâäéèêëîïôùûüç\s\-]{2,30})\b/g,
    validate: (match) => {
      const parts = match.trim().split(/[\s,\-]+/);
      const city = parts.slice(1).join(' ').toLowerCase();
      return FRENCH_CITIES.has(city) || city.length > 4;
    },
    placeholder: 'CP_VILLE',
    risk: 'medium',
    enabled: true,
    confidence: 'possible',
  },
];
