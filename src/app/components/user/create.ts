// External imports

// Internal imports
import { App } from "../../types"
import * as cryptoHelper from "../../helpers/crypto"
import queries from "../../database/queries"
import * as existsComponent from "./exists"
import { validateHelper } from "../../../support"

export const createUserId = () => {
  return cryptoHelper.createGuid()
}
export const createWithEmail = async (
  app: App,
  email: string,
  password: string
): Promise<string> => {
  // Check if registration is open
  if (!app.module.user.registrationOpen) throw Error("REGISTRATION_CLOSED")
  // Sanitize and validate input
  if (!validateHelper.isPassword(app, password)) throw Error("INVALID_INPUT")
  if (!validateHelper.isEmail(email)) throw Error("INVALID_INPUT")
  // Create user
  const userExists = await existsComponent.emailExists(app, email)
  if (userExists) throw Error("EMAIL_IN_USE")
  const userId = createUserId()
  await app.db.execute(queries.user.createUser(), [
    userId,
    email,
    cryptoHelper.hashPassword.generate(password)
  ])
  return userId
}
export const createWithAppleIdentifier = async (
  app: App,
  appleIdentifier: string
): Promise<string> => {
  // Check if registration via Apple identifier is open
  if (!app.module.user.allowAppleIdentifierUserCreation)
    throw Error("REGISTRATION_CLOSED")
  // Sanitize and validate input
  if (!validateHelper.isGuid(appleIdentifier)) throw Error("INVALID_INPUT")
  // Create user
  const userExists = await existsComponent.appleIdentifierExists(
    app,
    appleIdentifier
  )
  // Throw if user exists already
  if (userExists) throw Error("EMAIL_IN_USE")
  // Create user
  const userId = createUserId()
  await app.db.execute(queries.user.createUser(), [userId, appleIdentifier])
  return userId
}
