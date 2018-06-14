// External imports
import { isNil } from "lodash"

// Internal imports
import { App } from "../../types"
import { AdvancedData, AdvancedDataType } from "./advancedDataType"

export interface LookupOptions {
  lookupObjectName?: string
}

export default class Lookup implements AdvancedData {
  isAdvancedData: boolean
  type: AdvancedDataType.Lookup
  options: LookupOptions
  value: string
  rawValue: string
  constructor(
    value: string = null,
    rawValue: string = "",
    options: LookupOptions = {}
  ) {
    this.isAdvancedData = true
    this.type = AdvancedDataType.Lookup
    this.value = value
    this.rawValue = rawValue
    this.options = options
  }

  isNil(): boolean {
    return isNil(this.value)
  }

  static fromDb(app: App, string: string, options?: LookupOptions): Lookup {
    if (!isNil(string)) return new Lookup(string, undefined, options)
    else return new Lookup(null, undefined, options)
  }
  toDb(): string {
    return this.value
  }

  static fromJsonValue(string: string, options?: LookupOptions): Lookup {
    if (!isNil(string)) return new Lookup(string, undefined, options)
    else return new Lookup(null, undefined, options)
  }
  toJsonValue(): string {
    return this.value
  }

  toString(): string {
    return this.isNil() ? "" : this.value
  }

  static inputIsWellFormed(input: string, options?: LookupOptions): boolean {
    return input.length > 0
  }
  static processInput(input: string, options?: LookupOptions): string {
    return input
  }
  static fromInput(input: string, options?: LookupOptions): Lookup {
    const processedInput = Lookup.inputIsWellFormed(input, options)
      ? Lookup.processInput(input, options)
      : null
    return new Lookup(processedInput, input, options)
  }
  toInput(): string {
    return this.value || this.rawValue
  }

  static selectIsWellFormed(input: string, options?: LookupOptions): boolean {
    return input.length > 0
  }
  static processSelect(input: string, options?: LookupOptions): string {
    return input
  }
  static fromSelect(input: string, options?: LookupOptions): Lookup {
    const processedInput = Lookup.selectIsWellFormed(input, options)
      ? Lookup.processSelect(input, options)
      : null
    return new Lookup(processedInput, input, options)
  }
  toSelect(): string {
    return this.value || this.rawValue
  }
}
