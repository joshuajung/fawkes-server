// External imports
import * as Express from "express"
import * as bodyParser from "body-parser"
import * as Helmet from "helmet"
import * as nodemailer from "nodemailer"
import * as cors from "cors"
import "source-map-support/register"

// Internal imports
import * as types from "./types"
import * as routes from "./routes"
// Middleware
import LogError from "./middleware/logError"
import sendHttpError from "./middleware/sendHttpError"
import catchError from "./middleware/catchError"
import catchAllRoutes from "./middleware/catchAllRoutes"
import ReadRequestAuthTokens from "./middleware/readRequestAuthTokens"
import RefreshSession from "./middleware/refreshSession"
import AddUserInformation from "./middleware/addUserInformation"
import gatekeeper from "./middleware/gatekeeper"
import * as AdvancedData from "./middleware/advancedData"
import RateLimiter from "./middleware/rateLimiter"
// Interfaces
import createDatabasePool from "./database/createPool"
// Helpers
import moduleLoader from "./helpers/moduleLoader"
import { Scheduler } from "./helpers/scheduler"
import { SocketManager } from "./helpers/socket"

export default function App(module: types.Module): types.App {
  // App initialization
  const app: types.App = Express()

  // Load module
  app.module = moduleLoader(module)

  // Enable trust proxy, if required
  if (app.module.environment.enableTrustProxy) app.enable("trust proxy")

  // Connect to database
  app.db = createDatabasePool(app.module.database)

  // Add mailing service
  app.mailer = nodemailer.createTransport(
    app.module.mailer.transporterConfiguration
  )

  // Pre-router middleware
  app.use(Helmet())
  app.use(cors())
  app.use(RateLimiter(app))
  app.use(ReadRequestAuthTokens(app))
  app.use(RefreshSession(app))
  app.use(AddUserInformation(app))
  app.use(bodyParser.json())
  app.use(AdvancedData.JsonToAdvancedData(app))
  // app.use(AdvancedData.AdvancedDataToJson(app))

  // Auth Routes
  routes.setupAuthRoutes(app)
  module.advancedObjects.forEach(ao => ao.registerAuthRoutes(app))

  // Gatekeeper
  app.use(gatekeeper)

  // Execution Routes
  routes.setupExeRoutes(app)
  module.advancedObjects.forEach(ao => ao.registerExeRoutes(app))

  // Post-router middleware
  app.use(catchAllRoutes)
  app.use(LogError(app))
  app.use(sendHttpError)
  app.use(catchError)

  // Start job scheduler
  app.scheduler = new Scheduler(app, module.scheduledJobs || [])

  // Initialize Socket manager
  let socketManager = new SocketManager(app)
  app.socketManager = socketManager
  app.server = socketManager.server

  return app
}
