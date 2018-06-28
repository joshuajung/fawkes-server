// External imports

// Internal imports
import { App } from "../../types"
import { validateHelper } from "../../../support"
import * as findHelper from "./find"

export const idExists = async (app: App, userId: string) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  // Find record
  const user = await findHelper.findById(app, userId)
  return user !== null
}
export const emailExists = async (app: App, email: string) => {
  // Sanitize and validate input
  if (!validateHelper.isEmail(email)) throw Error("INVALID_INPUT")
  // Find record
  const user = await findHelper.findByEmail(app, email)
  return user !== null
}
export const appleIdentifierExists = async (
  app: App,
  appleIdentifier: string
) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(appleIdentifier)) throw Error("INVALID_INPUT")
  // Find record
  const user = await findHelper.findByAppleIdentifier(app, appleIdentifier)
  return user !== null
}
