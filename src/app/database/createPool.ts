// External imports
import * as mysql from "mysql2/promise"

// Internal imports

export default function createPool(databaseConfig: any) {
  return mysql.createPool({
    connectionLimit: databaseConfig.poolSize,
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.database,
    dateStrings: true
  })
}
