import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import { Sun, Moon, Monitor } from "preact-feather"
import { getStoredThemeMode, setThemeMode } from "../../theme/theme"

const MODES = [
    { id: "light", Icon: Sun, label: "Light theme" },
    { id: "auto", Icon: Monitor, label: "System theme" },
    { id: "dark", Icon: Moon, label: "Dark theme" },
]

const ThemeToggle = () => {
    const [mode, setMode] = useState(getStoredThemeMode)

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "esp3d-configurator-ui-theme") {
                setMode(getStoredThemeMode())
            }
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [])

    const select = (next) => {
        if (next === mode) return
        setThemeMode(next)
        setMode(next)
    }

    return (
        <div class="theme-toggle" role="radiogroup" aria-label="Color theme">
            {MODES.map(({ id, Icon, label }) => (
                <button
                    key={id}
                    type="button"
                    class={`theme-toggle-btn${mode === id ? " is-active" : ""}`}
                    role="radio"
                    aria-checked={mode === id}
                    aria-label={label}
                    title={label}
                    onClick={() => select(id)}
                >
                    <Icon size={18} />
                </button>
            ))}
        </div>
    )
}

export { ThemeToggle }
