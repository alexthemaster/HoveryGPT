# HoveryGPT

[![time](https://wakatime.com/badge/github/alexthemaster/HoveryGPT.svg)](https://wakatime.com/badge/github/alexthemaster/HoveryGPT)
[![Continuous Integration](https://github.com/alexthemaster/HoveryGPT/actions/workflows/ci.yml/badge.svg)](https://github.com/alexthemaster/HoveryGPT/actions/workflows/ci.yml)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/alexthemaster/HoveryGPT/total?label=Total%20downloads)
![GitHub commits since latest release](https://img.shields.io/github/commits-since/alexthemaster/HoveryGPT/latest)

HoveryGPT is a lightweight and fast Electron application built with TypeScript and Vue, designed for quickly prompting ChatGPT by bringing it up using a keyboard shortcut. It provides a streamlined way to interact with ChatGPT without switching contexts, making AI-assisted workflows more efficient.

## Features

- **Quick Access** – Open the HoveryGPT window instantly using a configurable keyboard shortcut.
- **Customizable API Settings** – Set a custom base URL, model, temperature, and developer prompt to fine-tune responses.
- **Cross-Platform Support** – Automatically built for Windows, macOS, and Linux (both x86 and ARM architectures) via GitHub Actions.
- **Optimized Performance** – Despite being an Electron app, HoveryGPT runs smoothly on an average computer.
- **Tested Environments** – Verified on Windows 11 and Arch Linux for stability and performance.

## Installation

You can find the latest builds in the [Releases](https://github.com/alexthemaster/HoveryGPT/releases) tab on the GitHub page. Choose the appropriate version for your operating system and architecture (x86 or ARM).

## Usage

1. Open HoveryGPT using the assigned keyboard shortcut.
2. Enter your question or prompt in the chat window.
3. Get instant responses from ChatGPT without disrupting your workflow.

## Configuration

HoveryGPT allows users to customize their ChatGPT experience:

- **Base URL** – Use a custom API endpoint.
- **Model Selection** – Choose from different ChatGPT models.
- **Temperature** – Adjust response randomness.
- **Developer Prompt** – Pre-configure system-level instructions for fine-tuned responses.

## Development

To build HoveryGPT locally, ensure you have Node.js and npm installed.

```sh
# Clone the repository
git clone https://github.com/alexthemaster/HoveryGPT.git
cd HoveryGPT

# Install dependencies
npm install

# Run the application
npm run dev
```

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests in the GitHub repository.

## License

HoveryGPT is released under the [MIT License](LICENSE).

---

Made with ❤️ using Electron, TypeScript, and Vue.
