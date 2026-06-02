/*
 settings.js - ESP3D WebUI navigation page file

 Copyright (c) 2020 Luc Lebosse. All rights reserved.
 Original code inspiration : 2021 Alexandre Aussourd

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
import { Router } from "../../components/Router"
import { StepTab } from "../../tabs/step"
import { GenerateTab } from "../../tabs/generate"
import { TabBar } from "../../components/TabBar"
import { configTabs } from "./steps"

const routes = configTabs.reduce((acc, tab, index) => {
    const previous = index > 0 ? configTabs[index - 1].id : undefined
    const next =
        index < configTabs.length - 1 ? configTabs[index + 1].id : undefined

    acc[tab.key] = {
        component:
            tab.type === "generate" ? (
                <GenerateTab previous={previous} />
            ) : (
                <StepTab
                    current={tab.section}
                    previous={previous}
                    next={next}
                />
            ),
        path: tab.route,
    }
    return acc
}, {})

const Config = () => {
    return (
        <div id="settings" class="container">
            <TabBar />
            <Router routesList={routes} localDefault={"/config/features"} />
        </div>
    )
}

export default Config
