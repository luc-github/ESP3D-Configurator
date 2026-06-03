# Contributing to ESP3D-Configurator

Thank you for helping improve the configurator. This guide covers local development; the configuration schema is documented in [API.md](API.md).

## Getting started

### Requirements

- Node.js **20+**
- npm

### Setup

```bash
git clone https://github.com/luc-github/ESP3D-Configurator.git
cd ESP3D-Configurator
npm ci
npm run dev
```

The `dev` script runs the webpack dev server and the small Express server in `config/server.js`. Use the URL from the terminal output.

Production build (static site, e.g. GitHub Pages):

```bash
npm run build
```

Output is under `build/` (mainly `index.html` and bundled assets).

## Scripts

| Command | When to use |
|---------|-------------|
| `npm run dev` | Day-to-day UI work |
| `npm run build` | Before PR; verify production bundle |
| `npm run validate:config` | After editing any `src/configuration/tabs/*.json` or `boardPresets.json` |
| `npm run sync:pin-roles` | After editing `pinUsageRoles.json` (writes `pinRole` into tab JSON) |
| `npm run check:esp3d` | Optional: compare camera models to a local ESP3D clone in `tmp/esp3d` |

## Pull request checklist

- [ ] `npm run validate:config` passes
- [ ] `npm run build` passes (same as CI)
- [ ] New field ids are **unique** across all tab JSON files
- [ ] New UI strings added to `src/translations/en.json`
- [ ] Manually tested: affected wizard tab(s), Download preview, import/preset if touched
- [ ] [API.md](API.md) updated if you change schema, export format, presets, or tooling

CI (`.github/workflows/ci.yml`) runs `validate:config` + `build` on pushes and PRs to `main` / `master`.

## Common change types

### New firmware option (define)

1. Add control in the right `src/configuration/tabs/<section>.json`.
2. Set `define`, `type`, `setting`, `depend` as needed.
3. Confirm the macro exists in [ESP3D](https://github.com/luc-github/ESP3D) firmware.
4. See **Quick checklist: new feature flag** in [API.md](API.md).

### New board preset

1. Edit `src/configuration/boardPresets.json`.
2. `npm run validate:config`
3. Test on Features → preset dropdown.

### Pin / GPIO behaviour

- Lists: `src/tabs/step/pins.json`, `ports.json`
- MCU rules: `pinCapabilities.js`, `mcuPinDefaults.js`, `psramReservedPins.js`
- Roles: `pinUsageRoles.json` + `npm run sync:pin-roles`

Details: [API.md — Pin and port allocation](API.md#pin-and-port-allocation).

### Import / snapshot format

Logic: `src/configuration/configurationSnapshot.js`. Do not break markers `ESP3D_CONFIG_SNAPSHOT_BEGIN` / `END` without a version bump and migration note in API.md.

## Optional: ESP3D reference tree

To run `npm run check:esp3d`:

```text
tmp/
  esp3d/          # clone of ESP3D repo
  platformio.ini  # optional reference copy
```

## Code style

- Match existing patterns in the file you edit (Preact, Spectre CSS, JSON-driven config).
- Prefer small, focused diffs; avoid unrelated refactors in the same PR.
- Comments only for non-obvious behaviour (see project conventions in existing modules).

## Questions

Open a [GitHub issue](https://github.com/luc-github/ESP3D-Configurator/issues) for bugs or feature discussion. For schema questions, cite [API.md](API.md) and the relevant `tabs/*.json` path.
