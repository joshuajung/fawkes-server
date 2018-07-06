// External imports
import * as RateLimit from "express-rate-limit"

// Internal imports
import * as types from "../types"

export default function RateLimiter(app: types.App): any {
  if (app.module.server.rateLimit.enabled) {
    return new RateLimit({
      windowMs: app.module.server.rateLimit.timeFrame * 1000,
      max: app.module.server.rateLimit.numberOfRequests,
      delayMs: 0,
      handler: (req: types.Request, res: types.Response) => {
        throw Error("RATE_LIMIT_EXCEEDED")
      }
    })
  } else {
    return (req: types.Request, res: types.Response, next: any) => {
      next()
    }
  }
}
