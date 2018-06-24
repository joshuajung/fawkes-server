// External imports
import * as validator from "validator"

// Internal imports
import { App } from "../types"
import * as cryptoHelper from "../helpers/crypto"
import * as userSettingsHelper from "../helpers/userSettings"
import queries from "../database/queries"
import { AdvancedData } from "../../support"

export const createWithEmail = async (
  app: App,
  email: string,
  password: string
) => {
  // Check if registration is open
  if (!app.module.user.registrationOpen) throw Error("REGISTRATION_CLOSED")
  // Sanitize and validate input
  if (typeof password !== "string") throw Error("INVALID_INPUT")
  if (
    validator.isLength(password, { min: app.module.user.minPasswordLength }) ===
    false
  )
    throw Error("INVALID_INPUT")
  if (typeof email !== "string") throw Error("INVALID_INPUT")
  if (validator.isEmail(email) === false) throw Error("INVALID_INPUT")
  // Create user
  const userExists = await exists(app, email)
  if (userExists) {
    throw Error("EMAIL_IN_USE")
  } else {
    const userId = cryptoHelper.createGuid()
    await app.db.execute(queries.user.createUser(), [
      userId,
      email,
      cryptoHelper.hashPassword.generate(password)
    ])
    return userId
  }
}
export const setNewPasswordWithOldPassword = async (
  app: App,
  userId: string,
  passwordNew: string,
  passwordOld: string
) => {
  // Sanitize and validate input
  if (typeof passwordOld !== "string") throw Error("INVALID_INPUT")
  if (typeof passwordNew !== "string") throw Error("INVALID_INPUT")
  if (
    validator.isLength(passwordNew, {
      min: app.module.user.minPasswordLength
    }) === false
  )
    throw Error("INVALID_INPUT")
  // Get user by ID
  const userRecords = (await app.db.execute(queries.user.getUserById(), [
    userId
  ]))[0]
  if (userRecords.length === 0) {
    throw Error("USER_DOES_NOT_EXIST")
  }
  // Check passwordOld
  if (
    cryptoHelper.hashPassword.verify(passwordOld, userRecords[0].password) ===
    false
  ) {
    throw Error("PASSWORD_INCORRECT")
  }
  // Change password
  const hashedPassword = cryptoHelper.hashPassword.generate(passwordNew)
  await app.db.execute(queries.user.setNewPasswordForUserId(), [
    hashedPassword,
    userId
  ])
}
export const setNewPasswordWithToken = async (
  app: App,
  token: string,
  passwordNew: string
) => {
  // Sanitize and validate input
  if (typeof token !== "string") throw Error("INVALID_INPUT")
  if (typeof passwordNew !== "string") throw Error("INVALID_INPUT")
  if (
    validator.isLength(passwordNew, {
      min: app.module.user.minPasswordLength
    }) === false
  )
    throw Error("INVALID_INPUT")
  // Get user by ID
  const userRecords = (await app.db.execute(
    queries.user.getUserByResetPasswordToken(),
    [token]
  ))[0]
  if (userRecords.length === 0) {
    throw Error("USER_DOES_NOT_EXIST")
  }
  const userId = userRecords[0]["id"]
  // Check passwordOld
  if (userRecords[0].resetPasswordToken !== token) {
    throw Error("RESET_PASSWORD_TOKEN_INCORRECT")
  }
  // Change password
  const hashedPassword = cryptoHelper.hashPassword.generate(passwordNew)
  await app.db.execute(queries.user.setNewPasswordForUserId(), [
    hashedPassword,
    userId
  ])
  await app.db.execute(queries.user.setResetPasswordToken(), [null, userId])
  // Reset Login attempts
  await app.db.execute(queries.user.resetLoginLockForUserId(), [userId])
}
export const sendResetPasswordLink = async (
  app: App,
  email: string = null,
  resetPasswordLinkBaseUrl: string
) => {
  // Sanitize and validate input
  if (typeof email !== "string") throw Error("INVALID_INPUT")
  if (validator.isEmail(email) === false) throw Error("INVALID_INPUT")
  if (typeof resetPasswordLinkBaseUrl !== "string") throw Error("INVALID_INPUT")
  // Get User ID by email
  const userRecords = (await app.db.execute(queries.user.getUserByEmail(), [
    email
  ]))[0]
  if (userRecords.length === 0) {
    throw Error("USER_DOES_NOT_EXIST")
  } else {
    // Generate Access Token
    const resetPasswordToken = cryptoHelper.createRandomString()
    await app.db.execute(queries.user.setResetPasswordToken(), [
      resetPasswordToken,
      userRecords[0].id
    ])
    // Send email
    const mail = {
      from: app.module.mailer.sender,
      to: userRecords[0].email,
      subject: "Your reset password link", // localizationRequired
      text:
        "Your reset password link is: " +
        resetPasswordLinkBaseUrl +
        resetPasswordToken
    }
    await app.mailer.sendMail(mail)
  }
}
export const setSetting = async (
  app: App,
  userId: string,
  settingKey: string,
  settingValue: AdvancedData
) => {
  // Sanitize and validate input
  if (typeof settingKey !== "string") throw Error("INVALID_INPUT")
  // if (typeof settingValue !== "string") throw Error("INVALID_INPUT")
  // Change password
  await app.db.execute(queries.user.setUserSetting(), [
    cryptoHelper.createGuid(),
    userId,
    settingKey,
    settingValue.toDb(),
    settingValue.toDb()
  ])
}
export const setSettings = async (
  app: App,
  userId: string,
  settings: Array<{ settingKey: string; settingValue: AdvancedData }>
) => {
  await Promise.all(
    settings.map(async setting => {
      return setSetting(app, userId, setting.settingKey, setting.settingValue)
    })
  )
}

export const settings = async (app: App, userId: string) => {
  const rawResults = await app.db.execute(queries.user.getUserSettings(), [
    userId
  ])
  return app.module.userSettings
    .map(userSettingDefinition => {
      const rawValueRow = rawResults[0].find(
        row => row["settingKey"] === userSettingDefinition.key
      )
      return {
        ...userSettingDefinition,
        value: userSettingsHelper.parseFromDb(
          app,
          rawValueRow,
          userSettingDefinition
        )
      } as any
    })
    .filter(s => s)
}
export const createSession = async (app: App, userId: string) => {
  if (typeof userId !== "string") throw Error("INVALID_INPUT")
  // Reset Login attempts
  await app.db.execute(queries.user.resetLoginLockForUserId(), [userId])
  // Update last successful login
  await app.db.execute(queries.user.updateLastSuccessfulLoginForUserId(), [
    userId
  ])
  // Create access token
  const accessToken = cryptoHelper.createRandomString()
  const query = queries.user.createSession(app.module.user.sessionTimeout)
  await app.db.execute(query, [accessToken, userId])
  return {
    accessToken
  }
}
export const logInWithEmail = async (
  app: App,
  email: string,
  password: string
) => {
  // Sanitize and validate input
  if (typeof email !== "string") throw Error("INVALID_INPUT")
  if (validator.isEmail(email) === false) throw Error("INVALID_INPUT")
  if (typeof password !== "string") throw Error("INVALID_INPUT")
  // Check if user exists
  const userRecords = (await app.db.execute(queries.user.getUserByEmail(), [
    email
  ]))[0]
  if (userRecords.length === 0) {
    throw Error("USER_DOES_NOT_EXIST")
  }
  // Check if user login is locked
  const lockedStatusRecords = (await app.db.execute(
    queries.user.checkLoginLockForUserId(),
    [userRecords[0].id]
  ))[0]
  if (lockedStatusRecords[0].loginIsLockedNow) {
    throw Error("LOGIN_LOCKED")
  }
  // Check if password is incorrect
  if (
    cryptoHelper.hashPassword.verify(password, userRecords[0].password) ===
    false
  ) {
    // Increase number of failed login attempts
    await app.db.execute(queries.user.increaseFailedLoginAttemptsForUserId(), [
      userRecords[0].id
    ])
    // Lock user if required
    const lockResult = await app.db.execute(
      queries.user.lockUserLoginByUserId(app.module.user.loginLockTimeout),
      [userRecords[0].id, app.module.user.failedLoginAttemptsUntilLock]
    )
    const userLocked = lockResult[0].affectedRows > 0 ? true : false
    if (userLocked) {
      throw Error("LOGIN_LOCKED")
    } else {
      throw Error("PASSWORD_INCORRECT")
    }
  }
  // Everything seems to be fine
  return await createSession(app, userRecords[0].id)
}
export const logInWithToken = async (app: App, token: string) => {
  // Sanitize and validate input
  if (typeof token !== "string") throw Error("INVALID_INPUT")
  // Check if user exists
  const userRecords = (await app.db.execute(
    queries.user.getUserByLoginToken(),
    [token]
  ))[0]
  if (userRecords.length === 0) {
    throw Error("USER_DOES_NOT_EXIST")
  }
  const userId = userRecords[0]["id"]

  await app.db.execute(queries.user.setLoginToken(), [null, userId])
  return await createSession(app, userId)
}
export const exists = async (app: App, email: string) => {
  // Sanitize and validate input
  if (typeof email !== "string") throw Error("INVALID_INPUT")
  if (validator.isEmail(email) === false) throw Error("INVALID_INPUT")
  // Login
  const userRecords = (await app.db.execute(queries.user.getUserByEmail(), [
    email
  ]))[0]
  if (userRecords.length === 0) {
    return false
  } else if (userRecords.length === 1) {
    return true
  } else {
    throw Error("OTHER_ERROR")
  }
}
export const sendLoginLink = async (
  app: App,
  email: string = null,
  loginLinkBaseUrl: string
) => {
  // Sanitize and validate input
  if (typeof email !== "string") throw Error("INVALID_INPUT")
  if (validator.isEmail(email) === false) throw Error("INVALID_INPUT")
  if (typeof loginLinkBaseUrl !== "string") throw Error("INVALID_INPUT")
  // Get User ID by email
  const userRecords = (await app.db.execute(queries.user.getUserByEmail(), [
    email
  ]))[0]
  if (userRecords.length === 0) {
    throw Error("USER_DOES_NOT_EXIST")
  } else {
    const userId = userRecords[0].id
    // Generate Login Token
    const loginToken = cryptoHelper.createRandomString()
    await app.db.execute(queries.user.setLoginToken(), [loginToken, userId])
    // Send email
    const mail = {
      from: app.module.mailer.sender,
      to: userRecords[0].email,
      subject: "Your Login Link", // To Do: localizationRequired
      text: "Your login link is: " + loginLinkBaseUrl + loginToken
    }
    await app.mailer.sendMail(mail)
  }
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
export const getUserForSessionToken = async (app: App, accessToken: string) => {
  // Get User information
  const userQuery = queries.user.getUserForSessionToken()
  const userQueryResult = await app.db.execute(userQuery, [accessToken])
  const userRecords = userQueryResult[0]
  // If no valid session available, return null.
  if (userRecords.length === 0) return null
  const userRecord = userQueryResult[0][0]
  // Get User Group information
  const userGroupQuery = queries.user.getUserGroupsForUserId()
  const userGroupQueryResult = await app.db.execute(userGroupQuery, [
    userRecord["id"]
  ])
  const userGroupRecords = userGroupQueryResult[0]
  return {
    userId: userRecord.id,
    email: userRecord.email,
    userGroups: userGroupRecords.map(userGroupRecord => userGroupRecord.key)
  }
}
export const addToGroup = async (
  app: App,
  userId: string,
  groupKey: string
) => {
  if (typeof userId !== "string") throw Error("INVALID_INPUT")
  if (typeof groupKey !== "string") throw Error("INVALID_INPUT")
  const query = queries.user.addUserIdToGroup()
  const queryResult = await app.db.execute(query, [
    cryptoHelper.createGuid(),
    userId,
    groupKey
  ])
  if (queryResult[0].affectedRows !== 1) {
    throw Error("USER_NOT_ADDED_TO_GROUP")
  }
}
