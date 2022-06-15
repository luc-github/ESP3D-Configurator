/*
 DatasContext.js - ESP3D WebUI context file

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
import { h, createContext } from "preact"
import { useRef, useContext, useState } from "preact/hooks"
import defaultConfiguration from "../configuration.json"

/*
 * Local const
 *
 */
const useDatasContextFn = {}
const DatasContext = createContext("DatasContext")
const useDatasContext = () => useContext(DatasContext)

const DatasContextProvider = ({ children }) => {
    const configuration = useRef(defaultConfiguration)
    const getValue = (section, group, item) => {
        const groupelement =
            configuration.current[section][
                configuration.current[section].findIndex((e) => e.id === group)
            ]

        return groupelement.value[
            groupelement.value.findIndex((e) => e.id === item)
        ].value
    }
    const getValueId = (Id) => {
        if (!Id) return undefined
        const settingsobject = configuration.current
        if (settingsobject) {
            for (let key in settingsobject) {
                if (Array.isArray(settingsobject[key])) {
                    for (
                        let index = 0;
                        index < settingsobject[key].length;
                        index++
                    ) {
                        if (settingsobject[key][index].id == Id) {
                            return settingsobject[key][index].value
                        }
                        if (Array.isArray(settingsobject[key][index].value)) {
                            for (
                                let subindex = 0;
                                subindex <
                                settingsobject[key][index].value.length;
                                subindex++
                            ) {
                                if (
                                    settingsobject[key][index].value[subindex]
                                        .id == Id
                                ) {
                                    return settingsobject[key][index].value[
                                        subindex
                                    ].value
                                }
                            }
                        }
                    }
                } else {
                    for (let subkey in settingsobject[key]) {
                        if (Array.isArray(settingsobject[key][subkey])) {
                            for (
                                let index = 0;
                                index < settingsobject[key][subkey].length;
                                index++
                            ) {
                                if (
                                    settingsobject[key][subkey][index].id == Id
                                ) {
                                    return settingsobject[key][subkey][index]
                                        .value
                                }
                            }
                        }
                    }
                }
            }
        }
        return undefined
    }
    useDatasContextFn.getValue = getValue
    useDatasContextFn.getValueId = getValueId
    const store = {
        configuration,
    }

    return (
        <DatasContext.Provider value={store}>{children}</DatasContext.Provider>
    )
}

export { DatasContextProvider, useDatasContext, useDatasContextFn }
