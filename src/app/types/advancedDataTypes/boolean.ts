// External imports
import { isNil } from "lodash"

// Internal imports
import { App } from "../../types"
import { AdvancedData, AdvancedDataType } from "./advancedDataType"

export interface BooleanOptions {}

export default class Boolean implements AdvancedData {
  isAdvancedData: boolean
  type: AdvancedDataType.Boolean
  options: BooleanOptions
  value: boolean
  rawValue: string | boolean
  constructor(
    value: boolean = null,
    rawValue: string | boolean = "",
    options: BooleanOptions = {}
  ) {
    this.isAdvancedData = true
    this.type = AdvancedDataType.Boolean
    this.value = value
    this.rawValue = rawValue
    this.options = options
  }

  isNil(): boolean {
    return isNil(this.value)
  }

  static fromDb(app: App, boolean: boolean, options?: BooleanOptions): Boolean {
    if (!isNil(boolean))
      return new Boolean(boolean ? true : false, undefined, options)
    else return new Boolean(null, undefined, options)
  }
  toDb(): number {
    switch (this.value) {
      case true:
        return 1
      case false:
        return 0
      default:
        return null
    }
  }

  static fromJsonValue(boolean: boolean, options?: BooleanOptions): Boolean {
    if (!isNil(boolean)) return new Boolean(boolean, undefined, options)
    else return new Boolean(null, undefined, options)
  }
  toJsonValue(): boolean {
    return this.value
  }

  toString(): string {
    return this.isNil ? "No data" : this.value ? "true" : "false"
  }

  static selectIsWellFormed(input: string, options?: BooleanOptions): boolean {
    return input == "true" || input == "false"
  }
  static processSelect(input: string, options?: BooleanOptions): boolean {
    return input == "true" ? true : false
  }
  static fromSelect(input: string, options?: BooleanOptions): Boolean {
    const processedInput = Boolean.selectIsWellFormed(input, options)
      ? Boolean.processSelect(input, options)
      : null
    return new Boolean(processedInput, input, options)
  }
  toSelect(): number | string {
    return this.isNil() ? "" : this.value ? "true" : "false"
  }

  static checkboxIsWellFormed(
    input: boolean,
    options?: BooleanOptions
  ): boolean {
    return input === true || input === false
  }
  static processCheckbox(input: boolean, options?: BooleanOptions): boolean {
    return input === true ? true : false
  }
  static fromCheckbox(input: boolean, options?: BooleanOptions): Boolean {
    const processedInput = Boolean.checkboxIsWellFormed(input, options)
      ? Boolean.processCheckbox(input, options)
      : false
    return new Boolean(processedInput, input, options)
  }
  toCheckbox(): boolean {
    return this.isNil() ? false : this.value
  }
}
