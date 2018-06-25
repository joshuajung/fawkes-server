// Internal imports
import { App } from "../types"

export const error = async (app: App) => {
  throw Error("TEST_ERROR")
}
export const debug = async (app: App) => {
  debugger
}
export const getSocketForSession = async (app: App) => {
  app.socketManager.getSocketsForSession(
    "dc2227fc9e1a412b77f2312d42d81c2c4728b937c31e7965387cd55cde58f91c"
  )
  return
}
