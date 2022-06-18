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

import { T } from "../../components/Translations"
import { ButtonImg } from "../../components/Controls"
import { Save, ArrowLeft, Eye } from "preact-feather"
import {
    useDatasContext,
    useUiContext,
    useDatasContextFn,
} from "../../contexts"
import header from "./header"
import footer from "./footer"
import { Version } from "../../components/App/version"
import { useEffect, useState } from "preact/hooks"

const configurationFile = (data) => {
    return (
        `// This file was generated by ESP3D-Configurator V${Version} \n` +
        header +
        convertToText(data) +
        footer
    )
}

const sectionFormated = (title, description) => {
    return `\n/************************************\n*\n* ${title}\n*\n* ${description}\n*\n************************************/\n`
}

const getLabel = (item, value) => {
    if (item) {
        const index = item.findIndex((element) => {
            return element.value == value
        })
        if (index > -1) return item[index].label
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
        if (pinvalue == currentvalue && canshow(depend)) return true
        if (usedPinsList.current.includes(pinvalue)) return false
    }
    if (depend) {
        const val = useDatasContextFn.getValueId(depend.id)
        if (depend.value) {
            return depend.value.includes(val)
        }
        if (depend.notvalue) {
            return !depend.notvalue.includes(val)
        }
    }
    return true
}

const convertToText = (data) => {
    let config = ""
    return Object.keys(data).reduce((acc, item) => {
        return data[item].reduce((acc2, item2) => {
            if (item2.type == "group") {
                const content = item2.value.reduce((acc3, element) => {
                    if (!canshow(element.depend)) return acc3
                    if (element.setting) {
                        if (
                            element.value == "-1" ||
                            (!element.value && element.disableiffalse)
                        )
                            return acc3
                        if (element.type == "select") {
                            const help = getHelp(element.options, element.value)
                            const label = getLabel(
                                element.options,
                                element.value
                            )

                            return (
                                acc3 +
                                `\n// ${element.label}\n` +
                                `${
                                    help
                                        ? "// " + help + "\n"
                                        : label
                                        ? "// " + label + "\n"
                                        : ""
                                }` +
                                `${
                                    element.usedescforoptions
                                        ? "// " + element.description + "\n"
                                        : ""
                                }` +
                                `#define ${element.define} ${element.value}\n`
                            )
                        }
                        if (element.type == "boolean") {
                            return (
                                acc3 +
                                `\n// ${element.label}\n` +
                                `// ${element.description}\n` +
                                `#define ${element.define} ${element.value}\n`
                            )
                        }
                        if (element.type == "text") {
                            return (
                                acc3 +
                                `\n// ${element.label}\n` +
                                `// ${element.description}\n` +
                                `#define ${element.define} ${element.value}\n`
                            )
                        }
                    } else {
                        return (
                            acc3 +
                            `// ${element.label}=${getLabel(
                                element.options,
                                element.value
                            )}\n`
                        )
                    }
                }, "")
                return content.length == 0
                    ? acc2
                    : acc2 +
                          sectionFormated(item2.label, item2.description) +
                          content
            } else {
                console.log("Group definition is missing for " + item2.label)
            }
        }, acc)
    }, config)
}

const exportFile = (filecontent, filename) => {
    const file = new Blob([filecontent], {
        type: "application/txt",
    })
    if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename)
    else {
        // Others
        const a = document.createElement("a")
        const url = URL.createObjectURL(file)
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        setTimeout(function () {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        }, 0)
    }
}

let showconfig = false

const NavButtons = ({ previous, next }) => {
    const { configuration } = useDatasContext()
    return (
        <div style="display:flex;justify-content:space-around">
            {previous && (
                <ButtonImg
                    m2
                    icon={<ArrowLeft />}
                    label="Previous"
                    onclick={() => {
                        if (document.getElementById(previous)) {
                            document.getElementById(previous).click()
                        }
                    }}
                />
            )}
            <ButtonImg
                m2
                icon={<Save />}
                label={T("Download configuration.h")}
                onclick={() => {
                    exportFile(
                        configurationFile(configuration.current),
                        "configuration.h"
                    )
                }}
            />
            <ButtonImg
                m2
                icon={<Eye />}
                label={T("Download WebUI")}
                onclick={() => {
                    const targetfw = useDatasContextFn.getValue(
                        "features",
                        "targetFW",
                        "defaultfw"
                    )
                    const targetFwName = {
                        MARLIN: "Marlin",
                        GRBL: "GRBL",
                        REPETIER: "Repetier",
                        SMOOTHIEWARE: "Smoothieware",
                    }
                    const targetsystem = useDatasContextFn.getValue(
                        "features",
                        "targetFW",
                        "systemtype"
                    )
                    if (targetfw == "UNKNOWN_FW") {
                        window.open(
                            "https://github.com/luc-github/ESP3D-WEBUI/tree/3.0/dist/",
                            "_blank"
                        )
                    } else {
                        window.open(
                            `https://github.com/luc-github/ESP3D-WEBUI/blob/3.0/dist/${targetsystem}/${targetFwName[targetfw]}/index.html.gz?raw=true`,
                            "_blank"
                        )
                    }
                }}
            />
        </div>
    )
}

const GenerateTab = ({ previous }) => {
    const { configuration } = useDatasContext()
    const [showContent, setshowContent] = useState(showconfig)
    return (
        <div id="generate" class="m-2">
            <NavButtons previous={previous} />
            <div class="accordion">
                <input
                    type="checkbox"
                    id="accordion-1"
                    name="accordion-checkbox"
                    hidden
                />
                <label
                    class="accordion-header"
                    for="accordion-1"
                    style="cursor:pointer"
                    onclick={() => {
                        showconfig = !showconfig
                        setshowContent(showconfig)
                    }}
                >
                    {!showContent && <i class="icon icon-arrow-right mr-1"></i>}
                    {showContent && <i class="icon icon-arrow-down mr-1"></i>}
                    Configuration.h
                </label>
                {showContent && (
                    <div class="accordion-body">
                        <code>
                            <pre>
                                {configurationFile(configuration.current)}
                            </pre>
                        </code>
                    </div>
                )}
            </div>

            {showContent && <NavButtons previous={previous} />}
            <br />
        </div>
    )
}

export { GenerateTab }
