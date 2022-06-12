/*
 main.js - ESP3D WebUI MainPage file

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

import { useState, useEffect, useRef } from "preact/hooks"
import { Router } from "../components/Router"
import { useUiContext} from "../contexts"
import About from "../pages/about"
import Config from "../pages/config"


import { FooterContainer } from "./footer"

const defRoutes = {
    ABOUT: {
        component: <About />,
        path: "/about",
    },
    Config: {
        component: <Config />,
        path: "/config",
    },
}

const MainContainer = () => {
    const { uisettings, modals } = useUiContext()
    const [routes, setRoutes] = useState({ ...defRoutes })
    return (
        <div id="main" class="main-page-container">
            <Router routesList={routes} />
            <FooterContainer />
        </div>
    )
}

export { MainContainer }
