import { App } from "../../types";
import { AdvancedData, AdvancedDataType } from "./advancedDataType";
export interface DateTimeOptions {
}
export default class DateTime implements AdvancedData {
    isAdvancedData: boolean;
    type: AdvancedDataType.DateTime;
    options: DateTimeOptions;
    value: Date;
    rawValue: string;
    constructor(value?: Date, rawValue?: string, options?: DateTimeOptions);
    isNil(): boolean;
    static fromDb(app: App, dbDate: string, options?: DateTimeOptions): DateTime;
    toDb(): string;
    static fromJsonValue(jsonDate: string, options?: DateTimeOptions): DateTime;
    toJsonValue(): string;
    toString(): string;
    static fromIso8601(iso8601Date: string, options?: DateTimeOptions): DateTime;
    toIso(): string;
    toLocale(): string;
    static inputIsWellFormed(input: string, options?: DateTimeOptions): boolean;
    static processInput(input: string, options?: DateTimeOptions): Date;
    static fromInput(input: string, options?: DateTimeOptions): DateTime;
    toInput(): string;
    static selectIsWellFormed(input: string, options?: DateTimeOptions): boolean;
    static processSelect(input: string, options?: DateTimeOptions): Date;
    static fromSelect(input: string, options?: DateTimeOptions): DateTime;
    toSelect(): string;
}
