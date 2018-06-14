import { App } from "../../types";
import { AdvancedData, AdvancedDataType } from "./advancedDataType";
export interface LookupOptions {
    lookupObjectName?: string;
}
export default class Lookup implements AdvancedData {
    isAdvancedData: boolean;
    type: AdvancedDataType.Lookup;
    options: LookupOptions;
    value: string;
    rawValue: string;
    constructor(value?: string, rawValue?: string, options?: LookupOptions);
    isNil(): boolean;
    static fromDb(app: App, string: string, options?: LookupOptions): Lookup;
    toDb(): string;
    static fromJsonValue(string: string, options?: LookupOptions): Lookup;
    toJsonValue(): string;
    toString(): string;
    static inputIsWellFormed(input: string, options?: LookupOptions): boolean;
    static processInput(input: string, options?: LookupOptions): string;
    static fromInput(input: string, options?: LookupOptions): Lookup;
    toInput(): string;
    static selectIsWellFormed(input: string, options?: LookupOptions): boolean;
    static processSelect(input: string, options?: LookupOptions): string;
    static fromSelect(input: string, options?: LookupOptions): Lookup;
    toSelect(): string;
}
