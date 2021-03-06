// External imports

// Internal imports
import * as types from "../types"
import * as userComponent from "../components/user"

export default function RefreshSession(app: types.App): any {
  return async (req: types.Request, res: types.Response, next: any) => {
    try {
      if (req.accessTokenIsAvailable === false) {
        req.accessTokenIsInvalid = false
        next()
      } else {
        // Refresh access token
        const accessTokenValid = await userComponent.checkAndRefreshSession(
          app,
          req.accessToken
        )
        if (accessTokenValid === false) {
          req.accessTokenIsInvalid = true
          next()
        } else {
          req.accessTokenIsInvalid = false
          req.userIsLoggedIn = true
          next()
        }
      }
    } catch (error) {
      next(error)
    }
  }
}
