"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql2/promise");
function createPool(databaseConfig) {
    return mysql.createPool({
        connectionLimit: databaseConfig.poolSize,
        host: databaseConfig.host,
        port: databaseConfig.port,
        user: databaseConfig.user,
        password: databaseConfig.password,
        database: databaseConfig.database,
        dateStrings: true
    });
}
exports.default = createPool;
//# sourceMappingURL=createPool.js.map