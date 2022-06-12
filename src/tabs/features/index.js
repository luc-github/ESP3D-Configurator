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
import { FieldGroup, Field } from "../../components/Controls"
import { T } from "../../components/Translations"
import { useDatasContext, useUiContext } from "../../contexts"

const FeaturesTab = () => {
    const { configuration } = useDatasContext()
    console.log("feature")
    return (
        <div id="features">
            <div class="center">
                {configuration.current.features.map((element, index) => {
                    if (element.type === "group") {
                        return (
                            <FieldGroup
                                id={element.id}
                                label={T(element.label)}
                            >
                                {element.value.map((subelement, subindex) => {
                                    if (
                                        typeof subelement.initial ===
                                        "undefined"
                                    )
                                        subelement.initial = subelement.value
                                    const { label, initial, type, ...rest } =
                                        subelement
                                    return (
                                        <Field
                                            label={T(label)}
                                            type={type}
                                            {...rest}
                                            setValue={(val, update = false) => {
                                                if (!update) {
                                                    subelement.value = val
                                                }
                                                /*setvalidation(
                                                                                            generateValidation(
                                                                                                subFieldData
                                                                                            )
                                                                                        )*/
                                            }}
                                        />
                                    )
                                })}
                            </FieldGroup>
                        )
                    } else {
                        return <Fragment>{element.label}</Fragment>
                    }
                })}
                <br />
            </div>
        </div>
    )
}

export { FeaturesTab }
