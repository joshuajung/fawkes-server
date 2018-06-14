// External imports
import * as validator from "validator"
import { padStart } from "lodash"
import { DateTime as luxon } from "luxon"
import { isNil } from "lodash"

// Internal imports
import { App } from "../../types"
import { AdvancedData, AdvancedDataType } from "./advancedDataType"

export interface StupidDateOptions {}

export default class StupidDate implements AdvancedData {
  isAdvancedData: boolean
  type: AdvancedDataType.StupidDate
  options: StupidDateOptions
  value: {
    day: number
    month: number
    year: number
  }
  rawValue: string
  constructor(
    value: { year: number; month: number; day: number } = {
      year: null,
      month: null,
      day: null
    },
    rawValue: string = "",
    options: StupidDateOptions = {}
  ) {
    this.isAdvancedData = true
    this.type = AdvancedDataType.StupidDate
    this.value = value
    this.rawValue = rawValue
    this.options = options
  }

  isNil(): boolean {
    return (
      isNil(this.value) ||
      isNil(this.value.year) ||
      isNil(this.value.month) ||
      isNil(this.value.day)
    )
  }

  static fromDb(
    app: App,
    dbDate: string,
    options?: StupidDateOptions
  ): StupidDate {
    if (!isNil(dbDate)) return StupidDate.fromIso8601(dbDate, options)
    else return new StupidDate(null, undefined, options)
  }
  toDb() {
    return this.isNil() ? null : this.toIso8601()
  }

  static fromJsonValue(jsonObject, options?: StupidDateOptions): StupidDate {
    if (
      !isNil(jsonObject) &&
      !isNil(jsonObject.year) &&
      !isNil(jsonObject.month) &&
      !isNil(jsonObject.day)
    )
      return new StupidDate(jsonObject, undefined, options)
    else return new StupidDate(null, undefined, options)
  }
  toJsonValue() {
    if (!this.isNil())
      return {
        year: this.value.year,
        month: this.value.month,
        day: this.value.day
      }
    else return null
  }

  toString(): string {
    return this.toLocale()
  }

  static fromIso8601(
    iso8601Date: string,
    options?: StupidDateOptions
  ): StupidDate {
    if (!validator.isISO8601(iso8601Date)) {
      const error = Error(
        "StupidDate could not be initialized with incorrect input " +
          iso8601Date
      )
      throw error
    }
    const dateComponents = iso8601Date.split("-").map(c => parseInt(c))
    return new StupidDate(
      {
        year: dateComponents[0],
        month: dateComponents[1],
        day: dateComponents[2]
      },
      undefined,
      options
    )
  }
  toIso8601() {
    return [
      padStart(this.value.year.toString(), 4, "0"),
      padStart(this.value.month.toString(), 2, "0"),
      padStart(this.value.day.toString(), 2, "0")
    ].join("-")
  }

  toLocale(): string {
    if (!this.isNil())
      return luxon
        .local(this.value.year, this.value.month, this.value.day, 0, 0, 0)
        .toLocaleString(luxon.DATE_MED)
    else return ""
  }

  static inputIsWellFormed(
    input: string,
    options?: StupidDateOptions
  ): boolean {
    try {
      let year = parseInt(input.substr(0, 4))
      let month = parseInt(input.substr(5, 2))
      let day = parseInt(input.substr(8, 2))
      return (
        input.length == 10 &&
        input.substr(4, 1) == "-" &&
        input.substr(7, 1) == "-" &&
        year > 0 &&
        month >= 1 &&
        month <= 12 &&
        day > 0 &&
        day <= 31
      )
    } catch (e) {
      return false
    }
  }
  static processInput(input: string, options?: StupidDateOptions) {
    const dateComponents = input.split("-").map(c => parseInt(c))
    return {
      year: dateComponents[0],
      month: dateComponents[1],
      day: dateComponents[2]
    }
  }
  static fromInput(input: string, options?: StupidDateOptions): StupidDate {
    const processedInput = StupidDate.inputIsWellFormed(input, options)
      ? StupidDate.processInput(input, options)
      : null
    return new StupidDate(processedInput, input, options)
  }
  toInput(): string {
    return this.isNil() ? this.rawValue : this.toIso8601()
  }

  static selectIsWellFormed(
    input: string,
    options?: StupidDateOptions
  ): boolean {
    try {
      let year = parseInt(input.substr(0, 4))
      let month = parseInt(input.substr(5, 2))
      let day = parseInt(input.substr(8, 2))
      return (
        input.length == 10 &&
        input.substr(4, 1) == "-" &&
        input.substr(7, 1) == "-" &&
        year > 0 &&
        month >= 1 &&
        month <= 12 &&
        day > 0 &&
        day <= 31
      )
    } catch (e) {
      return false
    }
  }
  static processSelect(input: string, options?: StupidDateOptions) {
    const dateComponents = input.split("-").map(c => parseInt(c))
    return {
      year: dateComponents[0],
      month: dateComponents[1],
      day: dateComponents[2]
    }
  }
  static fromSelect(input: string, options?: StupidDateOptions): StupidDate {
    const processedInput = StupidDate.selectIsWellFormed(input, options)
      ? StupidDate.processSelect(input, options)
      : null
    return new StupidDate(processedInput, input, options)
  }
  toSelect(): string {
    return this.isNil() ? this.rawValue : this.toIso8601()
  }
}
