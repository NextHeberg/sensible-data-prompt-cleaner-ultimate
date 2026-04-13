/**
 * Network-related sensitive data patterns.
 * IPv4, IPv6, URLs with embedded credentials, database connection strings.
 */
export const networkPatterns = [
  {
    id: 'ipv4',
    label: 'IPv4 Address',
    category: 'network',
    // Matches valid IPv4 addresses (0-255 per octet)
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
    validate: null,
    placeholder: 'IP',
    risk: 'medium',
    enabled: true,
  },
  {
    id: 'ipv6',
    label: 'IPv6 Address',
    category: 'network',
    // Matches full and compressed IPv6 addresses
    regex: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b|\b(?:[0-9a-fA-F]{1,4}:){1,7}:\b|\b:(?::[0-9a-fA-F]{1,4}){1,7}\b|\b(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}\b|\b(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}\b|\b(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}\b|\b(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}\b|\b(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}\b|\b[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}\b|\b::(?:[fF]{4}(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\b/g,
    validate: null,
    placeholder: 'IPV6',
    risk: 'medium',
    enabled: true,
  },
  {
    id: 'url_credentials',
    label: 'URL avec identifiants',
    category: 'network',
    // Matches URLs with user:pass@host
    regex: /[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^:@\s/]+:[^@\s/]+@[^\s"'<>]+/g,
    validate: null,
    placeholder: 'URL_CREDS',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'db_connection',
    label: 'Chaîne de connexion DB',
    category: 'network',
    // Matches database connection strings (postgres, mysql, mongodb, redis, amqp, etc.)
    regex: /(?:postgresql?|mysql2?|mongodb(?:\+srv)?|redis|amqps?|mssql|sqlite):\/\/[^\s"'<>\n]+/g,
    validate: null,
    placeholder: 'DB_URL',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'mac_address',
    label: 'Adresse MAC',
    category: 'network',
    // MAC addresses: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
    regex: /\b(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\b/g,
    validate: null,
    placeholder: 'MAC',
    risk: 'medium',
    enabled: true,
  },
  {
    id: 'api_key_in_url',
    label: 'Clé API dans URL',
    category: 'network',
    // API keys/tokens passed as URL query parameters
    regex: /[?&](?:api[_-]?key|apikey|access[_-]?token|auth[_-]?token|token|key|secret)=([A-Za-z0-9_\-+/.]{8,128})/gi,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
    replaceGroup: 1,
  },
];
