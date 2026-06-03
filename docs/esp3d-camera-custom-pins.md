# ESP3D — Camera CUSTOM pins and configurator

When **Camera type = Custom**, the configurator emits camera GPIO overrides in `configuration.h`:

```c
#define CAMERA_DEVICE CAMERA_MODEL_CUSTOM
#define PWDN_GPIO_NUM 32
#define XCLK_GPIO_NUM 0
// ...
```

ESP3D loads `configuration.h` before `esp3d_pins.h`. The firmware **CUSTOM** pin block must use `#ifndef` / `#define` / `#endif` so these values take effect (see ESP3D `esp3d/src/include/esp3d_pins.h`).

Predefined models use fixed maps in firmware; the configurator shows those pins read-only from `src/configuration/cameraPinMaps.json`.
