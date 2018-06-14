import { App } from "../../types";
import { AdvancedData, AdvancedDataType } from "./advancedDataType";
export interface FloatOptions {
    decimalDigits: number;
}
export default class Float implements AdvancedData {
    isAdvancedData: boolean;
    type: AdvancedDataType.Float;
    options: FloatOptions;
    value: number;
    rawValue: string;
    constructor(value?: number, rawValue?: string, options?: FloatOptions);
    isNil(): boolean;
    static fromDb(app: App, number: number, options?: FloatOptions): Float;
    toDb(): number;
    static fromJsonValue(number: number, options?: FloatOptions): Float;
    toJsonValue(): number;
    toString(): string;
    toLocale(): string;
    static inputIsWellFormed(input: string, options?: FloatOptions): boolean;
    static processInput(input: string, options?: FloatOptions): number;
    static fromInput(input: string, options?: FloatOptions): Float;
    toInput(): number | string;
    static selectIsWellFormed(input: string, options?: FloatOptions): boolean;
    static processSelect(input: string, options?: FloatOptions): number;
    static fromSelect(input: string, options?: FloatOptions): Float;
    toSelect(): number | string;
}
