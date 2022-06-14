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
import { useDatasContext, useUiContext } from "../../contexts"
import { ArrowLeft, ArrowRight } from "preact-feather"

const getHelp = (item, value) => {
    return item[
        item.findIndex((element) => {
            return element.value == value
        })
    ].help
}

const StepTab = ({ previous, current, next }) => {
    const { configuration } = useDatasContext()
    console.log(current)
    return (
        <div id={current} class="m-2">
            <div class="center">
                {configuration.current[current] &&
                    configuration.current[current].map((element, index) => {
                        if (element.type === "group") {
                            return (
                                <FieldGroup
                                    id={element.id}
                                    label={T(element.label)}
                                >
                                    {element.value.map(
                                        (subelement, subindex) => {
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
                                            const [help, setHelp] = useState(
                                                getHelp(options, value)
                                            )
                                            return (
                                                <Fragment>
                                                    <Field
                                                        inline
                                                        className="fit-content"
                                                        label={T(label)}
                                                        options={options}
                                                        value={value}
                                                        type={type}
                                                        {...rest}
                                                        setValue={(
                                                            val,
                                                            update = false
                                                        ) => {
                                                            if (!update) {
                                                                subelement.value =
                                                                    val
                                                                setHelp(
                                                                    getHelp(
                                                                        options,
                                                                        val
                                                                    )
                                                                )
                                                            }
                                                            /*setvalidation(
                                                                                            generateValidation(
                                                                                                subFieldData
                                                                                            )
                                                                                        )*/
                                                        }}
                                                    />
                                                    {help && <div>{help}</div>}
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
