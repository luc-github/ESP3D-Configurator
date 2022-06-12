/*
 logo.js - ESP3D logo file

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

import { h } from "preact"

/*
 *ESP3D Logo
 * default height is 50px
 */
const AppLogo = ({
    height = "50px",
    color = "currentColor",
    bgcolor = "white",
}) => {
            return (
            <svg
                height={height}
                viewBox="22 56 240 180"
                fill={bgcolor}
                stroke={color}
                class="esp3dlogo"
            >
                <path d="m 227,91.9 -97,-0.3 0,100.4 83,0 c 20,0 46,-6 47,-36 l 0,-24 c 1,-20 -13,-40 -33,-40.1 z" />
                <path
                    fill={color}
                    stroke={bgcolor}
                    d="M79.7,200.2h124c-15.5,16.5-37.6,26.7-62,26.7S95.3,216.7,79.7,200.2z"
                />
                <path
                    fill={color}
                    stroke={bgcolor}
                    d="M203.7,83.2h-124c15.5-16.5,37.6-26.7,62-26.7S188.2,66.8,203.7,83.2z"
                />
                <path
                    fill={color}
                    stroke={bgcolor}
                    d="M200.3,152.7c0,2.7-0.5,5-1.5,7.1s-2.4,3.8-4.2,5.2c-1.8,1.4-4,2.5-6.5,3.2c-2.5,0.7-5.3,1.1-8.3,1.1c-1.8,0-3.5-0.1-5.1-0.4c-1.6-0.3-3-0.6-4.2-1c-1.2-0.4-2.2-0.8-3-1.2c-0.8-0.4-1.3-0.7-1.6-0.9c-0.2-0.2-0.4-0.5-0.6-0.7c-0.1-0.3-0.2-0.6-0.3-1c-0.1-0.4-0.2-0.8-0.2-1.4c0-0.6-0.1-1.2-0.1-2c0-1.3,0.1-2.2,0.3-2.7c0.2-0.5,0.5-0.8,1-0.8c0.3,0,0.7,0.2,1.4,0.6c0.7,0.4,1.5,0.8,2.6,1.2c1,0.4,2.3,0.8,3.7,1.2c1.4,0.4,3,0.6,4.8,0.6c1.5,0,2.8-0.2,4-0.5c1.2-0.4,2.1-0.9,2.9-1.5c0.8-0.6,1.4-1.4,1.8-2.3c0.4-0.9,0.6-1.9,0.6-3.1c0-1.2-0.2-2.3-0.7-3.3c-0.5-1-1.2-1.8-2.1-2.5c-0.9-0.7-2.1-1.2-3.6-1.6c-1.4-0.4-3.1-0.6-5.1-0.6h-4.6c-0.4,0-0.7,0-0.9-0.1c-0.2-0.1-0.5-0.3-0.6-0.6c-0.2-0.3-0.3-0.7-0.3-1.3c-0.1-0.5-0.1-1.2-0.1-2.1c0-0.8,0-1.4,0.1-2c0.1-0.5,0.2-0.9,0.3-1.2c0.2-0.3,0.3-0.5,0.6-0.6c0.2-0.1,0.5-0.2,0.8-0.2h4.6c1.6,0,3-0.2,4.2-0.6c1.2-0.4,2.3-0.9,3.1-1.6c0.8-0.7,1.5-1.5,1.9-2.5c0.4-1,0.7-2,0.7-3.2c0-0.9-0.2-1.8-0.5-2.6c-0.3-0.8-0.7-1.5-1.3-2.1c-0.6-0.6-1.3-1.1-2.3-1.4c-0.9-0.3-2-0.5-3.3-0.5c-1.4,0-2.8,0.2-4,0.6c-1.3,0.4-2.4,0.9-3.4,1.4c-1,0.5-1.8,1-2.5,1.4c-0.7,0.4-1.2,0.7-1.5,0.7c-0.2,0-0.4,0-0.6-0.1c-0.2-0.1-0.3-0.3-0.4-0.6c-0.1-0.3-0.2-0.7-0.2-1.2c-0.1-0.5-0.1-1.2-0.1-2c0-0.7,0-1.3,0-1.7c0-0.5,0.1-0.8,0.2-1.1c0.1-0.3,0.2-0.6,0.3-0.8c0.1-0.2,0.3-0.5,0.6-0.7c0.3-0.3,0.8-0.7,1.7-1.2c0.8-0.5,1.9-1,3.2-1.5c1.3-0.5,2.8-0.9,4.5-1.3c1.7-0.3,3.5-0.5,5.5-0.5c2.6,0,4.9,0.3,6.8,0.9c2,0.6,3.7,1.5,5,2.6c1.4,1.1,2.4,2.5,3.1,4.2c0.7,1.7,1,3.5,1,5.6c0,1.6-0.2,3.1-0.6,4.5c-0.4,1.4-1,2.6-1.8,3.7c-0.8,1.1-1.8,2-3,2.8c-1.2,0.8-2.6,1.3-4.1,1.7v0.1c1.9,0.2,3.5,0.7,5,1.4c1.5,0.7,2.7,1.6,3.8,2.7c1,1.1,1.8,2.3,2.4,3.7C200,149.7,200.3,151.2,200.3,152.7z"
                />
                <path
                    fill={color}
                    stroke={bgcolor}
                    d="M249.6,141c0,4.9-0.6,9-1.9,12.5c-1.3,3.5-3.1,6.3-5.5,8.5c-2.4,2.2-5.3,3.8-8.7,4.8c-3.4,1-7.5,1.5-12.2,1.5h-12.7c-0.9,0-1.7-0.3-2.3-0.8c-0.6-0.5-0.9-1.4-0.9-2.6v-46.4c0-1.2,0.3-2.1,0.9-2.6c0.6-0.5,1.4-0.8,2.3-0.8h13.6c4.7,0,8.8,0.6,12.1,1.7c3.3,1.1,6.1,2.8,8.3,4.9c2.3,2.2,4,4.9,5.2,8.1C249,133,249.6,136.7,249.6,141z M238.5,141.3c0-2.5-0.3-4.9-0.9-7c-0.6-2.2-1.5-4-2.8-5.6c-1.3-1.6-3-2.8-5-3.7c-2-0.9-4.7-1.3-8-1.3h-5.5v36.2h5.6c3,0,5.5-0.4,7.5-1.2c2-0.8,3.7-1.9,5.1-3.5c1.4-1.5,2.4-3.5,3-5.8C238.1,147.1,238.5,144.4,238.5,141.3z"
                />
                <path
                    fill={color}
                    stroke={bgcolor}
                    d="M222.1,90.3h-34.9H61.4c-21.5,0-39,17.5-39,39v24.9c0,21.5,17.5,39,39,39h68.4h92.3c21.5,0,39-17.5,39-39v-24.9C261.1,107.8,243.6,90.3,222.1,90.3z M155.1,179.4c5-7,4.9-16.5,4.9-16.5v-42.5c0-15,12.2-27.2,27.2-27.2h34.9c19.8,0,36,16.1,36,36v24.9c0,19.8-16.1,36-36,36h-79.2C142.9,190.2,149.6,187.2,155.1,179.4z"
                />
                <path d="M69.7,164.1c0,0.8,0,1.5-0.1,2c-0.1,0.5-0.2,1-0.3,1.3c-0.1,0.3-0.3,0.6-0.5,0.7c-0.2,0.2-0.4,0.2-0.7,0.2H41.4c-0.9,0-1.7-0.3-2.3-0.8c-0.6-0.5-0.9-1.4-0.9-2.6v-46.4c0-1.2,0.3-2.1,0.9-2.6c0.6-0.5,1.4-0.8,2.3-0.8H68c0.2,0,0.5,0.1,0.7,0.2c0.2,0.1,0.4,0.4,0.5,0.7c0.1,0.3,0.2,0.8,0.3,1.3c0.1,0.5,0.1,1.2,0.1,2c0,0.8,0,1.4-0.1,2c-0.1,0.5-0.2,1-0.3,1.3c-0.1,0.3-0.3,0.6-0.5,0.7c-0.2,0.2-0.4,0.2-0.7,0.2H49v13H65c0.2,0,0.5,0.1,0.7,0.2c0.2,0.2,0.4,0.4,0.5,0.7c0.1,0.3,0.2,0.7,0.3,1.3c0.1,0.5,0.1,1.2,0.1,2c0,0.8,0,1.5-0.1,2c-0.1,0.5-0.2,0.9-0.3,1.3c-0.1,0.3-0.3,0.5-0.5,0.7c-0.2,0.1-0.4,0.2-0.7,0.2H49v15h19.2c0.2,0,0.5,0.1,0.7,0.2c0.2,0.2,0.4,0.4,0.5,0.7c0.1,0.3,0.2,0.8,0.3,1.3C69.7,162.6,69.7,163.3,69.7,164.1z" />
                <path d="M109.4,152.4c0,2.8-0.5,5.2-1.6,7.4c-1,2.1-2.5,3.9-4.2,5.3c-1.8,1.4-3.9,2.5-6.2,3.2c-2.4,0.7-4.9,1.1-7.6,1.1c-1.8,0-3.5-0.2-5.1-0.5c-1.6-0.3-3-0.7-4.2-1.1c-1.2-0.4-2.2-0.9-3-1.3c-0.8-0.5-1.4-0.9-1.7-1.2c-0.4-0.4-0.6-0.9-0.8-1.5c-0.2-0.7-0.2-1.6-0.2-2.9c0-0.8,0-1.6,0.1-2.1c0.1-0.6,0.1-1,0.3-1.4c0.1-0.4,0.3-0.6,0.5-0.8c0.2-0.2,0.4-0.2,0.7-0.2c0.4,0,0.9,0.2,1.6,0.7c0.7,0.5,1.6,1,2.7,1.5c1.1,0.5,2.4,1,3.9,1.5c1.5,0.5,3.3,0.7,5.3,0.7c1.3,0,2.5-0.2,3.5-0.5c1-0.3,1.9-0.8,2.7-1.3c0.7-0.6,1.3-1.3,1.7-2.1c0.4-0.8,0.6-1.8,0.6-2.8c0-1.2-0.3-2.2-1-3.1c-0.7-0.9-1.5-1.6-2.6-2.3c-1.1-0.7-2.3-1.3-3.6-1.9c-1.3-0.6-2.7-1.2-4.2-1.9c-1.4-0.7-2.8-1.4-4.2-2.2c-1.3-0.8-2.5-1.8-3.6-3c-1.1-1.2-1.9-2.5-2.6-4.1c-0.7-1.6-1-3.5-1-5.7c0-2.5,0.5-4.8,1.4-6.7c0.9-1.9,2.2-3.5,3.8-4.8c1.6-1.3,3.5-2.2,5.7-2.9c2.2-0.6,4.5-0.9,6.9-0.9c1.3,0,2.5,0.1,3.8,0.3c1.3,0.2,2.4,0.5,3.5,0.8c1.1,0.3,2.1,0.7,2.9,1.1c0.8,0.4,1.4,0.8,1.7,1c0.3,0.3,0.5,0.5,0.6,0.7c0.1,0.2,0.2,0.4,0.2,0.8c0.1,0.3,0.1,0.7,0.1,1.2c0,0.5,0,1.1,0,1.8c0,0.8,0,1.5-0.1,2c0,0.5-0.1,1-0.2,1.4c-0.1,0.4-0.2,0.6-0.4,0.8c-0.2,0.2-0.4,0.2-0.7,0.2c-0.3,0-0.8-0.2-1.4-0.6c-0.7-0.4-1.5-0.8-2.4-1.3c-1-0.5-2.1-0.9-3.3-1.2c-1.3-0.4-2.6-0.6-4.2-0.6c-1.2,0-2.2,0.1-3.1,0.4c-0.9,0.3-1.6,0.7-2.2,1.2c-0.6,0.5-1,1.1-1.3,1.8c-0.3,0.7-0.4,1.5-0.4,2.3c0,1.2,0.3,2.2,1,3.1c0.6,0.9,1.5,1.6,2.6,2.3c1.1,0.7,2.3,1.3,3.7,1.9c1.4,0.6,2.8,1.2,4.2,1.9c1.4,0.7,2.8,1.4,4.2,2.2c1.4,0.8,2.6,1.8,3.7,3c1.1,1.2,1.9,2.5,2.6,4.1C109.1,148.4,109.4,150.2,109.4,152.4z" />
                <path d="M151.4,131.2c0,3-0.5,5.6-1.4,7.9c-0.9,2.3-2.3,4.2-4.1,5.8c-1.8,1.6-4,2.8-6.6,3.6c-2.6,0.8-5.6,1.2-9.1,1.2h-4.4v17c0,0.3-0.1,0.5-0.3,0.7c-0.2,0.2-0.5,0.4-0.9,0.5c-0.4,0.1-1,0.2-1.6,0.3c-0.7,0.1-1.6,0.1-2.6,0.1c-1,0-1.9,0-2.6-0.1c-0.7-0.1-1.3-0.2-1.7-0.3c-0.4-0.1-0.7-0.3-0.9-0.5c-0.2-0.2-0.2-0.5-0.2-0.7v-47.8c0-1.3,0.3-2.3,1-2.9c0.7-0.6,1.6-1,2.7-1h12.5c1.3,0,2.5,0,3.6,0.1c1.1,0.1,2.5,0.3,4.1,0.6c1.6,0.3,3.2,0.9,4.8,1.7c1.6,0.8,3,1.9,4.2,3.2c1.2,1.3,2,2.8,2.6,4.6C151.1,127.1,151.4,129,151.4,131.2z M140.1,132c0-1.9-0.3-3.4-1-4.6c-0.7-1.2-1.5-2.1-2.4-2.7c-1-0.6-2-0.9-3-1.1c-1.1-0.2-2.1-0.2-3.3-0.2h-4.6v18h4.8c1.7,0,3.2-0.2,4.3-0.7c1.2-0.5,2.1-1.1,2.9-2c0.7-0.8,1.3-1.8,1.7-3C139.9,134.6,140.1,133.3,140.1,132z" />
            </svg>
        )
}

export { AppLogo }
