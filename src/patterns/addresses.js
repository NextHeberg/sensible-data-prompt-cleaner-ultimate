/**
 * Address-related patterns (heuristic).
 * French postal addresses, French ZIP codes.
 * Note: These are confidence-level "possible" detections due to heuristic nature.
 */

// French cities for ZIP+city anchoring — all cities > 30k population + overseas territories
const FRENCH_CITIES = new Set([
  // Major cities (> 100k)
  'paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'montpellier',
  'strasbourg', 'bordeaux', 'lille', 'rennes', 'reims', 'toulon', 'saint-etienne',
  'le havre', 'grenoble', 'dijon', 'angers', 'villeurbanne', 'nimes',
  'clermont-ferrand', 'le mans', 'aix-en-provence', 'brest', 'tours', 'amiens',
  'limoges', 'metz', 'perpignan', 'besançon', 'orleans', 'mulhouse', 'rouen',
  'caen', 'nancy', 'argenteuil', 'montreuil', 'roubaix', 'dunkerque', 'avignon',
  'poitiers', 'versailles', 'créteil', 'pau', 'fort-de-france',
  // Cities 50k–100k
  'la rochelle', 'antibes', 'cannes', 'saint-denis', 'courbevoie', 'nanterre',
  'vitry-sur-seine', 'colombes', 'asnières-sur-seine', 'rueil-malmaison',
  'saint-paul', 'champigny-sur-marne', 'champigny', 'boulogne-billancourt',
  'levallois-perret', 'issy-les-moulineaux', 'calais', 'mérignac', 'pessac',
  'vénissieux', 'cergy', 'évry', 'melun', 'chartres', 'troyes', 'laval',
  'quimper', 'lorient', 'saint-nazaire', 'beauvais', 'valence', 'bayonne',
  'la seyne-sur-mer', 'thionville', 'annecy', 'draguignan', 'hyères',
  'fréjus', 'saint-quentin', 'évreux', 'colmar', 'bourges', 'ajaccio', 'bastia',
  'cayenne', 'saint-pierre', 'pointe-à-pitre', 'basse-terre',
  // Cities 30k–50k
  'béziers', 'saint-brieuc', 'niort', 'villeneuve-d\'ascq', 'blois', 'carcassonne',
  'auxerre', 'gap', 'mâcon', 'tarbes', 'arles', 'compiègne', 'brive-la-gaillarde',
  'dax', 'cholet', 'bourg-en-bresse', 'châteauroux', 'sète', 'albi', 'montauban',
  'angoulême', 'salon-de-provence', 'istres', 'martigues', 'agen', 'vannes',
  'saint-malo', 'alès', 'montélimar', 'vienne', 'cagnes-sur-mer', 'grasse',
  'saint-martin-d\'hères', 'échirolles', 'chalon-sur-saône', 'aubagne',
  'saint-raphaël', 'saint-laurent-du-maroni', 'mamoudzou', 'kourou',
  'le tampon', 'saint-andré', 'saint-louis', 'le port', 'saint-benoît',
  'sainte-marie', 'saint-joseph', 'saint-leu',
  'bagneux', 'clamart', 'fontenay-sous-bois', 'sartrouville', 'chatou',
  'maisons-alfort', 'ivry-sur-seine', 'épinay-sur-seine', 'saint-ouen',
  'sarcelles', 'gennevilliers', 'rosny-sous-bois', 'noisy-le-grand',
  'noisy-le-sec', 'pantin', 'bondy', 'villepinte', 'sevran', 'drancy',
  'bobigny', 'gagny', 'aulnay-sous-bois', 'aubervilliers', 'stains',
  'garges-lès-gonesse', 'goussainville', 'villiers-sur-marne', 'vincennes',
  'meaux', 'chelles', 'pontault-combault', 'savigny-le-temple', 'torcy',
  'poissy', 'conflans-sainte-honorine', 'houilles', 'montigny-le-bretonneux',
  'plaisir', 'trappes', 'les mureaux', 'mantes-la-jolie', 'rambouillet',
  'palaiseau', 'massy', 'évry-courcouronnes', 'corbeil-essonnes', 'longjumeau',
  'athis-mons', 'savigny-sur-orge', 'viry-châtillon', 'grigny', 'les ulis',
  'villeneuve-saint-georges', 'yerres', 'brunoy', 'montgeron', 'draveil',
  'saint-germain-en-laye', 'chatillon', 'sceaux', 'antony', 'montrouge',
  'malakoff', 'vanves', 'meudon', 'suresnes', 'puteaux', 'neuilly-sur-seine',
  'clichy', 'saint-cloud', 'bois-colombes', 'la garenne-colombes',
  'châtillon', 'le kremlin-bicêtre', 'gentilly', 'arcueil', 'cachan',
  'fresnes', 'l\'haÿ-les-roses', 'villejuif', 'thiais', 'orly', 'choisy-le-roi',
  'alfortville', 'charenton-le-pont', 'saint-mandé', 'nogent-sur-marne',
  'le perreux-sur-marne', 'joinville-le-pont', 'saint-maur-des-fossés',
  'sucy-en-brie', 'boissy-saint-léger', 'croissy-sur-seine',
  'sotteville-lès-rouen', 'saint-étienne-du-rouvray', 'le petit-quevilly',
  'mont-saint-aignan', 'déville-lès-rouen',
  'haguenau', 'schiltigheim', 'illkirch-graffenstaden', 'lingolsheim',
  'bischheim', 'sélestat', 'saverne',
  'tourcoing', 'wattrelos', 'marcq-en-baroeul', 'lambersart', 'armentières',
  'loos', 'halluin', 'hem', 'villeneuve-d\'ascq', 'croix',
  'saint-herblain', 'rezé', 'orvault', 'vertou', 'couëron', 'saint-sébastien-sur-loire',
  'lormont', 'cenon', 'talence', 'bègles', 'villenave-d\'ornon', 'gradignan',
  'saint-médard-en-jalles', 'le bouscat', 'bruges', 'blanquefort',
  'vaulx-en-velin', 'bron', 'saint-priest', 'caluire-et-cuire', 'oullins',
  'rillieux-la-pape', 'meyzieu', 'décines-charpieu', 'tassin-la-demi-lune',
  'saint-fons', 'givors', 'saint-genis-laval',
  'colomiers', 'tournefeuille', 'blagnac', 'muret', 'ramonville-saint-agne',
  'cugnaux', 'balma', 'l\'union', 'castanet-tolosan',
  'saint-raphaël', 'vallauris', 'mougins', 'le cannet', 'mandelieu-la-napoule',
  'valbonne', 'villeneuve-loubet', 'saint-laurent-du-var', 'carros',
  'la valette-du-var', 'six-fours-les-plages', 'la garde', 'ollioules',
  'sanary-sur-mer', 'bandol',
]);

export const addressPatterns = [
  {
    id: 'address_fr',
    label: 'Adresse française (possible)',
    category: 'address',
    // French street address: number + street type keyword + name + optional ZIP + city
    regex: /\b\d{1,4}\s*(?:bis|ter|quater)?\s*,?\s*(?:rue|avenue|av\.|boulevard|bd\.|chemin|impasse|allée|route|voie|place|square|passage|cité|villa|résidence|quartier|hameau|lieu[-\s]dit)\s+(?:de\s+la?\s+|du\s+|des\s+|de\s+|l[ea]\s+)?[A-ZÁÀÂÄÉÈÊËÎÏÔÙÛÜÇ][a-záàâäéèêëîïôùûüç\-]+(?:\s+[a-záàâäéèêëîïôùûüç][a-záàâäéèêëîïôùûüç\-]+){0,6}(?:[,\s]+(?:0[1-9]|[1-8]\d|9[0-5])\d{3}(?:[,\s]+[A-ZÁÀÂÄÉÈÊËÎÏÔÙÛÜÇ][a-záàâäéèêëîïôùûüç\s\-]{2,30})?)?/gi,
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
      // Only match known French cities — removed city.length > 4 fallback
      // which caused massive false positives (e.g. "75000 tokens")
      return FRENCH_CITIES.has(city);
    },
    placeholder: 'CP_VILLE',
    risk: 'medium',
    enabled: true,
    confidence: 'possible',
  },
];
