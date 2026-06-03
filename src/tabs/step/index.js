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
} from "../../contexts"
import { canShowField } from "../../configuration/visibility"
import { validateField } from "../../configuration/validateField"
import { buildReservedLists } from "../../configuration/reservedResources"
import { resolveEffectivePin } from "../../configuration/pinConflicts"
import { isPinOptionAllowed } from "../../configuration/pinCapabilities"
import { setFieldValueById } from "../../configuration/applyBoardPreset"
import {
    CAMERA_PIN_KEYS,
    isCustomCameraModel,
    syncCameraPinsForModel,
} from "../../configuration/cameraPins"
import { ArrowLeft, ArrowRight, Info } from "preact-feather"
import { BoardPresetPicker } from "../../components/BoardPresetPicker"

import pinsList from "./pins.json"
import portsList from "./ports.json"

const mergeListOptions = (list, options) => {
    if (list) {
        const newList = JSON.parse(JSON.stringify(list))
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

const getOptionsList = (subelement, options) => {
    if (subelement.ispin) {
        if (subelement.usedefault) {
            return JSON.parse(
                JSON.stringify(mergeListOptions(pinsList, options)).replaceAll(
                    "None",
                    "Default"
                )
            )
        }
        return mergeListOptions(pinsList, options)
    }
    if (subelement.isport) {
        if (subelement.usedefault) {
            return JSON.parse(
                JSON.stringify(mergeListOptions(portsList, options)).replaceAll(
                    "None",
                    "Default"
                )
            )
        }
        return mergeListOptions(portsList, options)
    }
    return options
}

const annotateDefaultPinLabels = (subelement, optionsList) => {
    if (!optionsList || !subelement.ispin || !subelement.usedefault) {
        return optionsList
    }
    const effective = resolveEffectivePin(
        { ...subelement, value: "-1" },
        useDatasContextFn.getValueId
    )
    if (!effective) return optionsList
    return optionsList.map((opt) =>
        opt.value == "-1" ? { ...opt, label: `-1 (${effective})` } : opt
    )
}

const canshow = (depend, value, currentvalue, list) =>
    canShowField(depend, useDatasContextFn.getValueId, {
        resourceValue: value,
        currentResourceValue: currentvalue,
        reservedList: list,
    })

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

const StepField = ({
    subelement,
    current,
    configuration,
    generateValidation,
    onFieldChange,
}) => {
    if (!canshow(subelement.depend)) return null
    const reserved = buildReservedLists(
        configuration,
        useDatasContextFn.getValueId,
        subelement.id
    )
    const pinList = { current: reserved.pins }
    const portList = { current: reserved.ports }
    if (typeof subelement.initial === "undefined") {
        subelement.initial = subelement.value
    }
    const { label, initial, type, options, value, ...rest } = subelement
    const optionsList = annotateDefaultPinLabels(
        subelement,
        getOptionsList(subelement, options)
    )
    const filteredOptions = optionsList
        ? optionsList.filter((opt) => {
              if (
                  !canshow(
                      opt.depend,
                      subelement.ispin || subelement.isport ? opt.value : null,
                      subelement.ispin || subelement.isport
                          ? subelement.value
                          : null,
                      subelement.ispin ? pinList : subelement.isport ? portList : null
                  )
              ) {
                  return false
              }
              if (
                  subelement.ispin &&
                  (subelement.pinRole ||
                      CAMERA_PIN_KEYS.includes(subelement.id))
              ) {
                  return isPinOptionAllowed(
                      subelement,
                      opt.value,
                      useDatasContextFn.getValueId
                  )
              }
              return true
          })
        : null
    if (
        filteredOptions &&
        filteredOptions.findIndex((op) => op.value == subelement.value) == -1
    ) {
        subelement.value = filteredOptions[0].value
        onFieldChange()
    }
    const [help, setHelp] = useState(
        subelement.options
            ? getHelp(optionsList, subelement.value)
            : subelement.description
    )
    const [validation, setvalidation] = useState()
    const cameraModel = useDatasContextFn.getValueId("cameratype")
    const cameraPinReadOnly =
        CAMERA_PIN_KEYS.includes(subelement.id) &&
        !isCustomCameraModel(cameraModel)
    const showFootnote =
        subelement.footnote &&
        (!subelement.footnoteWhenActive || subelement.value === true)

    useEffect(() => {
        setHelp(
            optionsList ? getHelp(optionsList, subelement.value) : subelement.description
        )
    }, [subelement.value, current])

    return (
        <Fragment>
            <Field
                inline
                className="fit-content"
                label={T(label)}
                options={filteredOptions}
                value={value}
                type={type}
                disabled={cameraPinReadOnly}
                {...rest}
                validationfn={generateValidation}
                setValue={(val, update = false) => {
                    if (!update) {
                        subelement.value = val
                        if (subelement.id === "cameratype" && configuration) {
                            if (val != "-1") {
                                setFieldValueById(configuration, "has_psram", true)
                                syncCameraPinsForModel(configuration, val)
                            }
                        }
                        onFieldChange()
                        setHelp(
                            options
                                ? getHelp(optionsList, val)
                                : subelement.description
                        )
                    }
                    setvalidation(generateValidation(subelement))
                }}
                validation={validation}
            />
            {help && <div class="m-1">{help}</div>}
            {subelement.usedescforoptions && (
                <div class="m-1">{subelement.description}</div>
            )}
            {showFootnote && (
                <div class="m-1 field-footnote" role="note">
                    <Info size={16} class="field-footnote-icon" aria-hidden="true" />
                    <span>{subelement.footnote}</span>
                </div>
            )}
            <div class="m-1 divider" style="border-color: #dadee4" />
        </Fragment>
    )
}

const StepTab = ({ previous, current, next }) => {
    const { configuration, configRevision } = useDatasContext()
    const [reserveVersion, setReserveVersion] = useState(0)
    const bumpFieldTree = () => {
        setReserveVersion((version) => version + 1)
    }
    const generateValidation = (fieldData) =>
        validateField(
            fieldData,
            useDatasContextFn.getValueId,
            configuration.current
        )
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(false)
    }, [])
    useEffect(() => {
        bumpFieldTree()
    }, [current])
    return (
        <div id={current} class="m-2">
            {isLoading && <Loading large />}
            {!isLoading && (
                <div class="center">
                    <NavButtons previous={previous} next={next} />
                    {current === "features" && (
                        <BoardPresetPicker onApplied={bumpFieldTree} />
                    )}
                    {configuration.current[current] &&
                        configuration.current[current].map((element, index) => {
                            if (element.type === "group") {
                                if (!canshow(element.depend)) return null

                                return (
                                    <FieldGroup
                                        key={`${element.id}-${reserveVersion}-${configRevision}`}
                                        id={element.id}
                                        label={T(element.label)}
                                    >
                                        {element.value.map((subelement, subindex) => (
                                            <StepField
                                                key={`${element.id}-${subindex}-${subelement.id || "field"}-${reserveVersion}-${configRevision}`}
                                                subelement={subelement}
                                                current={current}
                                                configuration={configuration.current}
                                                generateValidation={generateValidation}
                                                onFieldChange={bumpFieldTree}
                                            />
                                        ))}
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
