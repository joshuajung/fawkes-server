// External imports

// Internal imports
import * as types from "../types"
import * as userComponent from "../components/user"

export default function AddUserInformation(app: types.App): any {
  return async (req: types.Request, res: types.Response, next: any) => {
    try {
      if (req.accessTokenIsAvailable && !req.accessTokenIsInvalid) {
        req.userInfo = await userComponent.getUserForSessionToken(app, req.accessToken)
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
