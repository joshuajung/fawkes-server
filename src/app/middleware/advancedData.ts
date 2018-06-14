// External imports
// import * as interceptor from "express-interceptor"

// Internal imports
import * as types from "../types"
import * as advancedDataType from "../types/advancedDataTypes/advancedDataType"

/*export function AdvancedDataToJson(app: types.App): any {
  return interceptor((req: types.Request, res: types.Response) => ({
    isInterceptable: () => {
      return res.get("Content-Type").indexOf("application/json") !== 1
    },
    intercept: (body, send) => {
      debugger
      send(JSON.stringify(advancedDataType.toJsonDeep(JSON.parse(body))))
    }
  }))
}*/

export function JsonToAdvancedData(app: types.App): any {
  return async (req: types.Request, res: types.Response, next: any) => {
    try {
      req.body = advancedDataType.fromJsonDeep(req.body)
      next()
    } catch (error) {
      next(error)
    }
  }
}
