# Sensible Data Prompt Cleaner

> A privacy-first web tool that detects and removes sensitive information from text **before** it is sent to public AI services (ChatGPT, Claude, Gemini, Mistral, etc.).

All processing happens **entirely in your browser** — no data ever leaves your machine.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Detected Data Types](#detected-data-types)
- [Replacement Modes](#replacement-modes)
- [Supported File Formats](#supported-file-formats)
- [Getting Started](#getting-started)
  - [GitHub Container Registry (recommended)](#github-container-registry-recommended)
  - [Local Development](#local-development)
  - [Production Build](#production-build)
  - [Build your own Docker image](#build-your-own-docker-image)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Internationalization](#internationalization)
- [API](#api)
- [Security](#security)

---

## Overview

When you paste a prompt into a public AI assistant, you risk leaking confidential data: API keys, passwords, email addresses, credit card numbers, internal IP addresses, and more.

**Sensible Data Prompt Cleaner** solves this problem by scanning your text in real time and replacing every detected sensitive value with a safe placeholder — before you copy-paste anything into ChatGPT or any other service.

The tool runs fully client-side using a Web Worker, so your text never travels over the network.

---

## Features

- **Real-time detection** — patterns are matched as you type, with a 300 ms debounce
- **25+ built-in regex patterns** across 5 risk categories
- **Three replacement modes** — labeled, redact, anonymize
- **Exclusion system** — mark false positives with one click to skip them
- **Category & per-pattern toggles** — enable/disable any pattern group or individual pattern
- **Multi-format file import** — drag-and-drop or file picker for 14 file types
- **Format-aware output** — JSON/YAML are re-serialized after cleaning
- **Bilingual interface** — English and French, toggle at any time
- **Dark / light theme**
- **Containerized** — production-ready Docker image served by Express

---

## Detected Data Types

| Category | Patterns |
|---|---|
| **Credentials** | Passwords in JSON/YAML/ENV, JWT tokens, AWS access keys, GitHub tokens, PEM private keys, Bearer tokens |
| **Identity** | Email addresses, French phone numbers, international phone numbers, French INSEE numbers |
| **Financial** | IBAN (with MOD-97 validation), RIB, Visa cards, Mastercard cards, American Express cards (with Luhn validation) |
| **Network** | IPv4, IPv6, URLs with embedded credentials, database connection strings |
| **Addresses** | French street addresses, French postal codes, ZIP + city combinations |

> By default, `name_fr` (French names) and `zip_fr` (standalone postal codes) are disabled to reduce false positives.

---

## Replacement Modes

| Mode | Example output | Description |
|---|---|---|
| `labeled` | `[EMAIL_1]`, `[AWS_KEY_1]` | Sequential placeholders that show the type of redacted data |
| `redact` | `████` | Full black-block redaction, no type information |
| `anonymize` | Fake generated value | Replaces sensitive data with realistic but fictional data |

---

## Supported File Formats

| Format | Extensions |
|---|---|
| Plain text | `.txt`, `.md`, `.log`, `.conf`, `.ini`, `.toml`, `.sh`, `.bash`, `.zsh` |
| JSON | `.json` |
| YAML | `.yaml`, `.yml` |
| CSV | `.csv` |
| Environment file | `.env` |
| XML | `.xml` |

---

## Getting Started

### GitHub Container Registry (recommended)

A Docker image is built and published automatically on every push to `main` via GitHub Actions.

**Requirements:** Docker

```bash
# Pull the latest image
docker pull ghcr.io/nextheberg/sensible-data-prompt-cleaner-ultimate:main

# Run it
docker run -p 3000:3000 ghcr.io/nextheberg/sensible-data-prompt-cleaner-ultimate:main
```

The application is then available at `http://localhost:3000`.

You can also use Docker Compose by updating the image reference in `docker-compose.yml`:

```yaml
image: ghcr.io/nextheberg/sensible-data-prompt-cleaner-ultimate:main
```

Available tags:

| Tag | Description |
|---|---|
| `main` | Latest build from the main branch |
| `sha-<short>` | Pinned to a specific commit |
| `x.y.z` / `x.y` | Pinned to a release version |

---

### Local Development

**Requirements:** Node.js 22+

```bash
# Clone the repository
git clone https://github.com/nextheberg/sensible-data-prompt-cleaner-ultimate.git
cd sensible-data-prompt-cleaner-ultimate

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The application is then available at `http://localhost:5173`.

---

### Production Build

```bash
# Build optimized static assets
npm run build

# Start the Express server
npm start
```

The server listens on port `3000` by default (`http://localhost:3000`).

---

### Build your own Docker image

**Requirements:** Docker and Docker Compose

```bash
# Build and start the container
docker-compose up
```

The application is then available at `http://localhost:3000`.

Alternatively, build and run manually:

```bash
docker build -t prompt-cleaner .
docker run -p 3000:3000 prompt-cleaner
```

The container uses a multi-stage build (Node 22 Alpine) and includes a health check on `GET /api/health`.

---

## Project Structure

```
sensible-data-prompt-cleaner-ultimate/
├── src/
│   ├── main.jsx                    # Application entry point
│   ├── App.jsx                     # Root layout and reactive pipeline
│   ├── index.css                   # Tailwind CSS and custom styles
│   │
│   ├── store/
│   │   └── appStore.js             # Global SolidJS reactive store
│   │
│   ├── patterns/                   # Regex-based detection rules
│   │   ├── index.js                # Pattern registry and category definitions
│   │   ├── credentials.js          # 8 credential patterns
│   │   ├── identity.js             # 5 identity patterns
│   │   ├── financial.js            # 5 financial patterns
│   │   ├── network.js              # 4 network patterns
│   │   └── addresses.js            # 3 address patterns
│   │
│   ├── workers/
│   │   └── cleaner.worker.js       # Off-main-thread pattern matching engine
│   │
│   ├── parsers/                    # File format handlers
│   │   ├── index.js                # Format detection and routing
│   │   ├── plaintext.js
│   │   ├── jsonParser.js
│   │   ├── yamlParser.js
│   │   ├── csvParser.js
│   │   ├── envParser.js
│   │   └── xmlParser.js
│   │
│   ├── hooks/
│   │   ├── useDebounce.js          # Debounce hook for SolidJS signals
│   │   ├── useWorker.js            # Worker lifecycle and messaging
│   │   └── useFileImport.js        # File import and format detection
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.jsx          # Logo, replacement style picker, lang/theme toggles
│   │   ├── editor/
│   │   │   ├── InputPanel.jsx      # Left panel — text input, file import, drag/drop
│   │   │   ├── OutputPanel.jsx     # Right panel — cleaned output, copy/export
│   │   │   └── DropZone.jsx        # Drag-and-drop wrapper
│   │   ├── detection/
│   │   │   ├── DetectionSidebar.jsx  # Sidebar with all detections grouped by category
│   │   │   ├── CategoryCard.jsx      # Expandable category with toggles
│   │   │   └── FoundValueItem.jsx    # Single detection with exclude/include toggle
│   │   ├── controls/
│   │   │   ├── ReplacementStylePicker.jsx
│   │   │   └── CopyButton.jsx
│   │   └── ui/
│   │       ├── Badge.jsx
│   │       ├── Toggle.jsx
│   │       └── Disclaimer.jsx      # Warning modal about tool limitations
│   │
│   └── i18n/
│       ├── index.js                # i18n core (dot-notation, interpolation)
│       └── locales/
│           ├── en.js               # English translations (~100 keys)
│           └── fr.js               # French translations (mirrored)
│
├── public/
│   └── favicon.svg
├── .github/
│   └── workflows/
│       └── docker.yml              # CI: build & push to ghcr.io on every push to main
├── index.html                      # HTML entry point (SPA)
├── server.js                       # Express production server
├── vite.config.js                  # Vite configuration
├── Dockerfile                      # Multi-stage Docker build
├── docker-compose.yml              # Docker Compose configuration
└── package.json
```

---

## Architecture

### Processing pipeline

```
User types / imports a file
         │
         ▼
   useDebounce (300 ms)
         │
         ▼
  useWorker.processText()
         │   (structured-clone message)
         ▼
  cleaner.worker.js
  ┌──────────────────────────────────┐
  │  For each enabled pattern:       │
  │    regex.exec(text) → matches    │
  │    optional validate() fn        │
  │    skip if in excludedValues     │
  │    buildReplacement(style)       │
  └──────────────────────────────────┘
         │   { cleaned, detections }
         ▼
  appStore ← cleanedText, detections
         │
         ▼
  OutputPanel + DetectionSidebar re-render
```

Key design decisions:

- **Web Worker isolation** — regex processing never blocks the UI thread
- **Request versioning** — stale worker responses are silently dropped, preventing race conditions during fast typing
- **Chunked processing** — files larger than 50 KB are split into chunks with progress events
- **Format-aware post-processing** — after cleaning, JSON and YAML output is re-serialized to preserve structure
- **MOD-97 / Luhn validation** — IBAN and credit card patterns include checksum validation to reduce false positives

### State management

The application uses a single SolidJS reactive store (`appStore.js`) as the source of truth:

| State key | Type | Description |
|---|---|---|
| `inputText` | `string` | Raw user input |
| `cleanedText` | `string` | Processed output |
| `detections` | `object` | Map of category → detected values |
| `enabledPatterns` | `object` | Per-pattern enabled flags |
| `excludedValues` | `array` | Values marked as false positives |
| `replacementStyle` | `'labeled' \| 'redact' \| 'anonymize'` | Active replacement mode |
| `theme` | `'dark' \| 'light'` | UI theme |
| `fileFormat` | `string` | Detected format of imported file |
| `sidebarOpen` | `boolean` | Detection sidebar visibility |

---

## Configuration

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port for the Express server |
| `NODE_ENV` | `production` | Node.js environment |

### Vite (`vite.config.js`)

- Dev server port: `5173`
- Worker format: ES modules
- Build target: `esnext`

### Pattern defaults

All patterns are enabled by default except:

- `name_fr` — French name detection (high false-positive rate)
- `zip_fr` — Standalone French postal code (high false-positive rate)

---

## Internationalization

The interface is available in **English** and **French**. The language can be toggled from the header at any time.

Translations live in `src/i18n/locales/en.js` and `src/i18n/locales/fr.js`. Keys use dot notation (e.g. `header.title`) and support variable interpolation (`{{variable}}`).

To add a new language:

1. Create `src/i18n/locales/<code>.js` mirroring the structure of `en.js`
2. Import and register it in `src/i18n/index.js`

---

## API

The Express server exposes two endpoints:

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — returns `{ status: "ok", version: "1.0.0" }` |
| `POST` | `/api/parse` | Stub — returns `501 Not Implemented` (all parsing is client-side) |

All other routes serve the SPA (`index.html`).

---

## Security

- **Client-side only** — sensitive text is never sent to a backend for processing
- **Content Security Policy** — restricts script/style sources to `self` + inline; allows `blob:` for Web Workers
- **Security headers** set by Express:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **No telemetry** — the application collects no analytics or usage data

> **Disclaimer:** This tool is provided as a best-effort aid. It cannot guarantee the detection of every sensitive value. Always review the cleaned output before sharing it externally.

---

## License

See [LICENSE](LICENSE).
