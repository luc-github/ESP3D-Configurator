/*
 Input.js - ESP3D WebUI component file

 Copyright (c) 2021 Alexandre Aussourd. All rights reserved.
 Modified by Luc LEBOSSE 2021

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
import { useRef, useState, useEffect } from "preact/hooks"
import { Eye, EyeOff, Search, ChevronDown, HelpCircle } from "preact-feather"
import { ButtonImg } from "../../Controls"
import { T } from "./../../Translations"
import { showModal } from "../../Modal"
import { useUiContext, useUiContextFn } from "../../../contexts"

const Reveal = ({ applyTo }) => {
    const [reveal, setReveal] = useState(false)
    const clickReveal = () => {
        setReveal(!reveal)
        //note: reveal is not yet updated so need to upside down compare to use effect
        applyTo.current.type = reveal ? "password" : "text"
    }
    useEffect(() => {
        //for consistency in case of redraw
        applyTo.current.type = reveal ? "text" : "password"
    }, [])
    return (
        <div class="form-icon passwordReveal" onCLick={clickReveal}>
            {reveal ? (
                <EyeOff
                    size="1rem"
                    class="has-error"
                    style="margin-top:0.15rem"
                />
            ) : (
                <Eye size="1rem" class="has-error" style="margin-top:0.15rem" />
            )}
        </div>
    )
}

const Input = ({
    label = "",
    type = "text",
    id = "",
    value = "",
    width,
    setValue,
    options = [],
    extra,
    inline,
    append,
    depend,
    help,
    button,
    disabled,
    className,
    ...rest
}) => {
    const { step } = rest
    const inputref = useRef()
    const onInput = (e) => {
        if (setValue) {
            setValue(e.target.value)
        }
    }
    const { modals } = useUiContext()
    const props = {
        type,
        id,
        name: id,
        value,
        step: step ? step : "any",
    }

    useEffect(() => {
        //to update state when import- but why ?
        if (setValue) setValue(null, true)
    }, [value])
    if (type === "password")
        return (
            <div class={`has-icon-right ${inline ? "column" : ""}`} {...rest}>
                <input
                    spellcheck="false"
                    autocorrect="off"
                    autocomplete="off"
                    ref={inputref}
                    class="form-input"
                    {...props}
                    placeholder=""
                    {...rest}
                    onInput={onInput}
                />
                <Reveal applyTo={inputref} />
            </div>
        )
    if (extra == "dropList") {
        return (
            <div class={`input-group ${inline ? "column" : ""} `}>
                <input
                    spellcheck="false"
                    autocorrect="off"
                    autocomplete="off"
                    lang="en-US"
                    ref={inputref}
                    style={width ? "width:" + width : ""}
                    id={id}
                    class="form-input"
                    {...props}
                    placeholder=""
                    {...rest}
                    onInput={onInput}
                />
                {append && <span class="input-group-addon">{T(append)}</span>}
                {options.length > 0 && (
                    <ButtonImg
                        class="input-group-btn"
                        icon={<ChevronDown color="blue" />}
                        data-tooltip={T(help)}
                        onClick={(e) => {
                            e.target.blur()
                            const modalId = "list" + id
                            showModal({
                                modals,
                                title: T("S198"),
                                button2: { text: T("S24") },
                                icon: <HelpCircle />,
                                id: modalId,
                                content: (
                                    <ul class="selection-list">
                                        {options.map((option) => {
                                            return (
                                                <li
                                                    class="item-selection-list"
                                                    onclick={(e) => {
                                                        setValue(option.value)
                                                        modals.removeModal(
                                                            modals.getModalIndex(
                                                                modalId
                                                            )
                                                        )
                                                    }}
                                                >
                                                    {option.display}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                ),
                            })
                        }}
                    />
                )}
            </div>
        )
    }
    return (
        <div
            class={`input-group ${inline ? "column" : ""} ${
                button ? "has-button-submit" : "no-button-submit"
            } ${help ? "tooltip" : ""}`}
            data-tooltip={T(help)}
        >
            <input
                class={"form-input " + className}
                disabled={disabled}
                spellcheck="false"
                autocorrect="off"
                autocomplete="off"
                {...props}
                {...rest}
                onInput={onInput}
            />
            {append && <span class="input-group-addon">{T(append)}</span>}
            {button}
        </div>
    )
}

export default Input
