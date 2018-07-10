"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Type enums
 */
var InputMessageType;
(function (InputMessageType) {
    InputMessageType[InputMessageType["NEW_GAME"] = 0] = "NEW_GAME";
    InputMessageType[InputMessageType["JOIN_GAME"] = 1] = "JOIN_GAME";
    InputMessageType[InputMessageType["CHECK_BOARD"] = 2] = "CHECK_BOARD";
    InputMessageType[InputMessageType["RESTART"] = 3] = "RESTART";
})(InputMessageType = exports.InputMessageType || (exports.InputMessageType = {}));
var OutputMessageType;
(function (OutputMessageType) {
    OutputMessageType[OutputMessageType["NEW_GAME"] = 4] = "NEW_GAME";
    OutputMessageType[OutputMessageType["CHECK_BOARD"] = 5] = "CHECK_BOARD";
    OutputMessageType[OutputMessageType["GAME_ESTABLISHED"] = 6] = "GAME_ESTABLISHED";
    OutputMessageType[OutputMessageType["ERROR"] = 7] = "ERROR";
})(OutputMessageType = exports.OutputMessageType || (exports.OutputMessageType = {}));
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["USER_DISCONNECTED"] = -1] = "USER_DISCONNECTED";
    ErrorType[ErrorType["NO_PAYLOAD"] = -2] = "NO_PAYLOAD";
    ErrorType[ErrorType["NO_GAME_BY_UUID"] = -3] = "NO_GAME_BY_UUID";
    ErrorType[ErrorType["NOT_YOUR_TURN"] = -4] = "NOT_YOUR_TURN";
    ErrorType[ErrorType["NO_PLAYER_BY_SOCKET"] = -5] = "NO_PLAYER_BY_SOCKET";
    ErrorType[ErrorType["DEFAULT"] = -999] = "DEFAULT";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
function errorOutput(type) {
    switch (type) {
        case ErrorType.USER_DISCONNECTED:
            return {
                error: ErrorType.USER_DISCONNECTED,
                cause: "Your opponent was disconnected."
            };
        case ErrorType.NO_PAYLOAD:
            return {
                error: ErrorType.NO_PAYLOAD,
                cause: "No payload was detected on your request."
            };
        case ErrorType.NO_GAME_BY_UUID:
            return {
                error: ErrorType.NO_GAME_BY_UUID,
                cause: "No game was found by given uuid"
            };
        case ErrorType.NOT_YOUR_TURN:
            return {
                error: ErrorType.NOT_YOUR_TURN,
                cause: "It's not your turn!"
            };
        case ErrorType.NO_PLAYER_BY_SOCKET:
            return {
                error: ErrorType.NO_PLAYER_BY_SOCKET,
                cause: "No player was found by given socket object"
            };
        default:
            return {
                error: ErrorType.DEFAULT,
                cause: "This error was not expected."
            };
    }
}
exports.errorOutput = errorOutput;
/**
 * Message class
 */
class Message {
    constructor(type, payload, sender) {
        this.type = type;
        if (payload) {
            this.payload = payload;
        }
        if (sender) {
            this.sender = sender;
        }
    }
    getType() {
        return this.type;
    }
    getPayload() {
        return this.payload;
    }
    static getMessageFromObject(input) {
        if (input["sender"] !== undefined) {
            return new Message(input["type"], input["payload"], input["sender"]);
        }
        else {
            return new Message(input["type"], input["payload"]);
        }
    }
}
exports.Message = Message;
