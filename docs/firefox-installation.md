# Firefox Installation Guide

This guide walks through producing a permanently installable Firefox build of the Gecko extension. Follow the steps in order—each one builds on the previous one.

> ⚠️ The `sign:ff` and `package:ff` npm scripts live on the `main` branch. If you checked out a different branch locally, switch back to `main` before continuing.

## Step 0 – Update to the latest `main`

```bash
git checkout main
git pull
```

Keeping your local checkout in sync with `main` ensures that the Firefox build scripts are available and that you are packaging the latest code.

## Step 1 – Install project dependencies

```bash
npm install
```

This installs all Node.js dependencies, including [`web-ext`](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/), the CLI that handles packaging and signing.

## Step 2 – Create Mozilla Add-ons API credentials

Permanent Firefox installations require a signed XPI. Signing is performed by Mozilla and therefore needs API credentials tied to your Mozilla Add-ons (AMO) account.

1. Sign in (or create an account) at [addons.mozilla.org](https://addons.mozilla.org/developers/).
2. Open **Tools → Manage API Keys**.
3. Click **Create new credential** and copy the generated **API Key** and **API Secret**.
4. Export the credentials in your shell (or store them in your preferred secret manager):

   ```bash
   export WEB_EXT_API_KEY="<your-amo-api-key>"
   export WEB_EXT_API_SECRET="<your-amo-api-secret>"
   ```

   These environment variables are read automatically by the signing script. If you already use the legacy names `AMO_JWT_ISSUER`
   and `AMO_JWT_SECRET`, the script accepts those as well.

> 💡 Tip: If you frequently sign builds, consider storing the variables in a `.env` file and loading them with a tool such as [`direnv`](https://direnv.net/) or your shell profile.

## Step 3 – Build the Firefox bundle

```bash
npm run build:ff
```

This command prepares the extension for Firefox by copying `public/manifest-ff.json` to `public/manifest.json` and running the production webpack build. The result is placed in the `dist/` directory.

## Step 4 – Sign the bundle for permanent installation

```bash
npm run sign:ff
```

`npm run sign:ff` reuses the Firefox build from Step 3 (rebuilding it if necessary) and invokes `web-ext sign` with the AMO credentials you exported. The script validates that the credentials are present before calling the API so failures surface with actionable guidance. Mozilla signs the bundle and returns a signed `.xpi` to the `artifacts/` directory—for example, `artifacts/gecko-1.4.1.xpi`. The extension remains unlisted unless you explicitly publish it in the AMO dashboard.

> 🔁 Re-signing the same version is rejected by AMO. Increment the `version` field in `public/manifest-ff.json` before producing an update.

## Step 5 – Install the signed add-on in Firefox

1. Open Firefox and visit `about:addons`.
2. Click the gear icon in the top-right corner and select **Install Add-on From File…**
3. Choose the signed `.xpi` from the `artifacts/` directory and accept the confirmation prompts.

Firefox now treats Gecko as a permanent extension: it survives browser restarts and appears in the Extensions list alongside store-installed add-ons.

## Optional – Create an unsigned test package

If you only need to test locally in Firefox Developer Edition or Nightly (with signature enforcement disabled), build an unsigned package instead:

```bash
npm run package:ff
```

Unsigned packages are also saved in the `artifacts/` directory but **cannot** be permanently installed in stable Firefox builds.

## Troubleshooting

- **Signing script missing:** Ensure you are on the `main` branch and have pulled the latest changes. Earlier branches may not define the Firefox scripts.
- **Signing failed:** Verify that `WEB_EXT_API_KEY` and `WEB_EXT_API_SECRET` (or the legacy `AMO_JWT_ISSUER`/`AMO_JWT_SECRET`) are set and that the manifest version is unique.
- **Changes not reflected:** Double-check that any Firefox-specific tweaks are present in `public/manifest-ff.json` before building.
- **Unsigned build disappears:** Only signed add-ons survive restarts in stable Firefox. Use the signing workflow above for permanent installs.

With these steps, you can generate a signed Gecko build suitable for distribution or long-term personal use in Firefox.
