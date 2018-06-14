// External imports

// Internal imports
import * as types from "../types"

export default function LogError(app: types.App): any {
  return async (err: Error, req: types.Request, res: types.Response, next: any) => {
    if (app.module.environment.logErrors) {
      console.log("Error thrown and handled:")
      console.log(err)
    }
    next(err)
  }
}
