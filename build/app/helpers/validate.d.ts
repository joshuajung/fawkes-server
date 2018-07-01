import { App } from "../types";
import { AdvancedDataType } from "../types/advancedDataTypes/advancedDataType";
export declare const isNil: (value: any) => boolean;
export declare const isGuid: (value: any) => boolean;
export declare const isEmail: (value: any) => boolean;
export declare const isString: (value: any) => boolean;
export declare const isArray: (value: any) => boolean;
export declare const isPassword: (app: App, value: any) => boolean;
export declare const isAdvancedData: (value: any, onlyAllowedAdvancedDataTypes?: AdvancedDataType[]) => boolean;
