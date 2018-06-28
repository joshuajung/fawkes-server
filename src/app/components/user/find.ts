// External imports

// Internal imports
import { App } from "../../types"
import queries from "../../database/queries"
import { validateHelper } from "../../../support"
import * as groupsComponent from "./groups"

export const findById = async (app: App, id: string) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(id)) throw Error("INVALID_INPUT")
  // Find record
  const userRecords = (await app.db.execute(queries.user.getUserById(), [
    id
  ]))[0]
  if (userRecords.length === 0) {
    return null
  } else if (userRecords.length === 1) {
    return userRecords[0]
  } else {
    throw Error("OTHER_ERROR")
  }
}
export const findByEmail = async (app: App, email: string) => {
  // Sanitize and validate input
  if (!validateHelper.isEmail(email)) throw Error("INVALID_INPUT")
  // Find record
  const userRecords = (await app.db.execute(queries.user.getUserByEmail(), [
    email
  ]))[0]
  if (userRecords.length === 0) {
    return null
  } else if (userRecords.length === 1) {
    return userRecords[0]
  } else {
    throw Error("OTHER_ERROR")
  }
}
export const findByAppleIdentifier = async (
  app: App,
  appleIdentifier: string
) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(appleIdentifier)) throw Error("INVALID_INPUT")
  // Find record
  const userRecords = (await app.db.execute(
    queries.user.getUserByAppleIdentifier(),
    [appleIdentifier]
  ))[0]
  if (userRecords.length === 0) {
    return null
  } else if (userRecords.length === 1) {
    return userRecords[0]
  } else {
    throw Error("OTHER_ERROR")
  }
}
export const findByResetPasswordToken = async (
  app: App,
  resetPasswordToken: string
) => {
  // Sanitize and validate input
  if (!validateHelper.isString(resetPasswordToken)) throw Error("INVALID_INPUT")
  // Find record
  const userRecords = (await app.db.execute(
    queries.user.getUserByResetPasswordToken(),
    [resetPasswordToken]
  ))[0]
  if (userRecords.length === 0) {
    return null
  } else if (userRecords.length === 1) {
    return userRecords[0]
  } else {
    throw Error("OTHER_ERROR")
  }
}
export const findByLoginToken = async (app: App, loginToken: string) => {
  // Sanitize and validate input
  if (!validateHelper.isString(loginToken)) throw Error("INVALID_INPUT")
  // Find record
  const userRecords = (await app.db.execute(
    queries.user.getUserByLoginToken(),
    [loginToken]
  ))[0]
  if (userRecords.length === 0) {
    return null
  } else if (userRecords.length === 1) {
    return userRecords[0]
  } else {
    throw Error("OTHER_ERROR")
  }
}
export const findByAccessToken = async (app: App, accessToken: string) => {
  // Get User information
  const userQuery = queries.user.getUserForSessionToken()
  const userQueryResult = await app.db.execute(userQuery, [accessToken])
  const userRecords = userQueryResult[0]
  if (userRecords.length === 0) {
    return null
  } else if (userRecords.length === 1) {
    return userRecords[0]
  } else {
    throw Error("OTHER_ERROR")
  }
}

export const getRichUserRecordById = async (app: App, userId: string) => {
  // Sanitize and validate input
  if (!validateHelper.isGuid(userId)) throw Error("INVALID_INPUT")
  // Get Base User
  const userRecord = await findById(app, userId)
  if (!userRecord) return null
  // Get User Groups
  const userGroupKeys = await groupsComponent.groupsForUser(app, userId)
  return {
    userId: userRecord.id,
    email: userRecord.email,
    userGroups: userGroupKeys
  }
}
