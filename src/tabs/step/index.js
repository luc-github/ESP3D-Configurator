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
import {
    FieldGroup,
    Field,
    ButtonImg,
    Loading,
} from "../../components/Controls"
import { T } from "../../components/Translations"
import {
    useDatasContext,
    useDatasContextFn,
    useUiContext,
} from "../../contexts"
import { ArrowLeft, ArrowRight } from "preact-feather"

import pinsList from "./pins.json"

const usedPinsList = {}
usedPinsList.current = []

const removeUsedPin = (pin) => {
    if (pin == "-1") return
    usedPinsList.current = usedPinsList.current.filter(
        (element) => element != pin
    )
}
const addUsedPin = (pin) => {
    if (pin == "-1") return
    usedPinsList.current.push(pin)
}

const mergePinsOptions = (pins, options) => {
    if (pins) {
        const newList = JSON.parse(JSON.stringify(pins))
        if (options) {
            options.forEach((option) => {
                const index = newList.findIndex((element) => {
                    return element.value == option.value
                })
                if (index > -1) {
                    //just update depend label and value should stay the same
                    newList[index].depend = option.depend
                } else {
                    //allow to add new option
                    newList.push(option)
                }
            })
        }
        return newList
    }
    return null
}

const getHelp = (item, value) => {
    if (item) {
        const index = item.findIndex((element) => {
            return element.value == value
        })
        if (index > -1) return item[index].help
    }
    return null
}

const canshow = (depend, pinvalue, currentvalue) => {
    if (pinvalue && pinvalue != "-1") {
        if (pinvalue == currentvalue && canshow(depend)) {
            return true
        }
        if (usedPinsList.current.includes(pinvalue)) {
            return false
        }
    }
    if (depend) {
        if (Array.isArray(depend)) {
            const res = depend.reduce((acc, curdep) => {
                if (!acc) return acc
                const val = useDatasContextFn.getValueId(curdep.id)
                if (curdep.value) {
                    return curdep.value.includes(val)
                }
                if (curdep.notvalue) {
                    return !curdep.notvalue.includes(val)
                }
            }, true)
            return res
        } else {
            const val = useDatasContextFn.getValueId(depend.id)
            if (depend.value) {
                return depend.value.includes(val)
            }
            if (depend.notvalue) {
                return !depend.notvalue.includes(val)
            }
        }
    }
    return true
}

const NavButtons = ({ previous, next }) => {
    return (
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
    )
}

const StepTab = ({ previous, current, next }) => {
    const { configuration } = useDatasContext()
    const generateValidation = (fieldData) => {
        const validation = {
            message: "",
            valid: true,
            modified: false,
        }
        return validation
    }
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(false)
    }, [])
    return (
        <div id={current} class="m-2">
            {isLoading && <Loading large />}
            {!isLoading && (
                <div class="center">
                    <NavButtons previous={previous} next={next} />
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
                                                const optionsList =
                                                    subelement.ispin
                                                        ? subelement.usedefault
                                                            ? JSON.parse(
                                                                  JSON.stringify(
                                                                      mergePinsOptions(
                                                                          pinsList,
                                                                          options
                                                                      )
                                                                  ).replaceAll(
                                                                      "None",
                                                                      "Default"
                                                                  )
                                                              )
                                                            : mergePinsOptions(
                                                                  pinsList,
                                                                  options
                                                              )
                                                        : options
                                                const filteredOptions =
                                                    optionsList
                                                        ? optionsList.filter(
                                                              (opt) => {
                                                                  return canshow(
                                                                      opt.depend,
                                                                      subelement.ispin
                                                                          ? opt.value
                                                                          : null,
                                                                      subelement.ispin
                                                                          ? subelement.value
                                                                          : null
                                                                  )
                                                              }
                                                          )
                                                        : null
                                                if (
                                                    filteredOptions &&
                                                    filteredOptions.findIndex(
                                                        (op) =>
                                                            op.value ==
                                                            subelement.value
                                                    ) == -1
                                                ) {
                                                    if (subelement.ispin) {
                                                        removeUsedPin(
                                                            subelement.value
                                                        )
                                                    }
                                                    subelement.value =
                                                        filteredOptions[0].value
                                                }
                                                const [help, setHelp] =
                                                    useState(
                                                        subelement.options
                                                            ? getHelp(
                                                                  optionsList,
                                                                  subelement.value
                                                              )
                                                            : subelement.description
                                                    )
                                                const [
                                                    validation,
                                                    setvalidation,
                                                ] = useState()
                                                //workaround to useState not always updating help at begining and use another one from another page...
                                                useEffect(() => {
                                                    setHelp(
                                                        optionsList
                                                            ? getHelp(
                                                                  optionsList,
                                                                  subelement.value
                                                              )
                                                            : subelement.description
                                                    )
                                                }, [])
                                                useEffect(() => {
                                                    setHelp(
                                                        optionsList
                                                            ? getHelp(
                                                                  optionsList,
                                                                  subelement.value
                                                              )
                                                            : subelement.description
                                                    )
                                                }, [subelement.value, current])
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
                                                                    if (
                                                                        subelement.ispin
                                                                    ) {
                                                                        removeUsedPin(
                                                                            subelement.value
                                                                        )
                                                                        addUsedPin(
                                                                            val
                                                                        )
                                                                        console.log(
                                                                            usedPinsList.current
                                                                        )
                                                                    }
                                                                    subelement.value =
                                                                        val

                                                                    setHelp(
                                                                        options
                                                                            ? getHelp(
                                                                                  optionsList,
                                                                                  val
                                                                              )
                                                                            : subelement.description
                                                                    )
                                                                }
                                                                setvalidation(
                                                                    generateValidation(
                                                                        subelement
                                                                    )
                                                                )
                                                            }}
                                                            validation={
                                                                validation
                                                            }
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
                    <NavButtons previous={previous} next={next} />
                    <br />
                </div>
            )}
        </div>
    )
}

export { StepTab }
