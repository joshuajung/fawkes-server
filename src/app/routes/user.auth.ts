// External imports

// Internal imports
import * as types from "../types"

export function setupRoutes(app: types.App): void {
  app.post(
    "/user/createWithEmail",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = true
      next()
    }
  )
  app.post(
    "/user/exists",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = true
      next()
    }
  )
  app.post(
    "/user/logInWithEmail",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = true
      next()
    }
  )
  app.post(
    "/user/logInWithToken",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = true
      next()
    }
  )
  app.post(
    "/user/sendLoginLink",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = true
      next()
    }
  )
  app.post(
    "/user/createOrLogInWithAppleIdentifier",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = true
      next()
    }
  )
  app.post(
    "/user/logOut",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = !!req.userIsLoggedIn
      next()
    }
  )
  app.post(
    "/user/logOutEverywhere",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = !!req.userIsLoggedIn
      next()
    }
  )
  app.post(
    "/user/setNewPasswordWithOldPassword",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = !!req.userIsLoggedIn
      next()
    }
  )
  app.post(
    "/user/setNewPasswordWithToken",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = true
      next()
    }
  )
  app.post(
    "/user/sendResetPasswordLink",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = true
      next()
    }
  ) /*
  app.post(
    "/user/setUserSettings",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = !!req.userIsLoggedIn
      next()
    }
  )
  app.get(
    "/user/userSettings",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = !!req.userIsLoggedIn
      next()
    }
  )*/
  app.get(
    "/user/info",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = !!req.userIsLoggedIn
      next()
    }
  )
}
