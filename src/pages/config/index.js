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
import { FeaturesTab } from "../../tabs/features"
import { NetworkTab } from "../../tabs/network"
import { FilesystemsTab } from "../../tabs/filesystems"
import { DevicesTab } from "../../tabs/devices"
import { GenerateTab } from "../../tabs/generate"
import { TabBar } from "../../components/TabBar"
import { T } from "../../components/Translations"

const routes = {
    FEATURES: {
        component: <FeaturesTab />,
        path: "/config/features",
    },
    NETWORK: {
        component: <NetworkTab />,
        path: "/config/network",
    },
    FILESYSTEMS: {
        component: <FilesystemsTab />,
        path: "/config/filesystems",
    },
    DEVICES: {
        component: <DevicesTab />,
        path: "/config/devices",
    },
    GENERATE: {
        component: <GenerateTab />,
        path: "/config/generate",
    },
}

const Config = () => {

    return (
        <div id="settings" class="container">
            <TabBar />
            <Router routesList={routes} localDefault={"/config/features"} />
        </div>
    )
}

export default Config
