# Capybara

A lazy WireGuard client based on wg-easy.

The app built with vue3 + naive-ui + electron

It supports **automatic synchronization of cloud wg-easy configuration lists, real-time traffic monitoring, cross-platform, and personalized configuration.**

![Light Theme](docs/images/demo-light.png)

![Dark Theme](docs/images/demo-dark.png)

## How to use

There are two ways to use Capybara:

#### Clone the project and then build and distribute the product yourself

This approach is recommended because the key is embedded in the source code and protected with security measures such as obfuscation, encryption, etc

#### Use the version that is already built and then configure it in the settings

Please note that since Capybara needs to configure the wg-easy key to function properly, you need to make sure that your key is not leaked

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

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
