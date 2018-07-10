/**
 * Real constats
 */
export const URL: string = "https://pure-badlands-47769.herokuapp.com/";

/**
 * Store
 */
export interface IStoreState {
  state: GameState;
  turn: number;
  model: number[];
  judge: CheckBoardResult;
  mode: GameMode;
  type: MultiGameType;
  me: {
    name: string,
    turn: Turn
  }
  conn: {
    id: string,
    game: IOutputGameEstablished
  }
};

/**
 * Type enums
 */
export const enum InputMessageType {
  NEW_GAME = 0,
  JOIN_GAME = 1,
  CHECK_BOARD = 2,
  RESTART = 3
}

export const enum OutputMessageType {
  NEW_GAME = 4,
  CHECK_BOARD = 5,
  GAME_ESTABLISHED = 6,
  ERROR = 7
}

export const enum ErrorType {
  USER_DISCONNECTED = -1,
  NO_PAYLOAD = -2,
  NO_GAME_BY_UUID = -3,
  NOT_YOUR_TURN = -4,
  NO_PLAYER_BY_SOCKET = -5,
  DEFAULT = -999
};

export const enum GameMode {
  SINGLE = "SINGLE",
  MULTI = "MULTI"
}

export const enum MultiGameType {
  NEW = "new",
  JOIN = "join"
}

export const enum GameState {
  GAME_PREPARING,
  GAME_RUNNING,
  GAME_OVER
};

export const enum CheckBoardResult {
  KEEP_RUNNING = 0,
  O_WIN = 1,
  X_WIN = 2,
  DRAW = 3,
  PLAYER_NOT_EXPECTED = -1,
  NOT_YOUR_TURN = -2,
  ALREADY_MARKED = -3,
  MARK_AFTER_GAME_OVER = -4
}

export const enum ActionType {
  INITIALIZE_MULTI_GAME = 'INITIALIZE_MULTI_GAME',
  MARK_MODE = 'MARK_MODE',
  CHECK_BOARD = 'CHECK_BOARD',
  RESTART = 'RESTART',
  BOARD_UPDATE = 'BOARD_UPDATE',
  ON_WAITING_OPPONENT = 'ON_WAITING_OPPONENT',
  ON_GAME_ESTABLISHED = 'ON_GAME_ESTABLISHED',
  ON_GAME_ERROR = 'ON_GAME_ERROR'
}

export const enum Turn {
  O = 1,
  X = -1,
  UNDEFINED = 0
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
      name: string
    },
    'X': {
      name: string
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
  public static getMessageFromObject(input: object): Message {
    // tslint:disable:no-string-literal
    if (input["sender"] !== undefined) {
      return new Message(input["type"], input["payload"], input["sender"]);
    } else {
      return new Message(input["type"], input["payload"]);
    }
  }

  private type: MessageType;
  private sender?: any; // Not necessary for the client
  private payload?: MessagePayload;

  constructor(type: MessageType, payload?: MessagePayload, sender?: any) {
    this.type = type;

    if (payload) {
      this.payload = payload;
    }

    if (sender) {
      this.sender = sender;
    }
  }

  public getSender(): any {
    return this.sender;
  }

  public getType(): MessageType {
    return this.type;
  }

  public getPayload(): MessagePayload | undefined {
    return this.payload;
  } 

}