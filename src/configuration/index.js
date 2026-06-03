import featuresConfiguration from "./tabs/features"
import networkConfiguration from "./tabs/network"
import filesystemsConfiguration from "./tabs/filesystems"
import updateConfiguration from "./tabs/update"
import devicesConfiguration from "./tabs/devices"
import securityConfiguration from "./tabs/security"
import othersConfiguration from "./tabs/others"
import defaultsConfiguration from "./tabs/defaults"

const defaultConfiguration = {
    features: featuresConfiguration,
    network: networkConfiguration,
    filesystems: filesystemsConfiguration,
    update: updateConfiguration,
    devices: devicesConfiguration,
    security: securityConfiguration,
    others: othersConfiguration,
    default: defaultsConfiguration,
}

export default defaultConfiguration
