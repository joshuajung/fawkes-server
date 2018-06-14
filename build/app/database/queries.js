"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queries = {
    user: {
        getUserByEmail: () => "SELECT * FROM users WHERE email=?",
        getUserById: () => "SELECT * FROM users WHERE id=?",
        getUserByResetPasswordToken: () => "SELECT * FROM users WHERE resetPasswordToken=?",
        getUserByLoginToken: () => "SELECT * FROM users WHERE loginToken=?",
        createUser: () => "INSERT INTO users SET id=?, email=?, password=?",
        createSession: (tokenTimeoutSanitized) => "INSERT INTO sessions SET token=?, user=?, expires=DATE_ADD(NOW(), INTERVAL " +
            tokenTimeoutSanitized +
            " second)",
        refreshSession: (tokenTimeoutSanitized) => "UPDATE sessions SET refreshed=NOW(), expires=DATE_ADD(NOW(), INTERVAL " +
            tokenTimeoutSanitized +
            " second) WHERE token=? AND expires > NOW()",
        deleteSession: () => "DELETE FROM sessions WHERE token=?",
        deleteAllSessionsForUserId: () => "DELETE FROM sessions WHERE user=?",
        getUserForSessionToken: () => "SELECT users.* FROM sessions LEFT JOIN users ON sessions.user=users.id WHERE sessions.token=?",
        getUserGroupsForUserId: () => "SELECT userGroups.key FROM userGroupAssignments LEFT JOIN userGroups ON userGroupAssignments.userGroup=userGroups.key WHERE userGroupAssignments.user=?",
        checkLoginLockForUserId: () => "SELECT (loginLockedUntil IS NOT NULL AND loginLockedUntil>NOW()) AS loginIsLockedNow FROM users WHERE id=?",
        resetLoginLockForUserId: () => "UPDATE users SET failedLoginAttempts=0, loginLockedUntil=NULL WHERE id=?",
        updateLastSuccessfulLoginForUserId: () => "UPDATE users SET lastSuccessfulLogin=NOW() WHERE id=?",
        increaseFailedLoginAttemptsForUserId: () => "UPDATE users SET failedLoginAttempts=failedLoginAttempts+1 WHERE id=?",
        lockUserLoginByUserId: (lockTimeoutSanitized) => "UPDATE users SET failedLoginAttempts=0, loginLockedUntil=DATE_ADD(NOW(), INTERVAL " +
            lockTimeoutSanitized +
            " second) WHERE id=? AND failedLoginAttempts>=?",
        setNewPasswordForUserId: () => "UPDATE users SET password=? WHERE id=?",
        setResetPasswordToken: () => "UPDATE users SET resetPasswordToken=? WHERE id=?",
        setLoginToken: () => "UPDATE users SET loginToken=? WHERE id=?",
        addUserIdToGroup: () => "INSERT INTO userGroupAssignments SET id=?, user=?, userGroup=?",
        setUserSetting: () => "INSERT INTO userSettings SET id=?, user=?, settingKey=?, settingValue=? ON DUPLICATE KEY UPDATE settingValue=?",
        getUserSettings: () => "SELECT * FROM userSettings WHERE user=?"
    },
    global: {
        getSchema: () => "SELECT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=?",
        fromComponents: (queryComponentsSanitized) => queryComponentsSanitized.join(" "),
        existsUniquely: (tableNameSanitized, primaryKeyColumnNameSanitized) => "SELECT COUNT(" +
            primaryKeyColumnNameSanitized +
            ")=1 AS result FROM " +
            tableNameSanitized +
            " WHERE " +
            primaryKeyColumnNameSanitized +
            "=?"
    }
};
exports.default = queries;
//# sourceMappingURL=queries.js.map