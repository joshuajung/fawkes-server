import { App } from "../../types";
import { AdvancedData } from "../../types/advancedDataTypes/advancedDataType";
export declare const setSetting: (app: App, userId: string, settingKey: string, settingValue: AdvancedData) => Promise<void>;
export declare const setSettings: (app: App, userId: string, settings: {
    settingKey: string;
    settingValue: AdvancedData;
}[]) => Promise<void>;
export declare const settings: (app: App, userId: string) => Promise<any[]>;
