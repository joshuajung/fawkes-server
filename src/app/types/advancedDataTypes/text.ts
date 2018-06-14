// External imports
import { isNil } from "lodash"

// Internal imports
import { App } from "../../types"
import { AdvancedData, AdvancedDataType } from "./advancedDataType"

export interface TextOptions {}

export default class Text implements AdvancedData {
  isAdvancedData: boolean
  type: AdvancedDataType.Text
  options: TextOptions
  value: string
  rawValue: string
  constructor(
    value: string = null,
    rawValue: string = "",
    options: TextOptions = {}
  ) {
    this.isAdvancedData = true
    this.type = AdvancedDataType.Text
    this.value = value
    this.rawValue = rawValue
    this.options = options
  }

  isNil(): boolean {
    return isNil(this.value)
  }

  static fromDb(app: App, string: string, options?: TextOptions): Text {
    if (!isNil(string)) return new Text(string, undefined, options)
    else return new Text(null, undefined, options)
  }
  toDb(): string {
    return this.value
  }

  static fromJsonValue(string: string, options?: TextOptions): Text {
    if (!isNil(string)) return new Text(string, undefined, options)
    else return new Text(null, undefined, options)
  }
  toJsonValue(): string {
    return this.value
  }

  toString(): string {
    return this.isNil() ? "" : this.value.split("\n").join(", ")
  }

  static textareaIsWellFormed(input: string, options?: TextOptions): boolean {
    return input.length > 0
  }
  static processTextarea(input: string, options?: TextOptions): string {
    return input
  }
  static fromTextarea(input: string, options?: TextOptions): Text {
    const processedInput = Text.textareaIsWellFormed(input, options)
      ? Text.processTextarea(input, options)
      : null
    return new Text(processedInput, input, options)
  }
  toTextarea(): string {
    return this.value || this.rawValue
  }
}
