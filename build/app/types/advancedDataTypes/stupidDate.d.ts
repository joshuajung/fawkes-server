import { App } from "../../types";
import { AdvancedData, AdvancedDataType } from "./advancedDataType";
export interface StupidDateOptions {
}
export default class StupidDate implements AdvancedData {
    isAdvancedData: boolean;
    type: AdvancedDataType.StupidDate;
    options: StupidDateOptions;
    value: {
        day: number;
        month: number;
        year: number;
    };
    rawValue: string;
    constructor(value?: {
        year: number;
        month: number;
        day: number;
    }, rawValue?: string, options?: StupidDateOptions);
    isNil(): boolean;
    static fromDb(app: App, dbDate: string, options?: StupidDateOptions): StupidDate;
    toDb(): string;
    static fromJsonValue(jsonObject: any, options?: StupidDateOptions): StupidDate;
    toJsonValue(): {
        year: number;
        month: number;
        day: number;
    };
    toString(): string;
    static fromIso8601(iso8601Date: string, options?: StupidDateOptions): StupidDate;
    toIso8601(): string;
    toLocale(): string;
    static inputIsWellFormed(input: string, options?: StupidDateOptions): boolean;
    static processInput(input: string, options?: StupidDateOptions): {
        year: number;
        month: number;
        day: number;
    };
    static fromInput(input: string, options?: StupidDateOptions): StupidDate;
    toInput(): string;
    static selectIsWellFormed(input: string, options?: StupidDateOptions): boolean;
    static processSelect(input: string, options?: StupidDateOptions): {
        year: number;
        month: number;
        day: number;
    };
    static fromSelect(input: string, options?: StupidDateOptions): StupidDate;
    toSelect(): string;
}
