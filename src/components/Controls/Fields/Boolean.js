/*
 Boolean.js - ESP3D WebUI component file

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

import { h } from "preact"
import { useEffect } from "preact/hooks"

/*
 * Local const
 *
 */
const Boolean = ({
    id,
    label,
    validation,
    value = false,
    type,
    depend,
    setValue,
    inline,
    ...rest
}) => {
    const inputCheckboxProps = {
        name: id,
        id,
        checked: value,
        ...rest,
    }

    const onChange = (e) => {
        if (setValue) setValue(e.target.checked)
    }

    useEffect(() => {
        //to update state
        if (setValue) setValue(null, true)
    }, [value])
    return (
        <label class="form-switch">
            <input
                type="checkbox"
                {...inputCheckboxProps}
                onChange={onChange}
            />
            <i class="form-icon" />{" "}
            <span class={inline ? "text-dark" : "d-none"}>{label}</span>
        </label>
    )
}

export default Boolean
