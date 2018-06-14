// External imports

// Internal imports
import * as types from "../types"
import errors from "../helpers/errors"

export default function sendHttpError(err: Error, req: types.Request, res: types.Response, next: any) {
  const errorDetails = errors[err.message] || errors["OTHER_ERROR"]
  res.status(errorDetails.httpStatus).send({
    error: true,
    code: errorDetails.publicCode
  })
  next(err)
}
