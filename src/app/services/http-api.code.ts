export enum ApiSuccessCode {
    STATUS_OK = 100,
    STATUS_OK_DEPLOY_STARTED = 101,
    STATUS_OK_PARTIALLY = 102,
}

export enum ApiErrorCode {
    STATUS_ERROR_GENERIC = 1000,
    STATUS_ERROR_CAPTAIN_NOT_INITIALIZED = 1001,
    STATUS_ERROR_USER_NOT_INITIALIZED = 1101,
    STATUS_ERROR_NOT_AUTHORIZED = 1102,
    STATUS_ERROR_ALREADY_EXIST = 1103,
    STATUS_ERROR_BAD_NAME = 1104,
    STATUS_WRONG_PASSWORD = 1105,
    STATUS_AUTH_TOKEN_INVALID = 1106,
    VERIFICATION_FAILED = 1107,
    ILLEGAL_OPERATION = 1108,
    BUILD_ERROR = 1109,
    ILLEGAL_PARAMETER = 1110,
    NOT_FOUND = 1111,
    AUTHENTICATION_FAILED = 1112,
    STATUS_PASSWORD_BACK_OFF = 1113,
}

export const OkCodes = [
    ApiSuccessCode.STATUS_OK,
    ApiSuccessCode.STATUS_OK_DEPLOY_STARTED,
    ApiSuccessCode.STATUS_OK_PARTIALLY,
];

export const ErrorCodes = [
    ApiErrorCode.STATUS_ERROR_GENERIC,
    ApiErrorCode.STATUS_ERROR_CAPTAIN_NOT_INITIALIZED,
    ApiErrorCode.STATUS_ERROR_USER_NOT_INITIALIZED,
    ApiErrorCode.STATUS_ERROR_NOT_AUTHORIZED,
    ApiErrorCode.STATUS_ERROR_ALREADY_EXIST,
    ApiErrorCode.STATUS_ERROR_BAD_NAME,
    ApiErrorCode.STATUS_WRONG_PASSWORD,
    ApiErrorCode.STATUS_AUTH_TOKEN_INVALID,
    ApiErrorCode.VERIFICATION_FAILED,
    ApiErrorCode.ILLEGAL_OPERATION,
    ApiErrorCode.BUILD_ERROR,
    ApiErrorCode.ILLEGAL_PARAMETER,
    ApiErrorCode.NOT_FOUND,
    ApiErrorCode.AUTHENTICATION_FAILED,
    ApiErrorCode.STATUS_PASSWORD_BACK_OFF,
];