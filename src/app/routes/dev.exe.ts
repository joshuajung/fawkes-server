// External imports

// Internal imports
import * as types from "../types"
import * as devComponent from "../components/dev"

export function setupRoutes(app: types.App) {
  app.get("/dev/helloWorld", async (req: types.Request, res: types.Response, next: Function) => {
    try {
      res.status(200).send({ result: "Hello world." })
    } catch (error) {
      next(error)
    }
  })
  app.get("/dev/restricted", async (req: types.Request, res: types.Response, next: Function) => {
    try {
      res.status(200).send({ result: "You have reached the restricted area." })
    } catch (error) {
      next(error)
    }
  })
  app.get("/dev/unauthorized", async (req: types.Request, res: types.Response, next: Function) => {
    try {
      res.status(200).send({ result: "You have reached the unauthorized area. That's impossible." })
    } catch (error) {
      next(error)
    }
  })
  app.get("/dev/error", async (req: types.Request, res: types.Response, next: Function) => {
    try {
      await devComponent.error(app)
    } catch (error) {
      next(error)
    }
  })
  app.get("/dev/debug", async (req: types.Request, res: types.Response, next: Function) => {
    try {
      await devComponent.debug(app)
    } catch (error) {
      next(error)
    }
  })
}
