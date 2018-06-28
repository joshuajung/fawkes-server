// External imports

// Internal imports
import { App } from "../../types"
import * as cryptoHelper from "../../helpers/crypto"
import queries from "../../database/queries"
import { validateHelper } from "../../../support"
import * as existsComponent from "./exists"

export const addToGroup = async (
  app: App,
  userId: string,
  groupKey: string
) => {
  if (!validateHelper.isGuid(userId) || !validateHelper.isString(groupKey))
    throw Error("INVALID_INPUT")
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
export const groupsForUser = async (app: App, userId: string) => {
  if (!validateHelper.isString(userId)) throw Error("INVALID_INPUT")
  const exists = await existsComponent.idExists(app, userId)
  if (!exists) throw Error("INVALID_INPUT")
  // Get User Group information
  const userGroupQuery = queries.user.getUserGroupsForUserId()
  const userGroupQueryResult = await app.db.execute(userGroupQuery, [userId])
  const userGroupRecords = userGroupQueryResult[0]
  return userGroupRecords.map(userGroupRecord => userGroupRecord.key)
}
