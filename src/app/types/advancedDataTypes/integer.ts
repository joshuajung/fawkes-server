// External imports
import { isNil } from "lodash"

// Internal imports
import { App } from "../../types"
import { AdvancedData, AdvancedDataType } from "./advancedDataType"

export interface IntegerOptions {}

export default class Integer implements AdvancedData {
  isAdvancedData: boolean
  type: AdvancedDataType.Integer
  options: IntegerOptions
  value: number
  rawValue: string
  constructor(
    value: number = null,
    rawValue: string = "",
    options: IntegerOptions = {}
  ) {
    this.isAdvancedData = true
    this.type = AdvancedDataType.Integer
    this.value = value
    this.rawValue = rawValue
    this.options = options
  }

  isNil(): boolean {
    return isNil(this.value)
  }

  static fromDb(app: App, number: number, options?: IntegerOptions): Integer {
    if (!isNil(number)) return new Integer(number, undefined, options)
    else return new Integer(null, undefined, options)
  }
  toDb(): number {
    return this.value
  }

  static fromJsonValue(number: number, options?: IntegerOptions): Integer {
    if (!isNil(number)) return new Integer(number, undefined, options)
    else return new Integer(null, undefined, options)
  }
  toJsonValue(): number {
    return this.value
  }

  toString(): string {
    return this.toLocale()
  }

  toLocale(): string {
    if (!this.isNil())
      return this.value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    else return ""
  }

  static inputIsWellFormed(input: string, options?: IntegerOptions): boolean {
    return !isNaN(parseInt(input))
  }
  static processInput(input: string, options?: IntegerOptions): number {
    return parseInt(input)
  }
  static fromInput(input: string, options?: IntegerOptions): Integer {
    const processedInput = Integer.inputIsWellFormed(input, options)
      ? Integer.processInput(input, options)
      : null
    return new Integer(processedInput, input, options)
  }
  toInput(): number | string {
    return this.value || this.rawValue
  }

  static selectIsWellFormed(input: string, options?: IntegerOptions): boolean {
    return !isNaN(parseInt(input))
  }
  static processSelect(input: string, options?: IntegerOptions): number {
    return parseInt(input)
  }
  static fromSelect(input: string, options?: IntegerOptions): Integer {
    const processedInput = Integer.selectIsWellFormed(input, options)
      ? Integer.processSelect(input, options)
      : null
    return new Integer(processedInput, input, options)
  }
  toSelect(): number | string {
    return this.value || this.rawValue
  }
}
