import { AdvancedDataType, AdvancedDataTypeOptions, AdvancedData } from "../types/advancedDataTypes/advancedDataType";
export declare type AllowedUserSettingDataType = AdvancedDataType.Varchar | AdvancedDataType.Text | AdvancedDataType.Boolean | AdvancedDataType.Integer | AdvancedDataType.Float;
export interface UserSetting {
    key: string;
    dataType: AllowedUserSettingDataType;
    dataTypeOptions?: AdvancedDataTypeOptions;
    defaultValue: any;
}
export declare const coreUserSettings: Array<UserSetting>;
export declare const parseFromDb: (app: any, rawValueRow: any, userSettingDefinition: UserSetting) => AdvancedData;
