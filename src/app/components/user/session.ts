// External imports

// Internal imports
import { App } from "../../types"
import * as cryptoHelper from "../../helpers/crypto"
import queries from "../../database/queries"
import * as existsComponent from "./exists"
import * as createComponent from "./create"
import * as passwordComponent from "./password"
import * as findComponent from "./find"
import * as validateHelper from "../../helpers/validate"

export const startSession = async (app: App, userId: string) => {
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  // Reset Login attempts
  await passwordComponent.resetLoginLock(app, userId)
  // Update last successful login
  await updateLastSuccessfulLogin(app, userId)
  // Create session
  const accessToken = await createSession(app, userId)
  return { userId, accessToken }
}
export const createSession = async (app: App, userId: string) => {
  // Create access token
  const accessToken = cryptoHelper.createRandomString()
  const query = queries.user.createSession(app.module.user.sessionTimeout)
  await app.db.execute(query, [accessToken, userId])
  return accessToken
}
export const logInWithEmail = async (
  app: App,
  email: string,
  password: string
) => {
  // Sanitize and validate input
  if (!validateHelper.isEmail(email)) throw Error("INVALID_INPUT")
  if (!validateHelper.isPassword(app, password)) throw Error("INVALID_INPUT")
  // Check if user exists
  const userRecord = await findComponent.findByEmail(app, email)
  if (!userRecord) throw Error("USER_DOES_NOT_EXIST")
  // Check if user login is locked
  if (await passwordComponent.userIsLocked(app, userRecord.id))
    throw Error("LOGIN_LOCKED")
  // Check if password is set at all
  if (!(await passwordComponent.userHasPassword(app, userRecord.id)))
    throw Error("USER_HAS_NO_PASSWORD")
  // Check if password is incorrect
  if (
    await !passwordComponent.verifyUserPassword(app, userRecord.id, password)
  ) {
    // Increase number of failed login attempts
    await passwordComponent.increaseNumberOfFailedLoginAttempts(
      app,
      userRecord.id
    )
    // Lock user if required
    const userLocked = await passwordComponent.lockUserIfRequired(
      app,
      userRecord.id
    )
    if (userLocked) {
      throw Error("LOGIN_LOCKED")
    } else {
      throw Error("PASSWORD_INCORRECT")
    }
  }
  // Everything seems to be fine
  return await startSession(app, userRecord.id)
}

export const logInWithAppleIdentifier = async (
  app: App,
  appleIdentifier: string
) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(appleIdentifier)) throw Error("INVALID_INPUT")
  // Check if user exists
  // Get record
  const userRecord = await findComponent.findByAppleIdentifier(
    app,
    appleIdentifier
  )
  if (!userRecord) throw Error("USER_DOES_NOT_EXIST")
  // Check if user login is locked
  const userIsLocked = await passwordComponent.userIsLocked(app, userRecord.id)
  if (userIsLocked) throw Error("LOGIN_LOCKED")
  // Everything seems to be fine
  return await startSession(app, userRecord.id)
}
export const createUserOrLogInWithAppleIdentifier = async (
  app: App,
  appleIdentifier: string
) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(appleIdentifier)) throw Error("INVALID_INPUT")
  // Exists?
  const userExists = await existsComponent.appleIdentifierExists(
    app,
    appleIdentifier
  )
  // If not exists, create.
  if (!userExists) {
    await createComponent.createWithAppleIdentifier(app, appleIdentifier)
  }
  // Then, in any way, log in.
  return await logInWithAppleIdentifier(app, appleIdentifier)
}
export const logInWithToken = async (app: App, token: string) => {
  // Sanitize and validate input
  if (!validateHelper.isString(token)) throw Error("INVALID_INPUT")
  // Check if user exists
  const userRecord = await findComponent.findByLoginToken(app, token)
  if (!userRecord) throw Error("USER_DOES_NOT_EXIST")
  await app.db.execute(queries.user.setLoginToken(), [null, userRecord.id])
  return await startSession(app, userRecord.id)
}
export const sendLoginLink = async (
  app: App,
  email: string = null,
  loginLinkBaseUrl: string
) => {
  // Sanitize and validate input
  if (!validateHelper.isEmail(email)) throw Error("INVALID_INPUT")
  if (!validateHelper.isString(loginLinkBaseUrl)) throw Error("INVALID_INPUT")
  // Get User ID by email
  const userRecord = await findComponent.findByEmail(app, email)
  // If user does not exist, don't report this to the user.
  if (!userRecord) return
  const userId = userRecord.id
  // Generate Login Token
  const loginToken = await setLoginToken(app, userId)
  // Send email
  const mail = {
    from: app.module.mailer.sender,
    to: userRecord.email,
    subject: "Your Login Link", // To Do: localizationRequired
    text: "Your login link is: " + loginLinkBaseUrl + loginToken
  }
  await app.mailer.sendMail(mail)
}
export const destroySession = async (app: App, accessToken: string) => {
  const query = queries.user.deleteSession()
  const queryResult = await app.db.execute(query, [accessToken])
  const numberOfTokensDestroyed = queryResult[0].affectedRows
  if (numberOfTokensDestroyed !== 1) throw Error("OTHER_ERROR")
}
export const destroyAllSessions = async (app: App, userId: string) => {
  const query = queries.user.deleteAllSessionsForUserId()
  await app.db.execute(query, [userId])
}
export const checkAndRefreshSession = async (app: App, accessToken: string) => {
  const query = queries.user.refreshSession(app.module.user.sessionTimeout)
  const queryResult = await app.db.execute(query, [accessToken])
  if (queryResult[0].affectedRows === 1) {
    return true
  } else {
    return false
  }
}

export const updateLastSuccessfulLogin = async (app: App, userId: string) => {
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  return await app.db.execute(
    queries.user.updateLastSuccessfulLoginForUserId(),
    [userId]
  )
}
export const setLoginToken = async (app: App, userId: string) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  // Set token
  const loginToken = cryptoHelper.createRandomString()
  await app.db.execute(queries.user.setLoginToken(), [loginToken, userId])
  return loginToken
}
