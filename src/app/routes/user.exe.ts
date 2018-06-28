// External imports

// Internal imports
import * as types from "../types"
import * as userCreateComponent from "../components/user/create"
import * as userExistsComponent from "../components/user/exists"
import * as userPasswordComponent from "../components/user/password"
import * as userSessionComponent from "../components/user/session"
import * as userSettingsComponent from "../components/user/settings"
import * as userFindComponent from "../components/user/find"

export function setupRoutes(app: types.App): void {
  app.post(
    "/user/createWithEmail",
    async (req: types.Request, res: types.Response, next: Function) => {
      try {
        await userCreateComponent.createWithEmail(
          app,
          req.body["email"].value,
          req.body["password"].value
        )
        const loginResult = await userSessionComponent.logInWithEmail(
          app,
          req.body["email"].value,
          req.body["password"].value
        )
        const userInfo = await userFindComponent.getRichUserRecordById(
          app,
          loginResult.userId
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
        const result = await userExistsComponent.emailExists(
          app,
          req.body["email"]
        )
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
        const loginResult = await userSessionComponent.logInWithEmail(
          app,
          req.body["email"].value,
          req.body["password"].value
        )
        const userInfo = await userFindComponent.getRichUserRecordById(
          app,
          loginResult.userId
        )
        res.status(200).send({
          code: "LOGIN_SUCCESSFUL",
          accessToken: loginResult.accessToken,
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
        const loginResult = await userSessionComponent.logInWithToken(
          app,
          req.body["token"]
        )
        const userInfo = await userFindComponent.getRichUserRecordById(
          app,
          loginResult.userId
        )
        res.status(200).send({
          code: "LOGIN_SUCCESSFUL",
          accessToken: loginResult.accessToken,
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
        await userSessionComponent.sendLoginLink(
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
        await userSessionComponent.destroySession(app, req.accessToken)
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
        await userSessionComponent.destroyAllSessions(app, req.userInfo.userId)
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
        await userPasswordComponent.setNewPasswordWithOldPassword(
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
        await userPasswordComponent.setNewPasswordWithToken(
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
        await userPasswordComponent.sendResetPasswordLink(
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
        await userSettingsComponent.setSettings(
          app,
          req.userInfo.userId,
          req.body
        )
        const settings = await userSettingsComponent.settings(
          app,
          req.userInfo.userId
        )
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
        const settings = await userSettingsComponent.settings(
          app,
          req.userInfo.userId
        )
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
