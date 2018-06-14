import {
  AdvancedDataType,
  AdvancedDataTypeOptions,
  advancedDataConstructor,
  AdvancedData
} from "../types/advancedDataTypes/advancedDataType"

export type AllowedUserSettingDataType =
  | AdvancedDataType.Varchar
  | AdvancedDataType.Text
  | AdvancedDataType.Boolean
  | AdvancedDataType.Integer
  | AdvancedDataType.Float

export interface UserSetting {
  key: string
  dataType: AllowedUserSettingDataType
  dataTypeOptions?: AdvancedDataTypeOptions
  defaultValue: any // As saved in database
}

export const coreUserSettings: Array<UserSetting> = [
  { key: "LANGUAGE", dataType: AdvancedDataType.Varchar, defaultValue: "en-us" }
]

export const parseFromDb = (
  app,
  rawValueRow,
  userSettingDefinition: UserSetting
): AdvancedData => {
  const constructor = advancedDataConstructor(userSettingDefinition.dataType)
  let valueToLoad
  if (!rawValueRow) valueToLoad = userSettingDefinition.defaultValue
  else {
    switch (userSettingDefinition.dataType) {
      case AdvancedDataType.Varchar:
        valueToLoad = rawValueRow["settingValueVarchar"]
        break
      case AdvancedDataType.Text:
        valueToLoad = rawValueRow["settingValueText"]
        break
      case AdvancedDataType.Boolean:
        valueToLoad = rawValueRow["settingValueBoolean"]
        break
      case AdvancedDataType.Integer:
        valueToLoad = rawValueRow["settingValueInteger"]
        break
      case AdvancedDataType.Float:
        valueToLoad = rawValueRow["settingValueFloat"]
        break
    }
  }
  return constructor.fromDb(
    app,
    valueToLoad,
    userSettingDefinition.dataTypeOptions
  )
}
