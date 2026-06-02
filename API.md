# ESP3D-Configurator — Configuration schema

This document describes how the configurator defines UI tabs, form fields, dependencies, and generated firmware files.

Configuration is split per tab under `src/configuration/` (one JSON file per wizard section).

## Architecture

```
src/
  configuration/
    index.js                 # Aggregates all tab sections into one object
    tabs/
      features.json          # Tab data (array of groups)
      features.js            # import ... from "./features.json"
      network.json
      ...
  pages/config/
    steps.js                 # Tab bar order, routes, icons (UI registry)
  contexts/
    DatasContext.js          # Loads aggregated configuration
  tabs/
    step/                    # Renders step tabs; pins.json / ports.json
    generate/                # Builds configuration.h and platformio.ini
```

| Layer | Role |
|-------|------|
| `configTabs` (`steps.js`) | Wizard navigation: label, route, link id, icon, `section` key |
| `tabs/<section>.json` | Field definitions for one configurator step |
| `configuration/index.js` | `{ features: [...], network: [...], ... }` for the app |
| `GenerateTab` | Reads full configuration and exports `configuration.h` / `platformio.ini` |

The `default` section exists in `configuration/index.js` (from `defaults.json`) and is included in generated headers, but it has **no dedicated tab** in the UI.

## Configurator tabs (UI)

Defined in `src/pages/config/steps.js` (`configTabs`):

| Tab | Route | Config section (`current`) |
|-----|-------|----------------------------|
| Features | `/config/features` | `features` |
| Network | `/config/network` | `network` |
| Filesystems | `/config/filesystems` | `filesystems` |
| Update | `/config/update` | `update` |
| Devices | `/config/devices` | `devices` |
| Security | `/config/security` | `security` |
| Others | `/config/others` | `others` |
| Download | `/config/generate` | (generation only) |

To add a new wizard tab:

1. Create `src/configuration/tabs/<section>.json` (array of groups).
2. Create `src/configuration/tabs/<section>.js` that default-exports that JSON.
3. Register the section in `src/configuration/index.js`.
4. Add an entry to `configTabs` in `src/pages/config/steps.js` (order = wizard order).
5. Routes are built automatically in `src/pages/config/index.js` from `configTabs`.

## Tab file format

Each `tabs/<section>.json` file is a **JSON array** of top-level **groups**:

```json
[
  {
    "id": "mygroup",
    "description": "Group help text",
    "label": "Group title",
    "setting": true,
    "type": "group",
    "depend": { "id": "otherField", "value": [true] },
    "value": [ /* controls */ ]
  }
]
```

## Control (field) format

Each item inside `group.value` is a control:

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (used by `depend` and `getValueId()`). **Must be unique across the whole configuration.** |
| `label` | Short title in the UI |
| `description` | Longer help text |
| `type` | `text`, `number`, `select`, `boolean`, or `group` (nested) |
| `value` | Default value (`boolean`, string, or `-1` for “none” on selects) |
| `setting` | If `true`, emitted as `#define` in `configuration.h`; if `false`, comment only |
| `define` | C macro name (e.g. `WIFI_FEATURE`) |
| `depend` | Visibility rule (see below) |
| `options` | For `select`: list of `{ label, value, help?, depend? }` |
| `disableiffalse` | For booleans: omit define when value is false |
| `needquote` | Wrap string values in quotes in generated header |
| `hide` | Skip in generated output |
| `header` | Extra lines prepended before the define |
| `ispin` | Use shared pin list (`src/tabs/step/pins.json`) |
| `isport` | Use shared serial port list (`src/tabs/step/ports.json`) |
| `usedefault` | For pin/port selects: show “Default” instead of “None” |
| `usedescforoptions` | Repeat `description` as comment for select defines |

### Dependencies (`depend`)

Controls and options can be shown only when other fields match:

```json
"depend": { "id": "wifi", "value": [true] }
```

```json
"depend": { "id": "targetmcu", "notvalue": ["esp8266", "esp8285"] }
```

Multiple conditions (all must match):

```json
"depend": [
  { "id": "ethernet", "value": [true] },
  { "id": "ethernetboard", "notvalue": "TYPE_ETH_PHY_W5500" }
]
```

For string defines in `depend.value`, use the same quoting as in `value` (e.g. `"\"script\""`).

**Note:** Some legacy entries use the string `"true"` instead of boolean `true` for ethernet-related fields. Prefer real booleans for new fields.

### Pin and port allocation

When `ispin` or `isport` is set, the step UI tracks used pins/ports globally so the same resource is not selected twice. Lists come from:

- `src/tabs/step/pins.json`
- `src/tabs/step/ports.json`

Per-field `options` can extend or override list entries (e.g. board-specific pins).

## Generated outputs

On the **Download** tab:

- **configuration.h** — `#define` lines from all sections where `setting` is true and visibility/`depend` rules pass (`src/tabs/generate/index.js`).
- **platformio.ini** — Environment derived from MCU, flash size, WiFi/Ethernet/BT, camera, display, etc.

Settings in the `default` section are included in `configuration.h` even without a UI tab.

## Maintenance notes

- Avoid duplicate `id` values (e.g. multiple `ssdpmodelename` for different MCUs). Duplicates break `getValueId()` and can cause React key warnings; use distinct ids or a single control with `depend` on options.
- After editing JSON, run `npm run validate:config` (duplicate ids, broken `depend`) then `npm run build` or `npm run dev`.

## Quick checklist: new feature flag

1. Add the control under the right `tabs/<section>.json` group (or new group).
2. Set `define`, `type`, `value`, `setting`, and `depend` if needed.
3. Rebuild and test the tab in the UI and on Download (preview + download).
4. Confirm the matching define exists in [ESP3D](https://github.com/luc-github/ESP3D) firmware.
