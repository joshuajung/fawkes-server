// External imports

// Internal imports
import * as types from "../types"

// Route imports
import * as devAuthRoutes from "./dev.auth"
import * as devExeRoutes from "./dev.exe"
import * as userAuthRoutes from "./user.auth"
import * as userExeRoutes from "./user.exe"

export function setupAuthRoutes(app: types.App): void {
  devAuthRoutes.setupRoutes(app)
  userAuthRoutes.setupRoutes(app)
  app.module.setupAuthRoutes(app)
}

export function setupExeRoutes(app: types.App): void {
  devExeRoutes.setupRoutes(app)
  userExeRoutes.setupRoutes(app)
  app.module.setupExeRoutes(app)
}
