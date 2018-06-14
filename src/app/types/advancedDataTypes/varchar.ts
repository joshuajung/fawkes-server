// External imports
import { isNil } from "lodash"

// Internal imports
import { App } from "../../types"
import { AdvancedData, AdvancedDataType } from "./advancedDataType"

export interface VarcharOptions {}

export default class Varchar implements AdvancedData {
  isAdvancedData: boolean
  type: AdvancedDataType.Varchar
  options: VarcharOptions
  value: string
  rawValue: string
  constructor(
    value: string = null,
    rawValue: string = "",
    options: VarcharOptions = {}
  ) {
    this.isAdvancedData = true
    this.type = AdvancedDataType.Varchar
    this.value = value
    this.rawValue = rawValue
    this.options = options
  }

  isNil(): boolean {
    return isNil(this.value)
  }

  static fromDb(app: App, string: string, options?: VarcharOptions): Varchar {
    if (!isNil(string)) return new Varchar(string, undefined, options)
    else return new Varchar(null, undefined, options)
  }
  toDb(): string {
    return this.value
  }

  static fromJsonValue(string: string, options?: VarcharOptions): Varchar {
    if (!isNil(string)) return new Varchar(string, undefined, options)
    else return new Varchar(null, undefined, options)
  }
  toJsonValue(): string {
    return this.value
  }

  toString(): string {
    return this.isNil() ? "" : this.value
  }

  static inputIsWellFormed(input: string, options?: VarcharOptions): boolean {
    return input.length > 0
  }
  static processInput(input: string, options?: VarcharOptions): string {
    return input
  }
  static fromInput(input: string, options?: VarcharOptions): Varchar {
    const processedInput = Varchar.inputIsWellFormed(input, options)
      ? Varchar.processInput(input, options)
      : null
    return new Varchar(processedInput, input, options)
  }
  toInput(): string {
    return this.value || this.rawValue
  }

  static selectIsWellFormed(input: string, options?: VarcharOptions): boolean {
    return input.length > 0
  }
  static processSelect(input: string, options?: VarcharOptions): string {
    return input
  }
  static fromSelect(input: string, options?: VarcharOptions): Varchar {
    const processedInput = Varchar.selectIsWellFormed(input, options)
      ? Varchar.processSelect(input, options)
      : null
    return new Varchar(processedInput, input, options)
  }
  toSelect(): string {
    return this.value || this.rawValue
  }
}
