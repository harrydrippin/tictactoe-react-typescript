import Player from "./player";
import { Turn, GameState, CheckBoardResult } from "./game";

/**
 * Type enums
 */
export enum InputMessageType {
  NEW_GAME = 0,
  JOIN_GAME = 1,
  CHECK_BOARD = 2,
  RESTART = 3
}

export enum OutputMessageType {
  NEW_GAME = 4,
  CHECK_BOARD = 5,
  GAME_ESTABLISHED = 6,
  ERROR = 7
}

export enum ErrorType {
  USER_DISCONNECTED = -1,
  NO_PAYLOAD = -2,
  NO_GAME_BY_UUID = -3,
  NOT_YOUR_TURN = -4,
  NO_PLAYER_BY_SOCKET = -5,
  DEFAULT = -999
}

export function errorOutput(type: ErrorType): IOutputError {
  switch (type) {
    case ErrorType.USER_DISCONNECTED: 
      return {
        error: ErrorType.USER_DISCONNECTED,
        cause: "Your opponent was disconnected."
      }
    case ErrorType.NO_PAYLOAD:
      return {
        error: ErrorType.NO_PAYLOAD,
        cause: "No payload was detected on your request."
      }
    case ErrorType.NO_GAME_BY_UUID:
      return {
        error: ErrorType.NO_GAME_BY_UUID,
        cause: "No game was found by given uuid"
      }
    case ErrorType.NOT_YOUR_TURN:
      return {
        error: ErrorType.NOT_YOUR_TURN,
        cause: "It's not your turn!"
      }
    case ErrorType.NO_PLAYER_BY_SOCKET:
      return {
        error: ErrorType.NO_PLAYER_BY_SOCKET,
        cause: "No player was found by given socket object"
      }
    default:
      return {
        error: ErrorType.DEFAULT,
        cause: "This error was not expected."
      }
  }
}

/**
 * Input message interfaces
 */
export interface IInputNewGame {
  name: string
}

export interface IInputJoinGame {
  uuid: string,
  name: string
}

export interface IInputCheckBoard {
  uuid: string,
  index: number
}

export interface IInputRestart {
  uuid: string
}

/**
 * Output message interfaces
 */
export interface IOutputNewGame {
  uuid: string
}

export interface IOutputCheckBoard {
  uuid: string,
  result: CheckBoardResult,
  state: GameState,
  model: number[],
  turn: Turn
}

export interface IOutputGameEstablished {
  uuid: string,
  players: {
    'O': {
      name: string,
      socket: string
    },
    'X': {
      name: string,
      socket: string
    }
  }
}

export interface IOutputError {
  error: ErrorType,
  cause: string
}

/**
 * Type binding
 */
export type MessageType = InputMessageType | OutputMessageType;

export type InputMessage = IInputNewGame | IInputJoinGame | IInputCheckBoard 
  | IInputRestart;

export type OutputMessage = IOutputCheckBoard | IOutputError | IOutputGameEstablished
  | IOutputNewGame;

export type MessagePayload = InputMessage | OutputMessage;

/**
 * Message class
 */
export class Message {
  private type: MessageType;
  private sender?: Player;
  private payload?: MessagePayload;

  constructor(type: MessageType, payload?: MessagePayload, sender?: Player) {
    this.type = type;

    if (payload) {
      this.payload = payload;
    }

    if (sender) {
      this.sender = sender;
    }
  }

  public getType(): MessageType {
    return this.type;
  }

  public getPayload(): MessagePayload | undefined {
    return this.payload;
  } 

  public static getMessageFromObject(input: object): Message {
    if (input["sender"] !== undefined) {
      return new Message(input["type"], input["payload"], input["sender"]);
    } else {
      return new Message(input["type"], input["payload"]);
    }
  }
}