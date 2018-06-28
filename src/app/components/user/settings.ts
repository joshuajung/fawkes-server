// External imports

// Internal imports
import { App } from "../../types"
import * as cryptoHelper from "../../helpers/crypto"
import * as userSettingsHelper from "../../helpers/userSettings"
import queries from "../../database/queries"
import { AdvancedData } from "../../types/advancedDataTypes/advancedDataType"
import * as validateHelper from "../../helpers/validate"

export const setSetting = async (
  app: App,
  userId: string,
  settingKey: string,
  settingValue: AdvancedData
) => {
  // Sanitize and validate input
  if (!validateHelper.isString(settingKey)) throw Error("INVALID_INPUT")
  // Change Setting
  await app.db.execute(queries.user.setUserSetting(), [
    cryptoHelper.createGuid(),
    userId,
    settingKey,
    settingValue.toDb(),
    settingValue.toDb()
  ])
}
export const setSettings = async (
  app: App,
  userId: string,
  settings: Array<{ settingKey: string; settingValue: AdvancedData }>
) => {
  await Promise.all(
    settings.map(async setting => {
      return setSetting(app, userId, setting.settingKey, setting.settingValue)
    })
  )
}

export const settings = async (app: App, userId: string) => {
  const rawResults = await app.db.execute(queries.user.getUserSettings(), [
    userId
  ])
  return app.module.userSettings
    .map(userSettingDefinition => {
      const rawValueRow = rawResults[0].find(
        row => row["settingKey"] === userSettingDefinition.key
      )
      return {
        ...userSettingDefinition,
        value: userSettingsHelper.parseFromDb(
          app,
          rawValueRow,
          userSettingDefinition
        )
      } as any
    })
    .filter(s => s)
}
