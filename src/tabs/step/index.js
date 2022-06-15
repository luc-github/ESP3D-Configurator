/*
 index.js - ESP3D WebUI navigation tab file

 Copyright (c) 2020 Luc Lebosse. All rights reserved.

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
import { Fragment, h } from "preact"
import { useState, useEffect } from "preact/hooks"
import { FieldGroup, Field, ButtonImg } from "../../components/Controls"
import { T } from "../../components/Translations"
import {
    useDatasContext,
    useDatasContextFn,
    useUiContext,
} from "../../contexts"
import { ArrowLeft, ArrowRight } from "preact-feather"

const getHelp = (item, value) => {
    if (item) {
        const index = item.findIndex((element) => {
            return element.value == value
        })
        if (index > -1) return item[index].help
    }
    return null
}

const canshow = (depend) => {
    if (depend) {
        const val = useDatasContextFn.getValueId(depend.id)
        return depend.value.includes(val)
    }
    return true
}

const StepTab = ({ previous, current, next }) => {
    const { configuration } = useDatasContext()
    console.log(current)
    const generateValidation = (fieldData) => {
        const validation = {
            message: "",
            valid: true,
            modified: false,
        }
        return validation
    }
    return (
        <div id={current} class="m-2">
            <div class="center">
                {configuration.current[current] &&
                    configuration.current[current].map((element, index) => {
                        if (element.type === "group") {
                            if (!canshow(element.depend)) return null

                            return (
                                <FieldGroup
                                    id={element.id}
                                    label={T(element.label)}
                                >
                                    {element.value.map(
                                        (subelement, subindex) => {
                                            if (!canshow(subelement.depend))
                                                return null
                                            if (
                                                typeof subelement.initial ===
                                                "undefined"
                                            )
                                                subelement.initial =
                                                    subelement.value
                                            const {
                                                label,
                                                initial,
                                                type,
                                                options,
                                                value,
                                                ...rest
                                            } = subelement
                                            const filteredOptions = options
                                                ? options.filter((opt) => {
                                                      return canshow(opt.depend)
                                                  })
                                                : null
                                            if (
                                                filteredOptions &&
                                                filteredOptions.findIndex(
                                                    (op) =>
                                                        op.value ==
                                                        subelement.value
                                                ) == -1
                                            ) {
                                                subelement.value =
                                                    filteredOptions[0].value
                                            }
                                            const [help, setHelp] = useState(
                                                options
                                                    ? getHelp(options, value)
                                                    : subelement.description
                                            )
                                            const [validation, setvalidation] =
                                                useState()
                                            return (
                                                <Fragment>
                                                    <Field
                                                        inline
                                                        className="fit-content"
                                                        label={T(label)}
                                                        options={
                                                            filteredOptions
                                                        }
                                                        value={value}
                                                        type={type}
                                                        {...rest}
                                                        validationfn={
                                                            generateValidation
                                                        }
                                                        setValue={(
                                                            val,
                                                            update = false
                                                        ) => {
                                                            if (!update) {
                                                                subelement.value =
                                                                    val
                                                                if (options)
                                                                    setHelp(
                                                                        getHelp(
                                                                            options,
                                                                            val
                                                                        )
                                                                    )
                                                            }
                                                            setvalidation(
                                                                generateValidation(
                                                                    subelement
                                                                )
                                                            )
                                                        }}
                                                        validation={validation}
                                                    />
                                                    {help && (
                                                        <div class="m-1">
                                                            {help}
                                                        </div>
                                                    )}
                                                    {subelement.usedescforoptions && (
                                                        <div class="m-1">
                                                            {
                                                                subelement.description
                                                            }
                                                        </div>
                                                    )}
                                                    <div
                                                        class="m-1 divider"
                                                        style="border-color: #dadee4"
                                                    />
                                                </Fragment>
                                            )
                                        }
                                    )}
                                </FieldGroup>
                            )
                        } else {
                            return <Fragment>{element.label}</Fragment>
                        }
                    })}
                <div style="display:flex;justify-content:space-around">
                    {previous && (
                        <ButtonImg
                            m2
                            label={T("Previous")}
                            icon={<ArrowLeft />}
                            onclick={() => {
                                if (document.getElementById(previous)) {
                                    document.getElementById(previous).click()
                                }
                            }}
                        />
                    )}

                    {next && (
                        <ButtonImg
                            m2
                            label={T("Next")}
                            icon={<ArrowRight />}
                            iconRight
                            onclick={() => {
                                if (document.getElementById(next)) {
                                    document.getElementById(next).click()
                                }
                            }}
                        />
                    )}
                </div>
                <br />
            </div>
        </div>
    )
}

export { StepTab }
