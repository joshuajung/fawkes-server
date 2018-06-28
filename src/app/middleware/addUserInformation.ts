// External imports

// Internal imports
import * as types from "../types"
import * as findUserComponent from "../components/user/find"

export default function AddUserInformation(app: types.App): any {
  return async (req: types.Request, res: types.Response, next: any) => {
    try {
      if (req.accessTokenIsAvailable && !req.accessTokenIsInvalid) {
        const userId = await findUserComponent.findByAccessToken(
          app,
          req.accessToken
        )
        req.userInfo = await findUserComponent.getRichUserRecordById(
          app,
          userId
        )
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
