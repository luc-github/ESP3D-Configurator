/*
 Navbar.js - ESP3D WebUI navigation bar file


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
import { Fragment, h } from "preact"
import { Settings } from "preact-feather"
import { AppLogo } from "../Images/logo"
import { Link } from "../Router"
import { T } from "../Translations"


/*
 * Local const
 *
 */
const defaultLinks = [
    {
        label: <AppLogo bgcolor="#ffffff" />,
        icon: null,
        href: "/about",
    },
    {
        label: "Configurator",
        icon: <Settings/>,
        href: "/config",
        id:"connfigLink"
    },
   
]

const Navbar = () => {

        return (
            <header class="navbar">
                <section class="navbar-section">
                    {defaultLinks &&
                        defaultLinks.map(({ label, icon, href, id }) => {
                            return (
                                <Link
                                    onclick={(e) => {
                                        //TBD
                                        }}
                                    id={id}
                                    className={
                                        href == "/about"
                                            ? "navbar-brand logo no-box "
                                            : "btn btn-link no-box feather-icon-container"
                                    }
                                    activeClassName="active"
                                    href={href}
                                >
                                    {icon}
                                    <label
                                        class={
                                            href == "/about" ? "" : "hide-low"
                                        }
                                    >
                                        {T(label)}
                                    </label>
                                </Link>
                            )
                        })}
                </section>

            </header>
        )

}

export { Navbar }
