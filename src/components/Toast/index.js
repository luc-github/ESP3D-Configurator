/*
 Toast.js - ESP3D WebUI component file

 Copyright (c) 2021 Alexandre Aussourd. All rights reserved.
 
 This code is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 2.1 of the License, or (at your option) any later version.
 This code is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.
 You should have received a copy of the GNU Lesser General Public
 License along with This code; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
import { h } from "preact"
import { useEffect } from "preact/hooks"
import { useUiContext, useUiContextFn } from "../../contexts"
import { T } from "../Translations"

const modifierClass = (type) => {
    if (type === "success") return "toast-success"
    if (type === "error") return "toast-error"
    if (type === "warning") return "toast-warning"
    if (type === "primary") return "toast-primary"
    return ""
}

const Toast = ({ index, type = "", message = "", timeout = 2000, remove }) => {
    useEffect(() => {
        let timer
        if (timeout) {
            timer = setTimeout(() => {
                remove(index)
            }, timeout)
            return () => clearTimeout(timer)
        }
    }, [])

    const variantClass = modifierClass(type)

    return (
        <div class={`toast ${variantClass}`.trim()}>
            <span class="toast-message">{message}</span>
            <button
                type="button"
                class="btn btn-clear float-right"
                aria-label="Close"
                onClick={() => {
                    useUiContextFn.haptic()
                    remove(index)
                }}
            />
        </div>
    )
}

const ToastsContainer = () => {
    const { toasts } = useUiContext()
    return (
        toasts.toastList && (
            <div class="toasts-container">
                {toasts.toastList.map((toast) => {
                    const { id, type, content, message, literal } = toast
                    const text = content ?? message
                    const label = text
                        ? literal
                            ? String(text)
                            : T(text)
                        : ""
                    return (
                        <Toast
                            remove={toasts.removeToast}
                            index={id}
                            type={type}
                            message={label}
                            key={id}
                        />
                    )
                })}
            </div>
        )
    )
}

export { ToastsContainer }
