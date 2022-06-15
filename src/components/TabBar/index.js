/*
TabBar.js - ESP3D WebUI Tabs bar file

 Copyright (c) 2021 Luc Lebosse. All rights reserved.
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
import { Link } from "../Router"
import { T } from "../Translations"
import { AppLogo } from "../Images/logo"
import { useUiContext, useUiContextFn } from "../../contexts"
import {
    Camera,
    Download,
    HardDrive,
    Tool,
    Wifi,
    Lock,
    Upload,
} from "preact-feather"

/*
 * Local const
 *
 */
const defaultLinks = [
    {
        label: "Features",
        icon: <AppLogo height="24px" />,
        href: "/config/features",
        id: "featuresLink",
    },
    {
        label: "Network",
        icon: <Wifi />,
        href: "/config/network",
        id: "networkLink",
    },
    {
        label: "Filesystems",
        icon: <HardDrive />,
        href: "/config/filesystems",
        id: "filesystemsLink",
    },
    {
        label: "Update",
        icon: <Upload />,
        href: "/config/update",
        id: "updateLink",
    },
    {
        label: "Devices",
        icon: <Camera />,
        href: "/config/devices",
        id: "devicesLink",
    },

    {
        label: "Security",
        icon: <Lock />,
        href: "/config/security",
        id: "securityLink",
    },
    {
        label: "Others",
        icon: <Tool />,
        href: "/config/others",
        id: "othersLink",
    },
    {
        label: "Download",
        icon: <Download />,
        href: "/config/generate",
        id: "generateLink",
    },
]
const TabBar = () => {
    const { uisettings } = useUiContext()
    return (
        <ul class="tab tab-block">
            {defaultLinks &&
                defaultLinks.map(({ label, icon, href, id }) => {
                    return (
                        <li class="tab-item">
                            <Link
                                id={id}
                                className="btn btn-link no-box feather-icon-container"
                                activeClassName="active"
                                href={href}
                                onclick={(e) => {
                                    //TBD
                                }}
                            >
                                {icon}
                                <label class="hide-low">{T(label)}</label>
                            </Link>
                        </li>
                    )
                })}
        </ul>
    )
}

export { TabBar }
