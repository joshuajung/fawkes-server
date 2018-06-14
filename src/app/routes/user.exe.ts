// External imports

// Internal imports
import * as types from "../types"
import * as userComponent from "../components/user"

export function setupRoutes(app: types.App): void {
  app.post(
    "/user/createWithEmail",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        await userComponent.createWithEmail(
          app,
          req.body["email"].value,
          req.body["password"].value
        )
        const loginResult = await userComponent.logInWithEmail(
          app,
          req.body["email"].value,
          req.body["password"].value
        )
        const userInfo = await userComponent.getUserForSessionToken(
          app,
          loginResult.accessToken
        )
        res.status(201).send({
          code: "USER_CREATED",
          accessToken: loginResult.accessToken,
          userInfo: userInfo
        })
      } catch (error) {
        next(error)
      }
    }
  )
  app.post(
    "/user/exists",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        const result = await userComponent.exists(app, req.body["email"])
        res.status(200).send({ code: "CHECK_SUCCESSFUL", userExists: result })
      } catch (error) {
        next(error)
      }
    }
  )
  app.post(
    "/user/logInWithEmail",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        const result = await userComponent.logInWithEmail(
          app,
          req.body["email"].value,
          req.body["password"].value
        )
        const userInfo = await userComponent.getUserForSessionToken(
          app,
          result.accessToken
        )
        res.status(200).send({
          code: "LOGIN_SUCCESSFUL",
          accessToken: result.accessToken,
          userInfo: userInfo
        })
      } catch (error) {
        next(error)
      }
    }
  )
  app.post(
    "/user/logInWithToken",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        const result = await userComponent.logInWithToken(
          app,
          req.body["token"]
        )
        const userInfo = await userComponent.getUserForSessionToken(
          app,
          result.accessToken
        )
        res.status(200).send({
          code: "LOGIN_SUCCESSFUL",
          accessToken: result.accessToken,
          userInfo: userInfo
        })
      } catch (error) {
        next(error)
      }
    }
  )
  app.post(
    "/user/sendLoginLink",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        await userComponent.sendLoginLink(
          app,
          req.body["email"].value,
          req.body["loginLinkBaseUrl"]
        )
        res.status(200).send({ code: "LOGIN_LINK_SENT" })
      } catch (error) {
        next(error)
      }
    }
  )
  app.post(
    "/user/logOut",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        await userComponent.destroySession(app, req.accessToken)
        res.status(200).send({ code: "LOGOUT_SUCCESSFUL" })
      } catch (error) {
        next(error)
      }
    }
  )
  app.post(
    "/user/logOutEverywhere",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        await userComponent.destroyAllSessions(app, req.userInfo.userId)
        res.status(200).send({ code: "LOGOUT_SUCCESSFUL" })
      } catch (error) {
        next(error)
      }
    }
  )
  app.post(
    "/user/setNewPasswordWithOldPassword",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        await userComponent.setNewPasswordWithOldPassword(
          app,
          req.userInfo.userId,
          req.body["newPassword"].value,
          req.body["oldPassword"].value
        )
        res.status(200).send({ code: "NEW_PASSWORD_SET" })
      } catch (error) {
        next(error)
      }
    }
  )
  app.post(
    "/user/setNewPasswordWithToken",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        await userComponent.setNewPasswordWithToken(
          app,
          req.body["token"],
          req.body["newPassword"].value
        )
        res.status(200).send({ code: "NEW_PASSWORD_SET" })
      } catch (error) {
        next(error)
      }
    }
  )
  app.post(
    "/user/sendResetPasswordLink",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        await userComponent.sendResetPasswordLink(
          app,
          req.body["email"].value,
          req.body["resetPasswordLinkBaseUrl"]
        )
        res.status(200).send({ code: "RESET_PASSWORD_LINK_SENT" })
      } catch (error) {
        next(error)
      }
    }
  )
  app.post(
    "/user/setUserSetting",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        await userComponent.setSettings(app, req.userInfo.userId, req.body)
        const settings = await userComponent.settings(app, req.userInfo.userId)
        res
          .status(200)
          .send({ code: "USER_SETTINGS_SET", userSettings: settings })
      } catch (error) {
        next(error)
      }
    }
  )
  app.get(
    "/user/userSettings",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        const settings = await userComponent.settings(app, req.userInfo.userId)
        res
          .status(200)
          .send({ code: "USER_SETTINGS_ATTACHED", userSettings: settings })
      } catch (error) {
        next(error)
      }
    }
  )
  app.get(
    "/user/info",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        const result = await req.userInfo
        res.status(200).send({ code: "USER_INFO_ATTACHED", userInfo: result })
      } catch (error) {
        next(error)
      }
    }
  )
}
