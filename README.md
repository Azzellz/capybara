# Capybara

A lazy WireGuard client based on wg-easy.

The app built with vue3 + naive-ui + electron.

It supports **automatic synchronization of cloud wg-easy configuration lists, real-time traffic monitoring, cross-platform, and personalized configuration.**

![Light Theme](docs/images/demo-light.png)

![Dark Theme](docs/images/demo-dark.png)

## How to use

There are two ways to use Capybara:

#### Clone the project and then build and distribute the product yourself

This approach is recommended because the key is embedded in the source code and protected with security measures such as obfuscation, encryption, etc

#### Use the version that is already built and then configure it in the settings

Please note that since Capybara needs to configure the wg-easy key to function properly, you need to make sure that your key is not leaked

## Environment variables

If you are building it yourself, then create the .env file in the project root directory.

The content of the .env file should be as follows:

```bash
MAIN_VITE_LOGO =   # Optional. The path to the logo image file (only online path is supported)
MAIN_VITE_URL =   # Required. The URL of the wg-easy server
MAIN_VITE_TITLE = Capybara   # Optional. The title of the app
MAIN_VITE_SUBTITLE = A windows platform wireguard client specially built for wg-easy... # Optional. The subtitle of the app
MAIN_VITE_AUTOSYNC_ENABLE = true  # Required. Whether to enable automatic synchronization of cloud wg-easy configuration lists
MAIN_VITE_AUTOSYNC_INTERVAL = 1000  # Required. The interval (in milliseconds) for automatic synchronization of cloud wg-easy configuration lists
MAIN_VITE_SECRET =   # Optional. The secret key for wg-easy API authentication (if not provided, the app need to enter the key manually)
```

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

You need to enable Admin Mode to successfully launch Dev Mode

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```
