/**
 * Credential and secret patterns.
 * Passwords in JSON/YAML/ENV, JWT tokens, API keys, PEM private keys.
 */

// Shared sensitive key name alternation used by json_secret, yaml_secret, env_secret.
// Kept in sync across all three patterns.
const SENSITIVE_KEY_NAMES = [
  'password', 'passwd', 'pwd',
  'secret', 'token', 'credentials', 'bearer', 'authorization',
  'api[_-]?key', 'api[_-]?secret',
  'private[_-]?key', 'access[_-]?key', 'auth[_-]?key',
  'client[_-]?secret', 'app[_-]?secret',
  'db[_-]?pass(?:word)?', 'encryption[_-]?key',
  'signing[_-]?(?:key|secret)', 'webhook[_-]?secret',
  'master[_-]?key', 'root[_-]?pass(?:word)?', 'admin[_-]?pass(?:word)?',
  'connection[_-]?string', 'conn[_-]?str',
  'database[_-]?url', 'db[_-]?url', 'redis[_-]?url',
  'aws[_-]?secret[_-]?access[_-]?key', 'aws[_-]?session[_-]?token',
  'ssh[_-]?(?:key|private[_-]?key)',
  'stripe[_-]?(?:key|secret)', 'sendgrid[_-]?(?:api[_-]?)?key',
  'mailgun[_-]?(?:api[_-]?)?key',
  'openai[_-]?(?:api[_-]?)?key', 'anthropic[_-]?(?:api[_-]?)?key',
  'slack[_-]?(?:token|webhook)',
].join('|');

// Upper-case version for ENV variable names (underscores only, no hyphens)
const SENSITIVE_ENV_NAMES = [
  'PASSWORD', 'PASSWD', 'SECRET', 'TOKEN', 'CREDENTIALS', 'BEARER', 'AUTHORIZATION',
  'API_?KEY', 'API_?SECRET',
  'PRIVATE_?KEY', 'ACCESS_?KEY', 'AUTH_?KEY',
  'CLIENT_?SECRET', 'APP_?SECRET',
  'DB_?PASS(?:WORD)?', 'ENCRYPTION_?KEY',
  'SIGNING_?(?:KEY|SECRET)', 'WEBHOOK_?SECRET',
  'MASTER_?KEY', 'ROOT_?PASS(?:WORD)?', 'ADMIN_?PASS(?:WORD)?',
  'CONNECTION_?STRING', 'CONN_?STR',
  'DATABASE_?URL', 'DB_?URL', 'REDIS_?URL',
  'AWS_?SECRET_?ACCESS_?KEY', 'AWS_?SESSION_?TOKEN',
  'SSH_?(?:KEY|PRIVATE_?KEY)',
  'STRIPE_?(?:KEY|SECRET)', 'SENDGRID_?(?:API_?)?KEY',
  'MAILGUN_?(?:API_?)?KEY',
  'OPENAI_?(?:API_?)?KEY', 'ANTHROPIC_?(?:API_?)?KEY',
  'SLACK_?(?:TOKEN|WEBHOOK)',
].join('|');

export const credentialPatterns = [
  {
    id: 'json_secret',
    label: 'Secret JSON (password/token/key)',
    category: 'credentials',
    // Matches JSON key-value pairs with sensitive key names
    regex: new RegExp(`"(?:${SENSITIVE_KEY_NAMES})"\\s*:\\s*"([^"]{1,500})"`, 'gi'),
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
    regex: new RegExp(`^(\\s*(?:${SENSITIVE_KEY_NAMES})\\s*:\\s*)(['"]?)([^\\s'"#\\n]{3,200})\\2(\\s*(?:#.*)?)$`, 'gim'),
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
    regex: new RegExp(`^([A-Z_]*(?:${SENSITIVE_ENV_NAMES})[A-Z_]*\\s*=\\s*)(['"]?)([^\\s'"#\\n]{1,500})\\2`, 'gim'),
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
    multiline: true, // spans multiple lines — must run against full text, not chunks
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
  // ────────────────────────────────────────────────────────────
  // Provider-specific API tokens
  // ────────────────────────────────────────────────────────────
  {
    id: 'slack_token',
    label: 'Slack Token',
    category: 'credentials',
    // Slack bot/user/app tokens: xoxb-, xoxp-, xoxs-, xoxa-
    regex: /\bxox[bpsa]-[0-9a-zA-Z\-]{10,250}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'stripe_key',
    label: 'Stripe Secret Key',
    category: 'credentials',
    // Stripe secret/restricted keys: sk_live_*, sk_test_*, rk_live_*, rk_test_*
    regex: /\b[sr]k_(?:live|test)_[0-9a-zA-Z]{24,99}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'stripe_publishable_key',
    label: 'Stripe Publishable Key',
    category: 'credentials',
    // Stripe publishable keys: pk_live_*, pk_test_*
    regex: /\bpk_(?:live|test)_[0-9a-zA-Z]{24,99}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'medium',
    enabled: true,
  },
  {
    id: 'sendgrid_key',
    label: 'SendGrid API Key',
    category: 'credentials',
    // SendGrid keys: SG.<22chars>.<43chars>
    regex: /\bSG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'google_api_key',
    label: 'Google API Key',
    category: 'credentials',
    // Google API keys: AIza + 35 chars
    regex: /\bAIza[0-9A-Za-z_-]{35}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'gitlab_token',
    label: 'GitLab Token',
    category: 'credentials',
    // GitLab personal access tokens: glpat-*
    regex: /\bglpat-[0-9a-zA-Z_-]{20,}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'npm_token',
    label: 'npm Token',
    category: 'credentials',
    regex: /\bnpm_[A-Za-z0-9]{36,}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'pypi_token',
    label: 'PyPI Token',
    category: 'credentials',
    regex: /\bpypi-AgEIcHlwaS5vcmc[A-Za-z0-9_-]{50,}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'hashicorp_vault_token',
    label: 'HashiCorp Vault Token',
    category: 'credentials',
    regex: /\bhvs\.[a-zA-Z0-9_-]{24,}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'openai_api_key',
    label: 'OpenAI API Key',
    category: 'credentials',
    // OpenAI keys: sk-* or sk-proj-*
    regex: /\bsk-(?:proj-)?[A-Za-z0-9]{20,}(?:T3BlbkFJ[A-Za-z0-9]{20,})?\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'anthropic_api_key',
    label: 'Anthropic API Key',
    category: 'credentials',
    // Anthropic keys: sk-ant-*
    regex: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'vercel_token',
    label: 'Vercel Token',
    category: 'credentials',
    regex: /\bvercel_[A-Za-z0-9]{24,}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'supabase_key',
    label: 'Supabase PAT',
    category: 'credentials',
    // Supabase personal access tokens: sbp_<40 hex chars>
    regex: /\bsbp_[a-f0-9]{40}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'mailgun_key',
    label: 'Mailgun API Key',
    category: 'credentials',
    // Mailgun keys: key-<32 hex chars>
    regex: /\bkey-[0-9a-f]{32}\b/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
  {
    id: 'azure_connection_string',
    label: 'Azure Connection String',
    category: 'credentials',
    regex: /\bDefaultEndpointsProtocol=https?;AccountName=[^;]+;AccountKey=[A-Za-z0-9+/=]{44,};EndpointSuffix=[^\s"'<>\n]+/g,
    validate: null,
    placeholder: 'SECRET',
    risk: 'high',
    enabled: true,
  },
];
