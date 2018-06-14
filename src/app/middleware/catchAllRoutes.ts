// External imports

// Internal imports
import * as types from "../types"

export default function catchAllRoutes(req: types.Request, res: types.Response, next: any) {
  next(Error("NOT_FOUND"))
}
