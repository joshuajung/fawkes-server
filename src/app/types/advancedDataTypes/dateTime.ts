// External imports
import * as validator from "validator"
import { DateTime as luxon } from "luxon"
import { isNil } from "lodash"

// Internal imports
import { App } from "../../types"
import { AdvancedData, AdvancedDataType } from "./advancedDataType"

export interface DateTimeOptions {}

export default class DateTime implements AdvancedData {
  isAdvancedData: boolean
  type: AdvancedDataType.DateTime
  options: DateTimeOptions
  value: Date
  rawValue: string
  constructor(
    value: Date = null,
    rawValue: string = "",
    options: DateTimeOptions = {}
  ) {
    this.isAdvancedData = true
    this.type = AdvancedDataType.DateTime
    this.value = value
    this.rawValue = rawValue
    this.options = options
  }

  isNil(): boolean {
    return isNil(this.value)
  }

  static fromDb(app: App, dbDate: string, options?: DateTimeOptions): DateTime {
    if (!isNil(dbDate)) {
      if (dbDate.length == 19) {
        return new DateTime(
          new Date(dbDate.substr(0, 10) + "T" + dbDate.substr(11, 8) + "Z"),
          undefined,
          options
        )
      } else if (dbDate.length == 10) {
        return new DateTime(
          new Date(dbDate.substr(0, 10) + "T00:00:00Z"),
          undefined,
          options
        )
      } else return new DateTime(null, undefined, options)
    } else return new DateTime(null, undefined, options)
  }
  toDb(): string {
    return this.isNil() ? null : this.toIso()
  }

  static fromJsonValue(jsonDate: string, options?: DateTimeOptions): DateTime {
    if (!isNil(jsonDate))
      return new DateTime(new Date(jsonDate), undefined, options)
    else return new DateTime(null, undefined, options)
  }
  toJsonValue(): string {
    return !isNil(this.value) ? this.value.toISOString() : null
  }

  toString(): string {
    return this.toLocale()
  }

  static fromIso8601(iso8601Date: string, options?: DateTimeOptions): DateTime {
    if (!validator.isISO8601(iso8601Date)) {
      const error = Error(
        "DateTime could not be initialized with incorrect input " + iso8601Date
      )
      throw error
    }
    return new DateTime(
      new Date(luxon.fromISO(iso8601Date)),
      undefined,
      options
    )
  }
  toIso(): string {
    return this.value.toISOString()
  }

  toLocale(): string {
    if (!this.isNil())
      return luxon
        .fromISO(this.value.toISOString())
        .toLocaleString(luxon.DATETIME_MED)
    else return ""
  }

  static inputIsWellFormed(input: string, options?: DateTimeOptions): boolean {
    try {
      let year = parseInt(input.substr(0, 4))
      let month = parseInt(input.substr(5, 2))
      let day = parseInt(input.substr(8, 2))
      let hours = parseInt(input.substr(11, 2))
      let minutes = parseInt(input.substr(14, 2))
      return (
        input.length == 16 &&
        input.substr(4, 1) == "-" &&
        input.substr(7, 1) == "-" &&
        input.substr(10, 1) == "T" &&
        input.substr(13, 1) == ":" &&
        year > 0 &&
        month >= 1 &&
        month <= 12 &&
        day > 0 &&
        day <= 31 &&
        hours >= 0 &&
        hours <= 24 &&
        minutes >= 0 &&
        minutes <= 59
      )
    } catch (e) {
      return false
    }
  }
  static processInput(input: string, options?: DateTimeOptions): Date {
    return new Date(luxon.fromISO(input))
  }
  static fromInput(input: string, options?: DateTimeOptions): DateTime {
    const processedInput = DateTime.inputIsWellFormed(input, options)
      ? DateTime.processInput(input, options)
      : null
    return new DateTime(processedInput, input, options)
  }
  toInput(): string {
    if (this.isNil()) return this.rawValue
    const luxonDate = luxon.fromISO(this.value.toISOString())
    return luxonDate.toFormat("yyyy-MM-dd") + "T" + luxonDate.toFormat("T")
  }

  static selectIsWellFormed(input: string, options?: DateTimeOptions): boolean {
    try {
      let year = parseInt(input.substr(0, 4))
      let month = parseInt(input.substr(5, 2))
      let day = parseInt(input.substr(8, 2))
      let hours = parseInt(input.substr(11, 2))
      let minutes = parseInt(input.substr(14, 2))
      return (
        input.length == 16 &&
        input.substr(4, 1) == "-" &&
        input.substr(7, 1) == "-" &&
        input.substr(10, 1) == "T" &&
        input.substr(13, 1) == ":" &&
        year > 0 &&
        month >= 1 &&
        month <= 12 &&
        day > 0 &&
        day <= 31 &&
        hours >= 0 &&
        hours <= 24 &&
        minutes >= 0 &&
        minutes <= 59
      )
    } catch (e) {
      return false
    }
  }
  static processSelect(input: string, options?: DateTimeOptions): Date {
    return new Date(luxon.fromISO(input))
  }
  static fromSelect(input: string, options?: DateTimeOptions): DateTime {
    const processedInput = DateTime.selectIsWellFormed(input, options)
      ? DateTime.processSelect(input, options)
      : null
    return new DateTime(processedInput, input, options)
  }
  toSelect(): string {
    if (this.isNil()) return this.rawValue
    const luxonDate = luxon.fromISO(this.value.toISOString())
    return luxonDate.toFormat("yyyy-MM-dd") + "T" + luxonDate.toFormat("T")
  }
}
