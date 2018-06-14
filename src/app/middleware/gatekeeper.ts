// External imports

// Internal imports
import * as types from "../types"

export default function gatekeeper(req: types.Request, res: types.Response, next: any) {
  try {
    if(req.accessGranted === true) {
      next()
    } else {
      next(Error("ACCESS_DENIED"))
    }
  } catch (error) {
    next(error)
  }
}
