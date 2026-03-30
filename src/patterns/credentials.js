/**
 * Credential and secret patterns.
 * Passwords in JSON/YAML/ENV, JWT tokens, API keys, PEM private keys.
 */
export const credentialPatterns = [
  {
    id: 'json_secret',
    label: 'Secret JSON (password/token/key)',
    category: 'credentials',
    // Matches JSON key-value pairs with sensitive key names
    regex: /"(?:password|passwd|pwd|secret|token|api[_-]?key|private[_-]?key|access[_-]?key|auth[_-]?key|client[_-]?secret|app[_-]?secret|db[_-]?pass(?:word)?|encryption[_-]?key)"\s*:\s*"([^"]{1,500})"/gi,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
    // Only the captured value should be replaced, not the key
    replaceGroup: 1,
  },
  {
    id: 'yaml_secret',
    label: 'Secret YAML (password/token/key)',
    category: 'credentials',
    // Matches YAML key: value with sensitive key names
    regex: /^(\s*(?:password|passwd|pwd|secret|token|api[_-]?key|private[_-]?key|access[_-]?key|auth[_-]?key|client[_-]?secret|app[_-]?secret|db[_-]?pass(?:word)?|encryption[_-]?key)\s*:\s*)(['"]?)([^\s'"#\n]{3,200})\2(\s*(?:#.*)?)$/gim,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
    replaceGroup: 3,
  },
  {
    id: 'env_secret',
    label: 'Variable ENV sensible',
    category: 'credentials',
    // Matches ENV variables with sensitive names: KEY=value or KEY="value"
    regex: /^([A-Z_]*(?:PASSWORD|PASSWD|SECRET|TOKEN|API_?KEY|PRIVATE_?KEY|ACCESS_?KEY|AUTH_?KEY|CLIENT_?SECRET|APP_?SECRET|DB_?PASS(?:WORD)?|ENCRYPTION_?KEY)[A-Z_]*\s*=\s*)(['"]?)([^\s'"#\n]{1,500})\2/gim,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
    replaceGroup: 3,
  },
  {
    id: 'jwt',
    label: 'JWT Token',
    category: 'credentials',
    // JWT: three base64url segments separated by dots
    regex: /\beyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
    validate: null,
    placeholder: 'JWT',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'aws_key',
    label: 'Clé AWS',
    category: 'credentials',
    // AWS access key IDs
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
    validate: null,
    placeholder: 'AWS_KEY',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'github_token',
    label: 'Token GitHub',
    category: 'credentials',
    // GitHub personal access tokens (classic and fine-grained)
    regex: /\bgh[pousr]_[A-Za-z0-9]{36,255}\b|\bgithub_pat_[A-Za-z0-9_]{82}\b/g,
    validate: null,
    placeholder: 'GH_TOKEN',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'pem_key',
    label: 'Clé privée PEM',
    category: 'credentials',
    // RSA, EC, OPENSSH private keys
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----[\s\S]+?-----END (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/g,
    validate: null,
    placeholder: 'PRIVATE_KEY',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'bearer_token',
    label: 'Bearer Token',
    category: 'credentials',
    // Bearer tokens in HTTP headers / curl commands
    regex: /\bBearer\s+([A-Za-z0-9\-._~+/]{20,500}=*)\b/g,
    validate: null,
    placeholder: 'BEARER',
    risk: 'high',
    enabled: true,
    replaceGroup: 1,
  },
];
