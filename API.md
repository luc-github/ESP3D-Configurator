# ESP3D-Configurator — Configuration schema

This document describes how the configurator defines UI tabs, form fields, dependencies, and generated firmware files.

Configuration is split per tab under `src/configuration/` (one JSON file per wizard section).

## Architecture

```
src/
  configuration/
    index.js                 # Aggregates all tab sections into one object
    visibility.js            # Shared depend / visibility rules (UI + generate)
    mcuPinDefaults.js        # MCU default GPIO for SPI when pin = Default (-1)
    pinConflicts.js          # Resolve effective GPIO + conflict audit
    validateField.js         # Per-field validation in step tabs
    reservedResources.js     # Cross-tab pin/port reservation lists
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
| `skipExport` | If `true` on a group, omitted from `configuration.h` (UI unchanged; values still in JSON snapshot) |
| `define` | C macro name (e.g. `WIFI_FEATURE`) |
| `depend` | Visibility rule (see below) |
| `options` | For `select`: list of `{ label, value, help?, depend? }` |
| `disableiffalse` | For booleans: omit define when value is false |
| `needquote` | Wrap string values in quotes in generated header |
| `hide` | Skip in generated output |
| `header` | Extra lines prepended before the define |
| `ispin` | Use shared pin list (`src/tabs/step/pins.json`) |
| `pinRole` | MCU-independent usage: `output`, `input`, `bidirectional`, `analog_input`, `optional_gpio` (see `pinUsageRoles.json`; run `node tools/sync_pin_roles.js` to sync from registry) |
| `pinRoleWhen` | Optional override map, e.g. `{ "dependId": "sensortype", "map": { "ANALOG_DEVICE": "analog_input" } }` on `sensorpin` |
| `footnote` | Optional note below the control (e.g. **Memory type** boot warning on ESP32-S3) |
| `footnoteWhenActive` | If `true` on a boolean, `footnote` is shown only when the value is enabled |
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

When `ispin` or `isport` is set, the step UI tracks used pins/ports **across all tabs** (not only the current step). Lists come from:

- `reservedResources.js` — explicit GPIO values plus **resolved** defaults (see below)
- **Download** tab — `auditPinConflicts()` lists any GPIO still shared after resolution; while conflicts remain, **configuration.h** / **platformio.ini** downloads and file previews are hidden

**Default pins (`value: "-1"` + `usedefault: true`)**  
For shared SPI signals (MOSI/MISO/SCK/CS), `-1` is resolved to the MCU defaults in `mcuPinDefaults.js` (same numbers as `platformio.ini` / TFT build flags). In the UI, the default option is shown as `-1 (5)` (GPIO number for the selected MCU). Example: on ESP32, SD CS Default and TFT CS Default both resolve to GPIO 5 → reported as a conflict.

Field ids mapped to defaults are listed in `defaultPinRoles` inside `mcuPinDefaults.js`. Other `-1` pins (optional / board-specific) are not resolved and do not participate in this check.

Pin/port pick lists:

- `src/tabs/step/pins.json`
- `src/tabs/step/ports.json`

Per-field `options` can extend or override list entries (e.g. board-specific pins).

## Generated outputs

On the **Download** tab:

- **configuration.h** — `#define` lines from all sections where `setting` is true and visibility/`depend` rules pass (`src/tabs/generate/index.js`).
- **platformio.ini** — Environment derived from MCU, flash size, WiFi/Ethernet/BT, camera, display, etc.

Settings in the `default` section are included in `configuration.h` even without a UI tab.

### Configuration snapshot (in `configuration.h` only)

There is no separate settings file. **Download configuration.h** already embeds a JSON snapshot at the end of the file (block comment, markers `ESP3D_CONFIG_SNAPSHOT_BEGIN` … `ESP3D_CONFIG_SNAPSHOT_END`) with **all** wizard field ids and values (including `setting: false` fields such as serial/camera GPIO, `has_psram`, etc.).

- **Save settings:** download `configuration.h` as today (`collectConfigurationSnapshot()` + `formatSnapshotComment()` in `src/configuration/configurationSnapshot.js`, appended in `configurationFile()`).
- **Restore:** **Features** tab → **Board preset** row → **Import configuration.h** (next to the preset list). The file name becomes a preset entry (selected by default after import). Re-selecting it uses the same confirmation flow as built-in presets. JSON is read from the comment block only (no `#define` parsing). UI refresh uses `configRevision` in `DatasContext`.

Older `configuration.h` files without this block cannot be imported through this flow.

## Maintenance notes

- Avoid duplicate `id` values (e.g. multiple `ssdpmodelename` for different MCUs). Duplicates break `getValueId()` and can cause React key warnings; use distinct ids or a single control with `depend` on options.
- After editing JSON, run `npm run validate:config` (duplicate ids, broken `depend`) then `npm run build` or `npm run dev`.

## Serial GPIO

Two logical serial links (not three independent pin pairs):

| Link | Port selector | GPIO overrides |
|------|---------------|----------------|
| **Main** (printer/TFT) | **Main serial port** → `ESP_SERIAL_OUTPUT`, then **RX** / **TX** | `ESP_RX_PIN`, `ESP_TX_PIN` |
| **Serial bridge** (optional, ESP32 family) | **Use serial bridge** + **Serial bridge port** → `ESP_SERIAL_BRIDGE_OUTPUT`, then **RX** / **TX** | `ESP_BRIDGE_RX_PIN`, `ESP_BRIDGE_TX_PIN` |

All of these live in the **Serial Communications** group (pins directly under each port selector).

Use **Default** (`-1`) on RX/TX selects to keep the board default for that UART (define not emitted; `esp3d_pins.h` supplies `-1` defaults). In the UI, Default is shown as **-1 (GPIO n)** using typical UART pins for the selected **Main serial port** or **Serial bridge port** (`serialPinDefaults.js`) so pin conflict tracking matches other tabs.

Non-default GPIO values are appended to `configuration.h` with the same guards as ESP3D:

- Main: `#ifndef ESP_RX_PIN` / `ESP_TX_PIN` then `#define` (always valid once `ESP_SERIAL_OUTPUT` is set).
- Bridge: wrapped in `#if defined(ESP_SERIAL_BRIDGE_OUTPUT)` … `#endif`, each pin under `#ifndef ESP_BRIDGE_RX_PIN` / `ESP_BRIDGE_TX_PIN` (only when **Use serial bridge** is enabled). `ESP_SERIAL_BRIDGE_OUTPUT` must appear earlier in the file (from **Serial bridge port**).

**UART choices** depend on MCU (`src/tabs/step/ports.json`): ESP32/S3 may use UART 0/1/2 on the main port; bridge uses another UART from the same list when enabled. On **ESP32 with PSRAM**, UART 2 must not use GPIO 16/17 (module PSRAM lines); the configurator no longer suggests those as serial defaults when PSRAM (or a camera) is enabled.

## PSRAM reserved GPIO

When **Has PSRAM** is enabled, or a **camera** is selected (camera requires PSRAM), `psramReservedPins.js` adds module-reserved GPIO to pin tracking and conflict checks:

| MCU | Reserved GPIO (typical module wiring) |
|-----|--------------------------------------|
| ESP32 | 16, 17 (PSRAM CS / clock on WROVER-class modules) |
| ESP32-S2 | 26–31 (SPI flash + PSRAM bus) |
| ESP32-S3 | 26–32; + 33–37 if **Memory type** is octal PSRAM (`dio_opi`, `qio_opi`, `opi_opi`) |

ESP8266 has no PSRAM option. Exact pins depend on the physical module; do not assign these GPIO to SD, TFT, serial overrides, etc.

## Camera

On the **Devices** tab, the **Camera** group is visible only when **Has PSRAM** is enabled on Features (ESP32 / ESP32-S2 / ESP32-S3, not ESP-01). ESP3D only supports cameras on boards with PSRAM.

- **Camera type** → `#define CAMERA_DEVICE` in `configuration.h`.
- **Camera GPIO map** (Devices): read-only for predefined models (`cameraPinMaps.json`). **Custom** enables editing; GPIO values are written to `configuration.h`.
- **Flip** options → `CAMERA_DEVICE_FLIP_*` defines.
- Choosing a camera model still turns **Has PSRAM** on automatically; `platformio.ini` adds `-DBOARD_HAS_PSRAM` and related flags when a model is selected.

`platformio.ini` adds a `_cam` suffix to the environment name and uses `min_spiffs.csv` on 4 MB flash when a camera is enabled (aligned with `[env:esp32cam]` in ESP3D’s `platformio.ini`).

### ESP3D reference sources (`tmp/`)

Drop a copy of [ESP3D](https://github.com/luc-github/ESP3D) under `tmp/esp3d` (with `tmp/platformio.ini`) to compare against the upstream firmware. Then run:

```bash
npm run check:esp3d
```

This checks that every `CAMERA_MODEL_*` in `tmp/esp3d/src/include/esp3d_defines.h` appears in the configurator UI.

## Board presets

Starting profiles for common boards live in `src/configuration/boardPresets.json`. Each preset has:

| Field | Description |
|-------|-------------|
| `id` | Unique preset id |
| `label` | Name shown in the UI |
| `description` | Short help text |
| `values` | Map of **field id** → value (same ids as in tab JSON, across all sections) |

The picker on the **Features** tab applies a preset when you change the dropdown (confirmation dialog). **Cancel** restores the previous selection without applying. It overwrites only the fields listed in `values`; other settings are left unchanged.

To add a preset:

1. Add an entry to `boardPresets.json` (use only existing field ids).
2. Run `npm run validate:config`.
3. Test in the UI on Features → **Apply preset**.

## Quick checklist: new feature flag

1. Add the control under the right `tabs/<section>.json` group (or new group).
2. Set `define`, `type`, `value`, `setting`, and `depend` if needed.
3. Rebuild and test the tab in the UI and on Download (preview + download).
4. Confirm the matching define exists in [ESP3D](https://github.com/luc-github/ESP3D) firmware.

## Planned (not implemented)

- **Immutable configuration state** — field values are still updated in place on the loaded JSON (`subelement.value = …`). A future refactor would use immutable updates for clearer React updates, undo, and tests.

### MCU profiles (trigger when adding a new MCU)

**Not urgent today.** Recommended when the next chip is added (e.g. a future **ESP32-S31** or any MCU not covered by existing `depend` lists), instead of extending `pins.json`, `ports.json`, and tab `depend` arrays across many files.

**Goal:** one central profile per MCU; shared wizard tabs stay common; fewer `depend: { id: "targetmcu", … }` blocks.

**Intended layout (sketch):**

```text
src/configuration/mcu/
  _registry.json              # mcu id, label, supported in UI
  _common/                    # network, security, others, … (unchanged)
  esp32/profile.json          # pins[], serial ports[], flash options, SPI defaults, reserved GPIO rules
  esp32s3/profile.json
  …
```

**Per-MCU profile would own:** GPIO picker list, UART choices, flash size / `flash_mode` / `memory_type` options, `mcuPinDefaults`-style values, PSRAM/flash bus reservations (today split across `pins.json`, `ports.json`, `mcuPinDefaults.js`, `pinCapabilities.js`, `psramReservedPins.js`).

**Must stay global:** field **ids** (`wifi`, `sdmosipin`, …), snapshot import/export, `boardPresets.json` keys, and `#define` names — only options and visibility merge from the active profile.

**Runtime:** `buildConfiguration(targetmcu)` = `_common` + active `mcu/<id>/profile` (regenerate or filter UI when MCU changes; validate incompatible values after switch).

**Phased rollout:** (1) profiles for pins + defaults + rules, (2) feature tab overlays, (3) `validate:config` per profile. Until then, new MCUs follow the current pattern (`depend` + updates to the JS modules above).

### GPIO capabilities per field (input / output / ADC)

Reference list (MCU-independent): **`src/configuration/pinUsageRoles.json`** — every `ispin` / camera GPIO field mapped to a **field role**.

**Two layers (do not mix):**

| Layer | Purpose | Values |
|-------|---------|--------|
| **Field role** | What the feature needs | `output`, `input`, `bidirectional`, `analog_input`, `optional_gpio` |
| **Hardware tag** | What the chip/module allows (per MCU, later) | `reserved`, `input_only`, `output_only`, `adc`, `bidirectional` |

**Your proposal vs recommended minimum:**

| Your label | Verdict |
|------------|---------|
| Any (Input/Output/ADC) | Too broad — does not block buzzer on GPIO 34. |
| Input/Output (Not ADC) | ≈ **`bidirectional`** for SPI/SDIO/MDIO/I2C. |
| Input only / Output only | **Hardware tags**, not field roles — filter pickers (RX → not `output_only`; buzzer → not `input_only`). |
| Input only ADC | **Hardware tag** — only for `analog_input` fields (`sensorpin` when `ANALOG_DEVICE`). |
| Output only ADC | **Unused** on ESP32 (no ADC output); DAC could be a future `dac_output` role. |
| Reserved | **Hardware tag** — PSRAM/flash/strapping (`psramReservedPins.js`), not assigned on fields. |

**Counts in `pinUsageRoles.json` (54 GPIO fields):** 22× `output`, 17× `input`, 13× `bidirectional`, 2× `optional_gpio`; **`analog_input`** only via **`sensorpin`** + `roleWhen` when `sensortype=ANALOG_DEVICE` (DHT → `bidirectional`).

**Implemented:** `src/configuration/pinCapabilities.js` filters `pins.json` options in `StepField` and validates in `validateField` from `pinRole` + MCU rules (flash bus, input-only, ADC, PSRAM/octal reserved). Registry: `pinUsageRoles.json`; sync with `npm run sync:pin-roles`.

**Camera GPIO** (`camerapins` group): all pins are `select` + `ispin` + `pinRole`; lists filtered like other features. **Custom** model is editable; predefined maps stay read-only but still participate in conflict audit.

**Still TODO:** strapping warnings; finer C3/C6 module profiles.

### Flash mode & PSRAM memory type vs reserved GPIO

**Current behaviour:**

| Setting | UI | `platformio.ini` | Reserved GPIO logic |
|---------|----|------------------|---------------------|
| `flash_mode` | Features (all ESP32 targets) | All ESP32 envs: `board_build.flash_mode = $flash_mode` | **Not** tied to pin reservation yet |
| `memory_type` | Features, **ESP32-S3 only**, if `has_psram` | **ESP32-S3 only**: `board_build.arduino.memory_type = $memory_type` | **S3 only**: extra GPIO 33–37 when value is `dio_opi` / `qio_opi` / `opi_opi` (`psramReservedPins.js`) |

**MCU notes (to validate against module/schematic):**

- **ESP32 (classic):** PSRAM (WROVER) → GPIO **16–17**; flash/PSRAM SPI often **6–11** on module. `flash_mode` (dio/qio/out) changes bus width, not a different GPIO list in the configurator today.
- **ESP32-S3:** **Most sensitive** — octal flash + octal PSRAM share **26–32** and often **33–37**; `memory_type` must stay consistent with the physical module (N8R2 vs N16R8, etc.). Mismatch → boot failure, not just a pin conflict in UI.
- **ESP32-S2:** `memory_type` **not** in UI; PSRAM reservation **26–31** when `has_psram` (same SPI bus idea as S3, no octal extra pins in tool yet). `flash_mode` still emitted.
- **ESP32-C3 / C6:** `memory_type` **not** in UI; `has_psram` exists but **no** extra reserved GPIO in `psramReservedPins.js` yet — needs IDF/module matrix (some C3 modules use different lines than S3). `flash_mode` still emitted.

**Follow-up work:**

1. Document allowed `(targetmcu, flash_mode, memory_type)` combinations (presets + warnings).
2. Link **octal** `memory_type` on S3 to reserved GPIO 33–37 (done) and optionally hide those pins from pickers.
3. Decide whether S2/C3/C6 need a `memory_type`-like control or only preset-driven `platformio` strings.
4. Optionally reserve **GPIO 6–11** on ESP32 whenever flash is internal (independent of `has_psram`).
5. Cross-check `board_presets.json` (e.g. S3 `qio` + `qio_opi`) against Espressif board definitions in `tmp/platformio.ini` / ESP3D upstream.
