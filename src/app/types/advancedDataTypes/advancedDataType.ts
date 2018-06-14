// External imports
import { isArray, isObject } from "lodash"

// Internal imports
import { App } from "../../types"
import Varchar, { VarcharOptions } from "./varchar"
import Text, { TextOptions } from "./text"
import Integer, { IntegerOptions } from "./integer"
import Float, { FloatOptions } from "./float"
import Boolean, { BooleanOptions } from "./boolean"
import DateTime, { DateTimeOptions } from "./dateTime"
import StupidDate, { StupidDateOptions } from "./stupidDate"
import Lookup, { LookupOptions } from "./lookup"
import { Response } from ".."

export { Varchar, Text, Integer, Float, Boolean, DateTime, StupidDate, Lookup }

export enum AdvancedDataType {
  // Varchar - JSON: string, SQL: varchar
  Varchar = "Varchar",
  // Text - JSON: string, SQL: text
  Text = "Text",
  // Integer - JSON: number, SQL: int
  Integer = "Integer",
  // Float - JSON: number, SQL: float
  Float = "Float",
  // Boolean - JSON: boolean, SQL: tinyint(1)
  Boolean = "Boolean",
  // DateTime - JSON: date, SQL: datetime
  DateTime = "DateTime",
  // StupidDate - JSON: object, SQL: date
  StupidDate = "StupidDate",
  // Lookup - JSON: string, SQL: varchar
  Lookup = "Lookup"
}

export type AdvancedDataTypeOptions =
  | VarcharOptions
  | TextOptions
  | IntegerOptions
  | FloatOptions
  | BooleanOptions
  | DateTimeOptions
  | StupidDateOptions
  | LookupOptions

export interface AdvancedData {
  isAdvancedData: boolean
  type: AdvancedDataType
  options: AdvancedDataTypeOptions
  value: any
  rawValue: string | boolean
  toDb(): string | number
  toJsonValue(): any
  toString?(): any
  toInput?(): string | number
  toTextarea?(): string
  toSelect?(): string | number
  isNil(): boolean
}

export interface AdvancedDataConstructor {
  new (
    value?: any,
    rawValue?: any,
    options?: AdvancedDataTypeOptions
  ): AdvancedData
  fromDb: (
    app: App,
    input: any,
    options?: AdvancedDataTypeOptions
  ) => AdvancedData
  fromJsonValue: (input: any, options?: AdvancedDataTypeOptions) => AdvancedData

  fromInput?: (input: string, options?: AdvancedDataTypeOptions) => AdvancedData
  inputIsWellFormed?: (
    input: string,
    options?: AdvancedDataTypeOptions
  ) => boolean
  processInput?: (input: string, options?: AdvancedDataTypeOptions) => any

  fromTextarea?: (
    input: string,
    options?: AdvancedDataTypeOptions
  ) => AdvancedData
  textareaIsWellFormed?: (
    input: string,
    options?: AdvancedDataTypeOptions
  ) => boolean
  processTextarea?: (input: string, options?: AdvancedDataTypeOptions) => any

  fromSelect?: (
    input: string,
    options?: AdvancedDataTypeOptions
  ) => AdvancedData
  selectIsWellFormed?: (
    input: string,
    options?: AdvancedDataTypeOptions
  ) => boolean
  processSelect?: (input: string, options?: AdvancedDataTypeOptions) => any

  fromCheckbox?: (
    input: boolean,
    options?: AdvancedDataTypeOptions
  ) => AdvancedData
  checkboxIsWellFormed?: (
    input: boolean,
    options?: AdvancedDataTypeOptions
  ) => boolean
  processCheckbox?: (input: boolean, options?: AdvancedDataTypeOptions) => any
}

export interface AdvancedDataInJson {
  isAdvancedDataInJson: boolean
  type: AdvancedDataType
  options: AdvancedDataTypeOptions
  value: any
}

export const advancedDataConstructor = (
  dataType: AdvancedDataType
): AdvancedDataConstructor => {
  switch (dataType) {
    case AdvancedDataType.Float:
      return Float
    case AdvancedDataType.Boolean:
      return Boolean
    case AdvancedDataType.Varchar:
      return Varchar
    case AdvancedDataType.Text:
      return Text
    case AdvancedDataType.Integer:
      return Integer
    case AdvancedDataType.DateTime:
      return DateTime
    case AdvancedDataType.StupidDate:
      return StupidDate
    case AdvancedDataType.Lookup:
      return Lookup
  }
}

export const toJsonDeep = (value: any) => {
  if (isArray(value)) {
    return value.map(e => toJsonDeep(e))
  } else if (isObject(value) && value["isAdvancedData"] === true) {
    const advancedDataInJson: AdvancedDataInJson = {
      isAdvancedDataInJson: true,
      type: (value as AdvancedData).type,
      options: (value as AdvancedData).options,
      value: (value as AdvancedData).toJsonValue()
    }
    return advancedDataInJson
  } else if (isObject(value)) {
    let newObject = {}
    for (let key in value) {
      newObject[key] = toJsonDeep(value[key])
    }
    return newObject
  } else {
    return value
  }
}

export const fromJsonDeep = (value: any) => {
  if (isArray(value)) {
    return value.map(e => fromJsonDeep(e))
  } else if (isObject(value) && value["isAdvancedDataInJson"] === true) {
    const constructor = advancedDataConstructor(
      (value as AdvancedDataInJson).type
    )
    return constructor.fromJsonValue(
      (value as AdvancedDataInJson).value,
      (value as AdvancedDataInJson).options
    )
  } else if (isObject(value)) {
    let newObject = {}
    for (let key in value) {
      newObject[key] = fromJsonDeep(value[key])
    }
    return newObject
  } else {
    return value
  }
}

export const sendAdvancedData = (res: Response, data: any): Response => {
  const convertedBody = toJsonDeep(data)
  return res.send(convertedBody)
}
