// External imports
import * as validator from "validator"
import { isNil as _isNil } from "lodash"

// Internal imports
import { App } from "../types"
import { AdvancedDataType } from "../types/advancedDataTypes/advancedDataType"

const makeString = (input): string => input + ""

export const isNil = value => _isNil(value)
export const isGuid = value => validator.isUUID(makeString(value))
export const isEmail = value => validator.isEmail(value)
export const isString = value => typeof value === "string"
export const isPassword = (app: App, value) =>
  typeof value === "string" &&
  validator.isLength(value, { min: app.module.user.minPasswordLength })
export const isAdvancedData = (
  value: any,
  allowedAdvancedDataTypes: Array<AdvancedDataType>
) => {
  // This is only partly safe, as only the constructor name is being checked - use with care.
  const constructorName = value.constructor.name
  const isAllowed = allowedAdvancedDataTypes.indexOf(constructorName) !== -1
  return isAllowed
}
