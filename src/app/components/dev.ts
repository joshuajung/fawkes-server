// Internal imports
import { App } from "../types"

export const error = async (app: App) => {
  throw Error("TEST_ERROR")
}
export const debug = async (app: App) => {
  debugger
}
