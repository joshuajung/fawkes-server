import { App } from "../../types";
import { AdvancedData, AdvancedDataType } from "./advancedDataType";
export interface TextOptions {
}
export default class Text implements AdvancedData {
    isAdvancedData: boolean;
    type: AdvancedDataType.Text;
    options: TextOptions;
    value: string;
    rawValue: string;
    constructor(value?: string, rawValue?: string, options?: TextOptions);
    isNil(): boolean;
    static fromDb(app: App, string: string, options?: TextOptions): Text;
    toDb(): string;
    static fromJsonValue(string: string, options?: TextOptions): Text;
    toJsonValue(): string;
    toString(): string;
    static textareaIsWellFormed(input: string, options?: TextOptions): boolean;
    static processTextarea(input: string, options?: TextOptions): string;
    static fromTextarea(input: string, options?: TextOptions): Text;
    toTextarea(): string;
}
