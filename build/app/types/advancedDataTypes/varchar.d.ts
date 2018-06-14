import { App } from "../../types";
import { AdvancedData, AdvancedDataType } from "./advancedDataType";
export interface VarcharOptions {
}
export default class Varchar implements AdvancedData {
    isAdvancedData: boolean;
    type: AdvancedDataType.Varchar;
    options: VarcharOptions;
    value: string;
    rawValue: string;
    constructor(value?: string, rawValue?: string, options?: VarcharOptions);
    isNil(): boolean;
    static fromDb(app: App, string: string, options?: VarcharOptions): Varchar;
    toDb(): string;
    static fromJsonValue(string: string, options?: VarcharOptions): Varchar;
    toJsonValue(): string;
    toString(): string;
    static inputIsWellFormed(input: string, options?: VarcharOptions): boolean;
    static processInput(input: string, options?: VarcharOptions): string;
    static fromInput(input: string, options?: VarcharOptions): Varchar;
    toInput(): string;
    static selectIsWellFormed(input: string, options?: VarcharOptions): boolean;
    static processSelect(input: string, options?: VarcharOptions): string;
    static fromSelect(input: string, options?: VarcharOptions): Varchar;
    toSelect(): string;
}
