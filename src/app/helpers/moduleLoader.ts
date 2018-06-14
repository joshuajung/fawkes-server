// Internal imports
import * as types from "../types"
import * as userSettingsHelper from "./userSettings"

const primeModule = (module: types.Module): types.Module => {
  // Add core user settings
  module.userSettings = [
    ...userSettingsHelper.coreUserSettings,
    ...module.userSettings
  ]
  return module
}

export default primeModule
