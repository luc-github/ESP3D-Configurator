const STORAGE_KEY = "esp3d-configurator-ui-theme"
const THEME_MODES = ["light", "auto", "dark"]
const DEFAULT_MODE = "auto"

let mediaQuery = null
let mediaListener = null

const resolveTheme = (mode) => {
    if (mode === "dark") return "dark"
    if (mode === "light") return "light"
    if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        return "dark"
    }
    return "light"
}

const getStoredThemeMode = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return THEME_MODES.includes(stored) ? stored : DEFAULT_MODE
    } catch {
        return DEFAULT_MODE
    }
}

const applyThemeMode = (mode) => {
    const safeMode = THEME_MODES.includes(mode) ? mode : DEFAULT_MODE
    const resolved = resolveTheme(safeMode)
    const root = document.documentElement
    root.dataset.themeMode = safeMode
    root.dataset.theme = resolved
    try {
        localStorage.setItem(STORAGE_KEY, safeMode)
    } catch {
        /* ignore */
    }
    return { mode: safeMode, resolved }
}

const detachSystemListener = () => {
    if (mediaQuery && mediaListener) {
        mediaQuery.removeEventListener("change", mediaListener)
    }
    mediaQuery = null
    mediaListener = null
}

const attachSystemListener = () => {
    detachSystemListener()
    if (typeof window === "undefined") return
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaListener = () => {
        if (getStoredThemeMode() === "auto") {
            applyThemeMode("auto")
        }
    }
    mediaQuery.addEventListener("change", mediaListener)
}

const initTheme = () => {
    const mode = getStoredThemeMode()
    applyThemeMode(mode)
    if (mode === "auto") {
        attachSystemListener()
    } else {
        detachSystemListener()
    }
}

const setThemeMode = (mode) => {
    const result = applyThemeMode(mode)
    if (mode === "auto") {
        attachSystemListener()
    } else {
        detachSystemListener()
    }
    return result
}

export {
    STORAGE_KEY,
    THEME_MODES,
    DEFAULT_MODE,
    getStoredThemeMode,
    resolveTheme,
    applyThemeMode,
    setThemeMode,
    initTheme,
}
