import { App } from "../../types";
import Varchar, { VarcharOptions } from "./varchar";
import Text, { TextOptions } from "./text";
import Integer, { IntegerOptions } from "./integer";
import Float, { FloatOptions } from "./float";
import Boolean, { BooleanOptions } from "./boolean";
import DateTime, { DateTimeOptions } from "./dateTime";
import StupidDate, { StupidDateOptions } from "./stupidDate";
import Lookup, { LookupOptions } from "./lookup";
import { Response } from "..";
export { Varchar, Text, Integer, Float, Boolean, DateTime, StupidDate, Lookup };
export declare enum AdvancedDataType {
    Varchar = "Varchar",
    Text = "Text",
    Integer = "Integer",
    Float = "Float",
    Boolean = "Boolean",
    DateTime = "DateTime",
    StupidDate = "StupidDate",
    Lookup = "Lookup",
}
export declare type AdvancedDataTypeOptions = VarcharOptions | TextOptions | IntegerOptions | FloatOptions | BooleanOptions | DateTimeOptions | StupidDateOptions | LookupOptions;
export interface AdvancedData {
    isAdvancedData: boolean;
    type: AdvancedDataType;
    options: AdvancedDataTypeOptions;
    value: any;
    rawValue: string | boolean;
    toDb(): string | number;
    toJsonValue(): any;
    toString?(): any;
    toInput?(): string | number;
    toTextarea?(): string;
    toSelect?(): string | number;
    isNil(): boolean;
}
export interface AdvancedDataConstructor {
    new (value?: any, rawValue?: any, options?: AdvancedDataTypeOptions): AdvancedData;
    fromDb: (app: App, input: any, options?: AdvancedDataTypeOptions) => AdvancedData;
    fromJsonValue: (input: any, options?: AdvancedDataTypeOptions) => AdvancedData;
    fromInput?: (input: string, options?: AdvancedDataTypeOptions) => AdvancedData;
    inputIsWellFormed?: (input: string, options?: AdvancedDataTypeOptions) => boolean;
    processInput?: (input: string, options?: AdvancedDataTypeOptions) => any;
    fromTextarea?: (input: string, options?: AdvancedDataTypeOptions) => AdvancedData;
    textareaIsWellFormed?: (input: string, options?: AdvancedDataTypeOptions) => boolean;
    processTextarea?: (input: string, options?: AdvancedDataTypeOptions) => any;
    fromSelect?: (input: string, options?: AdvancedDataTypeOptions) => AdvancedData;
    selectIsWellFormed?: (input: string, options?: AdvancedDataTypeOptions) => boolean;
    processSelect?: (input: string, options?: AdvancedDataTypeOptions) => any;
    fromCheckbox?: (input: boolean, options?: AdvancedDataTypeOptions) => AdvancedData;
    checkboxIsWellFormed?: (input: boolean, options?: AdvancedDataTypeOptions) => boolean;
    processCheckbox?: (input: boolean, options?: AdvancedDataTypeOptions) => any;
}
export interface AdvancedDataInJson {
    isAdvancedDataInJson: boolean;
    type: AdvancedDataType;
    options: AdvancedDataTypeOptions;
    value: any;
}
export declare const advancedDataConstructor: (dataType: AdvancedDataType) => AdvancedDataConstructor;
export declare const toJsonDeep: (value: any) => any;
export declare const fromJsonDeep: (value: any) => any;
export declare const sendAdvancedData: (res: Response, data: any) => Response;
