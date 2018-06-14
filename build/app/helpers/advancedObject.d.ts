import { App, AdvancedQueryVariable } from "../types";
import { AdvancedDataType, AdvancedData, AdvancedDataTypeOptions } from "../types/advancedDataTypes/advancedDataType";
export interface AdvancedObjectPropertyPrivate {
    name: string;
    titleLocalizations: Array<AdvancedObjectPropertyTitleLocalization>;
    dataType: AdvancedDataType;
    dataTypeOptions?: AdvancedDataTypeOptions;
    databaseColumnName: string;
    validate?: (value: AdvancedData) => boolean;
    default?: () => AdvancedData;
    orderByAllowed: boolean;
    filterByAllowed: boolean;
    manualEditAllowed: boolean;
    showInDefaultList: boolean;
}
export interface AdvancedObjectPropertyPublic {
    name: string;
    titleLocalizations: Array<AdvancedObjectPropertyTitleLocalization>;
    dataType: AdvancedDataType;
    dataTypeOptions?: AdvancedDataTypeOptions;
    orderByAllowed: boolean;
    filterByAllowed: boolean;
    manualEditAllowed: boolean;
    showInDefaultList: boolean;
}
export interface AdvancedObjectOptions {
    objectName: string;
    databaseTableName: string;
    apiPath: string;
    properties: Array<AdvancedObjectPropertyPrivate>;
    titleLocalizations: Array<AdvancedObjectTitleLocalization>;
    readableIdentifier: (record) => string;
    defaultListOptions?: AdvancedObjectGetRecordListOptions;
    lookedUpBy?: Array<AdvancedObjectLookedUpBy>;
}
export interface AdvancedObjectGetRecordListOptions {
    filterBy?: Array<AdvancedObjectGetRecordListFilterByOption>;
    orderBy?: Array<AdvancedObjectGetRecordListOrderByOption>;
    pageIndex?: number;
    pageSize?: number;
}
export interface AdvancedObjectGetRecordListOrderByOption {
    propertyName: string;
    descending?: boolean;
}
export interface AdvancedObjectGetRecordListFilterByOption {
    propertyName: string;
    operator: AdvancedObjectGetRecordListFilterByOperatorKey;
    constants: Array<AdvancedData>;
}
export declare enum AdvancedObjectGetRecordListFilterByOperatorKey {
    Like = "Like",
    Equals = "Equals",
    Between = "Between",
    IsSet = "IsSet",
    IsNotSet = "IsNotSet",
}
export interface AdvancedObjectGetRecordListFilterByOperator {
    key: AdvancedObjectGetRecordListFilterByOperatorKey;
    query: string;
    constantCount: number;
    availableFor: Array<AdvancedDataType>;
}
export declare const AdvancedObjectGetRecordListFilterByOperators: Array<AdvancedObjectGetRecordListFilterByOperator>;
export interface AdvancedObjectGetRecordListResult {
    records: Array<string>;
    properties: Array<AdvancedObjectPropertyPublic>;
    count: number;
    options: AdvancedObjectGetRecordListOptions;
}
export interface AdvancedObjectTitleLocalization {
    languageCode: string;
    titleSingular: string;
    titlePlural: string;
}
export interface AdvancedObjectPropertyTitleLocalization {
    languageCode: string;
    title: string;
}
export interface AdvancedObjectLookedUpBy {
    foreignObjectName: string;
    foreignPropertyName: string;
}
export declare class AdvancedObject {
    objectName: string;
    databaseTableName: string;
    apiPath: string;
    properties: Array<AdvancedObjectPropertyPrivate>;
    titleLocalizations: Array<AdvancedObjectTitleLocalization>;
    getReadableIdentifier: (record) => string;
    defaultListOptions: AdvancedObjectGetRecordListOptions;
    lookedUpBy: Array<AdvancedObjectLookedUpBy>;
    constructor(options: AdvancedObjectOptions);
    getTitleSingular(languageCode: string, capitalizeFirstLetter?: boolean): string;
    getTitlePlural(languageCode: string, capitalizeFirstLetter?: boolean): string;
    getPropertyTitle(propertyName: string, languageCode: string): string;
    getProperty(propertyName: string): AdvancedObjectPropertyPrivate;
    getIdProperty(): AdvancedObjectPropertyPrivate;
    getPropertiesPublic(): Array<AdvancedObjectPropertyPublic>;
    getPropertiesManualEditAllowed(): Array<AdvancedObjectPropertyPrivate>;
    getRecordList(app: App, options?: AdvancedObjectGetRecordListOptions): Promise<AdvancedObjectGetRecordListResult>;
    createGetRecordListQueryComponentFilterBy(conditions: Array<AdvancedObjectGetRecordListFilterByOption>): {
        queryComponent: string;
        queryVariables: Array<AdvancedQueryVariable>;
    };
    createGetRecordListQueryComponentOrderBy(properties: Array<AdvancedObjectGetRecordListOrderByOption>): {
        queryComponent: string;
        queryVariables: Array<AdvancedQueryVariable>;
    };
    getRecordDetails(app: App, recordIds?: Array<string>): Promise<{
        records: any;
        properties: AdvancedObjectPropertyPublic[];
    }>;
    setRecords(app: App, body: any): Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
    createRecord(app: App, body: any): Promise<any>;
    updateRecord(app: App, body: any): Promise<any>;
    registerAuthRoutes(app: App): void;
    registerExeRoutes(app: App): void;
}
