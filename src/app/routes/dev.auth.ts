// External imports

// Internal imports
import * as types from "../types"

export function setupRoutes(app: types.App) {
  app.get(
    "/dev/helloWorld",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = true
      next()
    }
  )
  app.get(
    "/dev/restricted",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = !!req.userIsLoggedIn
      next()
    }
  )
  app.get(
    "/dev/unauthorized",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = false
      next()
    }
  )
  app.get(
    "/dev/error",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = true
      next()
    }
  )
  app.get(
    "/dev/debug",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = true
      next()
    }
  )
  app.get(
    "/dev/getSocketForSession",
    async (req: types.Request, res: types.Response, next: Function) => {
      req.accessGranted = true
      next()
    }
  )
}
