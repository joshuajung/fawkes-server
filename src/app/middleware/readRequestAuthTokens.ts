// External imports

// Internal imports
import * as types from "../types"

export default function ReadRequestAuthTokens(app: types.App): any {
  return async (req: types.Request, res: types.Response, next: any) => {
    try {
      const headerAccessToken = req.header(
        app.module.user.accessTokenHeaderName
      )
      const urlAccessToken = req.params[app.module.user.accessTokenUrlParamName]
      req.accessToken = headerAccessToken || urlAccessToken
      req.accessTokenIsAvailable =
        (typeof req.accessToken === "undefined") === false
      next()
    } catch (error) {
      next(error)
    }
  }
}
