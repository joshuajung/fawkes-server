import { App } from "../../types";
import { AdvancedData, AdvancedDataType } from "./advancedDataType";
export interface IntegerOptions {
}
export default class Integer implements AdvancedData {
    isAdvancedData: boolean;
    type: AdvancedDataType.Integer;
    options: IntegerOptions;
    value: number;
    rawValue: string;
    constructor(value?: number, rawValue?: string, options?: IntegerOptions);
    isNil(): boolean;
    static fromDb(app: App, number: number, options?: IntegerOptions): Integer;
    toDb(): number;
    static fromJsonValue(number: number, options?: IntegerOptions): Integer;
    toJsonValue(): number;
    toString(): string;
    toLocale(): string;
    static inputIsWellFormed(input: string, options?: IntegerOptions): boolean;
    static processInput(input: string, options?: IntegerOptions): number;
    static fromInput(input: string, options?: IntegerOptions): Integer;
    toInput(): number | string;
    static selectIsWellFormed(input: string, options?: IntegerOptions): boolean;
    static processSelect(input: string, options?: IntegerOptions): number;
    static fromSelect(input: string, options?: IntegerOptions): Integer;
    toSelect(): number | string;
}
