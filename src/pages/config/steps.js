import { h } from "preact"
import { AppLogo } from "../../components/Images/logo"
import {
    Camera,
    Download,
    HardDrive,
    Lock,
    Tool,
    Upload,
    Wifi,
} from "preact-feather"

const configTabs = [
    {
        key: "FEATURES",
        id: "featuresLink",
        label: "Features",
        icon: <AppLogo height="24px" />,
        route: "/config/features",
        section: "features",
        type: "step",
    },
    {
        key: "NETWORK",
        id: "networkLink",
        label: "Network",
        icon: <Wifi />,
        route: "/config/network",
        section: "network",
        type: "step",
    },
    {
        key: "FILESYSTEMS",
        id: "filesystemsLink",
        label: "Filesystems",
        icon: <HardDrive />,
        route: "/config/filesystems",
        section: "filesystems",
        type: "step",
    },
    {
        key: "UPDATE",
        id: "updateLink",
        label: "Update",
        icon: <Upload />,
        route: "/config/update",
        section: "update",
        type: "step",
    },
    {
        key: "DEVICES",
        id: "devicesLink",
        label: "Devices",
        icon: <Camera />,
        route: "/config/devices",
        section: "devices",
        type: "step",
    },
    {
        key: "SECURITY",
        id: "securityLink",
        label: "Security",
        icon: <Lock />,
        route: "/config/security",
        section: "security",
        type: "step",
    },
    {
        key: "OTHERS",
        id: "othersLink",
        label: "Others",
        icon: <Tool />,
        route: "/config/others",
        section: "others",
        type: "step",
    },
    {
        key: "GENERATE",
        id: "generateLink",
        label: "Download",
        icon: <Download />,
        route: "/config/generate",
        section: "generate",
        type: "generate",
    },
]

export { configTabs }
