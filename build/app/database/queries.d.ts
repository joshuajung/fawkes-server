declare const queries: {
    user: {
        getUserByEmail: () => string;
        getUserById: () => string;
        getUserByResetPasswordToken: () => string;
        getUserByLoginToken: () => string;
        createUser: () => string;
        createSession: (tokenTimeoutSanitized: number) => string;
        refreshSession: (tokenTimeoutSanitized: number) => string;
        deleteSession: () => string;
        deleteAllSessionsForUserId: () => string;
        getUserForSessionToken: () => string;
        getUserGroupsForUserId: () => string;
        checkLoginLockForUserId: () => string;
        resetLoginLockForUserId: () => string;
        updateLastSuccessfulLoginForUserId: () => string;
        increaseFailedLoginAttemptsForUserId: () => string;
        lockUserLoginByUserId: (lockTimeoutSanitized: number) => string;
        setNewPasswordForUserId: () => string;
        setResetPasswordToken: () => string;
        setLoginToken: () => string;
        addUserIdToGroup: () => string;
        setUserSetting: () => string;
        getUserSettings: () => string;
    };
    global: {
        getSchema: () => string;
        fromComponents: (queryComponentsSanitized: string[]) => string;
        existsUniquely: (tableNameSanitized: string, primaryKeyColumnNameSanitized: string) => string;
    };
};
export default queries;
