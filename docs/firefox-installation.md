# Firefox Installation Guide

This guide explains how to build Gecko for Firefox and install it permanently. The instructions rely on Mozilla's signing process so that the add-on is trusted by Firefox and survives restarts.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) and npm
- [Firefox](https://www.mozilla.org/firefox/) 109 or later
- A Mozilla Add-ons (AMO) developer account with API credentials. Create one at [addons.mozilla.org](https://addons.mozilla.org/developers/) if you do not already have it.

All required Node.js dependencies (including [`web-ext`](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/)) are installed automatically when you run `npm install` in the repository root.

## 1. Build the Firefox bundle

```bash
npm run build:ff
```

This command compiles the extension, copies the Firefox manifest, and writes the output to `dist/`.

## 2. (Optional) Create an unsigned test package

If you only need an unsigned ZIP/XPI for local testing in a Firefox Developer Edition or Nightly build with signature requirements disabled, run:

```bash
npm run package:ff
```

The package will be saved in the `artifacts/` directory. Unsigned packages cannot be permanently installed in stable Firefox builds.

## 3. Sign the extension for permanent installation

Firefox requires extensions to be signed to allow permanent installation. Run the signing script after exporting your AMO API credentials:

```bash
export AMO_JWT_ISSUER="<your-amo-api-key>"
export AMO_JWT_SECRET="<your-amo-api-secret>"
npm run sign:ff
```

`npm run sign:ff` rebuilds the project for Firefox and calls `web-ext sign` using the credentials you provided. The command uploads the build to AMO for signing and downloads the signed `.xpi` file into the `artifacts/` directory (for example, `artifacts/gecko-1.4.1.xpi`). The add-on remains unlisted unless you explicitly publish it.

> **Tip:** Increment the version number in `public/manifest-ff.json` before re-signing so that Firefox accepts the update.

## 4. Install the signed add-on permanently

1. Open Firefox and navigate to `about:addons`.
2. Click the gear icon in the top-right corner and choose **Install Add-on From File…**
3. Select the signed `.xpi` file from the `artifacts/` directory.
4. Confirm the installation prompts.

Once installed, the add-on is treated as a permanent extension: it appears in the Extensions list, remains enabled across restarts, and receives automatic updates when you distribute new signed versions.

## Troubleshooting

- **Signing failed:** Check that the AMO API credentials are correct and that the version number is unique. Mozilla rejects duplicate version numbers for the same add-on ID.
- **Missing Firefox-specific changes:** Ensure your modifications are reflected in `public/manifest-ff.json` before building.
- **Developer Edition/Nightly testing:** You can temporarily load the unsigned build via `about:debugging`, but it will unload on browser restart. Use the signed workflow above for permanent installs.

With these steps the Gecko extension functions as a permanent Firefox add-on while sharing the same codebase as the Chrome version.
