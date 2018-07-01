// External imports

// Internal imports
import { App } from "../../types"
import * as cryptoHelper from "../../helpers/crypto"
import * as validateHelper from "../../helpers/validate"
import queries from "../../database/queries"
import * as findComponent from "./find"

export const setNewPasswordWithOldPassword = async (
  app: App,
  userId: string,
  passwordNew: string,
  passwordOld: string
) => {
  // Sanitize and validate input
  if (!validateHelper.isString(passwordOld)) throw Error("INVALID_INPUT")
  if (!validateHelper.isPassword(app, passwordNew)) throw Error("INVALID_INPUT")
  // Get user by ID
  const userRecord = await findComponent.findById(app, userId)
  if (!userRecord) throw Error("USER_DOES_NOT_EXIST")
  // Check passwordOld
  if (
    cryptoHelper.hashPassword.verify(passwordOld, userRecord.password) === false
  )
    throw Error("PASSWORD_INCORRECT")
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
  if (!validateHelper.isString(token)) throw Error("INVALID_INPUT")
  if (!validateHelper.isPassword(app, passwordNew)) throw Error("INVALID_INPUT")
  // Get user
  const userRecord = await findComponent.findByResetPasswordToken(app, token)
  if (!userRecord) throw Error("USER_DOES_NOT_EXIST")
  const userId = userRecord["id"]
  // Change password
  await setNewPassword(app, userId, passwordNew)
  await voidPasswordResetToken(app, userId)
  await resetLoginLock(app, userId)
}
export const sendResetPasswordLink = async (
  app: App,
  email: string = null,
  resetPasswordLinkBaseUrl: string
) => {
  // Sanitize and validate input
  if (!validateHelper.isEmail(email)) throw Error("INVALID_INPUT")
  if (!validateHelper.isString(resetPasswordLinkBaseUrl))
    throw Error("INVALID_INPUT")
  // Get User ID by email
  const userRecord = await findComponent.findByEmail(app, email)
  if (!userRecord) throw Error("USER_DOES_NOT_EXIST")
  // Generate Access Token
  const resetPasswordToken = await setPasswordResetToken(app, userRecord.id)
  // Send email
  const mail = {
    from: app.module.mailer.sender,
    to: userRecord.email,
    subject: "Your reset password link", // localizationRequired
    text:
      "Your reset password link is: " +
      resetPasswordLinkBaseUrl +
      resetPasswordToken
  }
  await app.mailer.sendMail(mail)
}
export const setNewPassword = async (
  app: App,
  userId: string,
  newPassword: string
) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  if (!validateHelper.isPassword(app, newPassword)) throw Error("INVALID_INPUT")
  // Update password
  const hashedPassword = cryptoHelper.hashPassword.generate(newPassword)
  await app.db.execute(queries.user.setNewPasswordForUserId(), [
    hashedPassword,
    userId
  ])
}
export const setPasswordResetToken = async (app: App, userId: string) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  // Set token
  const resetPasswordToken = cryptoHelper.createRandomString()
  await app.db.execute(queries.user.setResetPasswordToken(), [
    resetPasswordToken,
    userId
  ])
  return resetPasswordToken
}
export const voidPasswordResetToken = async (app: App, userId: string) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  // Void token
  await app.db.execute(queries.user.setResetPasswordToken(), [null, userId])
}
export const userIsLocked = async (app: App, userId: string) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  // Get user record
  const userRecord = await findComponent.findById(app, userId)
  if (!userRecord) throw Error("USER_DOES_NOT_EXIST")
  // Check if locked
  const lockedStatusRecords = (await app.db.execute(
    queries.user.checkLoginLockForUserId(),
    [userId]
  ))[0]
  return lockedStatusRecords[0].loginIsLockedNow
}
export const userHasPassword = async (app: App, userId: string) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  // Get user record
  const userRecord = await findComponent.findById(app, userId)
  if (!userRecord) throw Error("USER_DOES_NOT_EXIST")
  return !!userRecord.password
}
export const verifyUserPassword = async (
  app: App,
  userId: string,
  passwordToVerify
) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  if (!validateHelper.isString(passwordToVerify)) throw Error("INVALID_INPUT")
  // Get user record
  const userRecord = await findComponent.findById(app, userId)
  if (!userRecord) throw Error("USER_DOES_NOT_EXIST")
  return cryptoHelper.hashPassword.verify(passwordToVerify, userRecord.password)
}
export const increaseNumberOfFailedLoginAttempts = async (
  app: App,
  userId: string
) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  // Get user record
  const userRecord = await findComponent.findById(app, userId)
  if (!userRecord) throw Error("USER_DOES_NOT_EXIST")
  // Increase counter
  await app.db.execute(queries.user.increaseFailedLoginAttemptsForUserId(), [
    userRecord.id
  ])
}
export const lockUserIfRequired = async (app: App, userId: string) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  // Get user record
  const userRecord = await findComponent.findById(app, userId)
  if (!userRecord) throw Error("USER_DOES_NOT_EXIST")
  // Lock if required
  const lockResult = await app.db.execute(
    queries.user.lockUserLoginByUserId(app.module.user.loginLockTimeout),
    [userRecord.id, app.module.user.failedLoginAttemptsUntilLock]
  )
  const userLocked = lockResult[0].affectedRows > 0 ? true : false
  return userLocked
}
export const resetLoginLock = async (app: App, userId: string) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  // Void token
  await app.db.execute(queries.user.resetLoginLockForUserId(), [userId])
}
