<div align="center">

<img src="docs/images/logo.png" alt="Capybara" height="140"/>

<br/>
<!-- Latest Release -->
<img src="https://badgen.net/github/release/Azzellz/capybara" alt="Latest Release"/>
<!-- License -->
<img src="https://badgen.net/github/license/Azzellz/capybara" alt="License"/>
<!-- CI Passing -->
<img src="https://badgen.net/github/checks/Azzellz/capybara/main" alt="CI Status"/>

</div>

# Capybara

A versatile WireGuard client for Windows (also buildable for macOS & Linux), inspired by wg-easy, built with Vue 3 + Naive UI + Electron.

> Supports automatic cloud sync of wg-easy configurations, real‑time traffic monitoring, cross‑platform builds, and flexible personalization.

![Light Theme](docs/images/demo-light.png)
![Dark Theme](docs/images/demo-dark.png)

## Key Features

- Automatic periodic sync of wg-easy peer configuration lists
- Real-time traffic monitoring per peer
- Inline editing & personalized configuration
- Cross-platform build targets (Win / macOS / Linux)
- Secure handling of secret (build-time embedding or runtime input)
- Customizable branding (logo, title, subtitle)

## Usage Options

### 1. Clone & Self-Build (Recommended)

Embeds the secret at build time (combined with obfuscation / encryption strategies). Suitable if you control distribution and want minimal runtime input.

### 2. Use Prebuilt Release

Download a packaged build and configure the server URL and secret inside Settings. Ensure you protect and rotate your wg-easy API secret.

## Security Notes

- Do not publish builds containing production secrets to untrusted channels.
- Prefer environment injection or runtime entry in shared environments.
- Consider secret rotation if a distributed binary is leaked.

## Environment Variables (.env in project root)

All values are string-based; omit quotes unless needed.

```
MAIN_VITE_LOGO=                 # Optional: Online image URL for a custom logo
MAIN_VITE_URL=                  # Optional: Default wg-easy server base URL
MAIN_VITE_TITLE=Capybara        # Optional: Application title
MAIN_VITE_SUBTITLE=A Windows platform WireGuard client for wg-easy...  # Optional subtitle
MAIN_VITE_AUTOSYNC_ENABLE=true  # Required: Enable automatic remote configuration sync (true/false)
MAIN_VITE_AUTOSYNC_INTERVAL=5000 # Required: Sync interval in ms (e.g. 5000)
MAIN_VITE_SECRET=               # Optional: wg-easy API secret; if absent user must enter manually
```

Tips:

- Set a reasonable interval (e.g. 3000–10000 ms) to balance freshness and load.
- Omit MAIN_VITE_SECRET for shared builds; let users supply it securely.

## Development Environment

Recommended: VS Code + ESLint + Prettier + Volar.

## Prerequisites

- Node.js (LTS recommended)
- pnpm (package manager)
- Administrator privileges (Windows) for dev mode (required to manage WireGuard service)

## Install

```bash
pnpm install
```

## Run (Development)

Enable Administrator mode (Windows) before starting:

```bash
pnpm dev
```

## Build

```bash
# Windows
pnpm build:win

# macOS
pnpm build:mac

# Linux
pnpm build:linux
```

Artifacts will appear in the dist directory. Sign binaries where applicable.

## Troubleshooting

- WireGuard not initializing: verify admin privileges.
- Sync not working: check MAIN_VITE_URL reachability and secret validity.
- UI assets missing: ensure online logo URL is accessible over HTTPS.

## License

(Add license info here if applicable.)

## Disclaimer

Capybara interacts with wg-easy API endpoints; ensure compliance with your infrastructure security policies.

## Roadmap (Optional)

- Cross-platform builds for macOS & Linux
- Multi-server profiles
- Tray integration
- Usage analytics (opt‑in)
- Secret vault provider support

Contributions & suggestions welcome.
