/*
 UiContext.js - ESP3D WebUI context file

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
import { useContext, useState, useRef, useEffect } from "preact/hooks"
import {
    generateUID,
    removeEntriesByIDs,
    disableUI,
} from "../components/Helpers"

const useUiContextFn = {}

/*
 * Local const
 *
 */
const UiContext = createContext("uiContext")
const useUiContext = () => useContext(UiContext)
const UiContextProvider = ({ children }) => {
    const [modals, setModal] = useState([])
    const [toasts, setToasts] = useState([])

    const toastsRef = useRef(toasts)
    toastsRef.current = toasts

    const addToast = (newToast) => {
        const id = generateUID()
        const now = new Date()
        const time =
            now.getHours().toString().padStart(2, "0") +
            ":" +
            now.getMinutes().toString().padStart(2, "0") +
            ":" +
            now.getSeconds().toString().padStart(2, "0")

        setToasts([...toastsRef.current, { ...newToast, id }])
        setNotifications([
            ...notificationsRef.current,
            { ...newToast, id, time },
        ])
    }

    const clearNotifications = () => {
        setNotifications([])
    }

    const removeToast = (uids) => {
        const removedIds = removeEntriesByIDs(toastsRef.current, uids)
        setToasts([...removedIds])
    }

    const addModal = (newModal) =>
        setModal([
            ...modals,
            { ...newModal, id: newModal.id ? newModal.id : generateUID() },
        ])
    const getModalIndex = (id) => {
        return modals.findIndex((element) => element.id == id)
    }
    const removeModal = (modalIndex) => {
        const newModalList = modals.filter(
            (modal, index) => index !== modalIndex
        )
        setModal(newModalList)
        if (newModalList.length == 0) disableUI(false)
    }

    const clearModals = () => {
        setModal([])
    }

    useUiContextFn.getValue = (v) => {
        console.log(v, "not found")
    }
    useUiContextFn.getElement = (v) => {
        console.log(v, "not found")
    }

    useUiContextFn.toasts = { addToast, removeToast, toastList: toasts }

    useEffect(() => {}, [])

    const store = {
        toasts: { toastList: toasts, addToast, removeToast },
        modals: {
            modalList: modals,
            addModal,
            removeModal,
            getModalIndex,
            clearModals,
        },
    }

    return <UiContext.Provider value={store}>{children}</UiContext.Provider>
}

export { UiContextProvider, useUiContext, useUiContextFn }
