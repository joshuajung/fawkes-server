import { App } from "../../types";
import { AdvancedData, AdvancedDataType } from "./advancedDataType";
export interface BooleanOptions {
}
export default class Boolean implements AdvancedData {
    isAdvancedData: boolean;
    type: AdvancedDataType.Boolean;
    options: BooleanOptions;
    value: boolean;
    rawValue: string | boolean;
    constructor(value?: boolean, rawValue?: string | boolean, options?: BooleanOptions);
    isNil(): boolean;
    static fromDb(app: App, boolean: boolean, options?: BooleanOptions): Boolean;
    toDb(): number;
    static fromJsonValue(boolean: boolean, options?: BooleanOptions): Boolean;
    toJsonValue(): boolean;
    toString(): string;
    static selectIsWellFormed(input: string, options?: BooleanOptions): boolean;
    static processSelect(input: string, options?: BooleanOptions): boolean;
    static fromSelect(input: string, options?: BooleanOptions): Boolean;
    toSelect(): number | string;
    static checkboxIsWellFormed(input: boolean, options?: BooleanOptions): boolean;
    static processCheckbox(input: boolean, options?: BooleanOptions): boolean;
    static fromCheckbox(input: boolean, options?: BooleanOptions): Boolean;
    toCheckbox(): boolean;
}
