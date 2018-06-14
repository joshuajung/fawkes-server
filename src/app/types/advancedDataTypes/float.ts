// External imports
import { isNil, round } from "lodash"

// Internal imports
import { App } from "../../types"
import { AdvancedData, AdvancedDataType } from "./advancedDataType"

export interface FloatOptions {
  decimalDigits: number
}

export default class Float implements AdvancedData {
  isAdvancedData: boolean
  type: AdvancedDataType.Float
  options: FloatOptions
  value: number
  rawValue: string
  constructor(
    value: number = null,
    rawValue: string = "",
    options: FloatOptions = { decimalDigits: 2 }
  ) {
    this.isAdvancedData = true
    this.type = AdvancedDataType.Float
    this.options = options
    this.rawValue = rawValue
    this.value = value ? round(value, this.options.decimalDigits) : null
  }

  isNil(): boolean {
    return isNil(this.value)
  }

  static fromDb(app: App, number: number, options?: FloatOptions): Float {
    if (!isNil(number)) return new Float(number, undefined, options)
    else return new Float(null, undefined, options)
  }
  toDb(): number {
    return this.value
  }

  static fromJsonValue(number: number, options?: FloatOptions): Float {
    if (!isNil(number)) return new Float(number, undefined, options)
    else return new Float(null, undefined, options)
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
        minimumFractionDigits: this.options.decimalDigits,
        maximumFractionDigits: this.options.decimalDigits
      })
    else return ""
  }

  static inputIsWellFormed(input: string, options?: FloatOptions): boolean {
    return !isNaN(parseFloat(input))
  }
  static processInput(input: string, options?: FloatOptions): number {
    return parseFloat(input)
  }
  static fromInput(input: string, options?: FloatOptions): Float {
    const processedInput = Float.inputIsWellFormed(input, options)
      ? Float.processInput(input, options)
      : null
    return new Float(processedInput, input, options)
  }
  toInput(): number | string {
    return this.value || this.rawValue
  }

  static selectIsWellFormed(input: string, options?: FloatOptions): boolean {
    return !isNaN(parseFloat(input))
  }
  static processSelect(input: string, options?: FloatOptions): number {
    return parseFloat(input)
  }
  static fromSelect(input: string, options?: FloatOptions): Float {
    const processedInput = Float.selectIsWellFormed(input, options)
      ? Float.processSelect(input, options)
      : null
    return new Float(processedInput, input, options)
  }
  toSelect(): number | string {
    return this.value || this.rawValue
  }
}
