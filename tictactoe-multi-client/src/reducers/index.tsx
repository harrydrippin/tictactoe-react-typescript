import { RootAction } from "../actions";
import * as constants from "../constants";

import getManager from "../managers";
import ConnectionManager from "../managers/connection";

const conn: ConnectionManager = getManager().getConnectionManager();

export function rootReducer(state: constants.IStoreState, action: RootAction): constants.IStoreState {
  switch(action.type) {
    case constants.ActionType.INITIALIZE_MULTI_GAME:
      return {
        ...state,
        conn: {
          game: state.conn.game,
          id: action.uuid
        },
        me: {
          name: action.name,
          turn: state.me.turn
        },
        type: action.multi,
      }
    case constants.ActionType.MARK_MODE:
      if (action.mode === constants.GameMode.SINGLE) {
        return {...state, 
          judge: constants.CheckBoardResult.KEEP_RUNNING,
          mode: action.mode,
          model: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          state: constants.GameState.GAME_RUNNING,
          turn: constants.Turn.O
        };
      } else {
        return {...state,
          mode: action.mode
        };
      }
      
    case constants.ActionType.CHECK_BOARD:
      if (state.mode === constants.GameMode.SINGLE) {
        const nextModel: number[] = state.model;

        // Mark
        if (state.state === constants.GameState.GAME_OVER) {
          alert("Game over! Please restart the game.");
          return state;
        } else if (nextModel[action.boxIndex] !== 0) {
          alert("Already marked! Try another space.");
          return state;
        } else {
          nextModel[action.boxIndex] = state.turn;
        }

        // Judge
        const result: constants.CheckBoardResult = judgeBoard(state.turn, nextModel);

        // If game ends
        if (result !== constants.CheckBoardResult.KEEP_RUNNING) {
          return {...state, model: nextModel, state: constants.GameState.GAME_OVER, judge: result};
        }

        // If game keeps going
        nextModel[action.boxIndex] = state.turn;
        return {...state, model: nextModel, turn: state.turn * -1};
      } else {
        conn.send(new constants.Message(constants.InputMessageType.CHECK_BOARD, {
          index: action.boxIndex,
          uuid: state.conn.id
        }));
        return {...state};
      }

    case constants.ActionType.RESTART:
      if (state.mode === constants.GameMode.SINGLE) {
        return {
          ...state, 
          judge: constants.CheckBoardResult.KEEP_RUNNING,
          model: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          state: constants.GameState.GAME_RUNNING, 
          turn: constants.Turn.O
        };
      } else {
        conn.send(new constants.Message(constants.InputMessageType.RESTART, {
          uuid: state.conn.id
        }));
        return state;
      }
    case constants.ActionType.BOARD_UPDATE:
      const payload: constants.IOutputCheckBoard = action.output;

      switch (payload.result) {
        case constants.CheckBoardResult.PLAYER_NOT_EXPECTED:
          alert("Requested player is not expected. Please restart the game.");
          location.href = "/";
          return state;
        case constants.CheckBoardResult.NOT_YOUR_TURN:
          alert("It's not your turn! Wait for your opponent.");
          return state;
        case constants.CheckBoardResult.ALREADY_MARKED:
          alert("Already marked! Try another space.");
          return state;
        case constants.CheckBoardResult.MARK_AFTER_GAME_OVER:
          alert("Game over! Please restart the game.");
          return state;
        default:
          break;
      }

      return {
        ...state,
        judge: payload.result,
        model: payload.model,
        state: payload.state,
        turn: payload.turn,
      }
    case constants.ActionType.ON_WAITING_OPPONENT:
      const onNewGamePayload = action.message.getPayload() as constants.IOutputNewGame;
      const newGameUuid: string = onNewGamePayload.uuid;

      return {
        ...state, 
        conn: {
          game: {
            players: {
              'O': {
                name: state.me.name
              },
              'X': {
                name: "???"
              }
            },
            uuid: newGameUuid
          },
          id: newGameUuid
        }
      }
    case constants.ActionType.ON_GAME_ESTABLISHED:
      const onGameEstablishedPayload = action.message.getPayload() as constants.IOutputGameEstablished;
      
      return {
        ...state,
        conn: {
          game: onGameEstablishedPayload,
          id: state.conn.id
        },
        judge: constants.CheckBoardResult.KEEP_RUNNING,
        model: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        state: constants.GameState.GAME_RUNNING, 
        turn: constants.Turn.O
      }
    case constants.ActionType.ON_GAME_ERROR:
      const errorType: constants.ErrorType = (action.message.getPayload() as constants.IOutputError).error;

      switch (errorType) {
        case constants.ErrorType.NO_GAME_BY_UUID:
          alert("No game was found by given Game ID. Please try again.");
          location.href = "/";
          return state;
        case constants.ErrorType.NO_PAYLOAD:
          alert("Connection error was occurred. Please try again.");
          location.href = "/";
          return state;
        case constants.ErrorType.NO_PLAYER_BY_SOCKET:
          alert("Technical error between players was occurred. Please try later.");
          location.href = "/";
          return state;
        case constants.ErrorType.USER_DISCONNECTED:
          alert("Your opponent was disconnected. Moving to lobby screen.");
          location.href = "/";
          return state;
        default:
          alert("Unexpected error was occurred. Please try again later.");
          location.href = "/";
          return state;
      }
    default:
      return state;
  }
}

// 이걸 여기에 넣는 게 올바른 패턴인지 확인이 필요함
function judgeBoard(turn: number, board: number[]): constants.CheckBoardResult {
  // horizontal
  for (let i = 0; i <= 6; i += 3) {
    const horizontalSum: number = board[i] + board[i + 1] + board[i + 2];
    
    if (horizontalSum === 3) {
      return constants.CheckBoardResult.O_WIN
    }

    if (horizontalSum === -3) {
      return constants.CheckBoardResult.X_WIN
    }
  }

  // vertical
  for (let j = 0; j <= 2; j += 1) {
    const verticalSum: number= board[j] + board[j + 3] + board[j + 6];
    if (verticalSum === 3) {
      return constants.CheckBoardResult.O_WIN
    }

    if (verticalSum === -3) {
      return constants.CheckBoardResult.X_WIN
    }
  }

  // cross
  const rightCross = board[0] + board[4] + board[8];
  const leftCross = board[2] + board[4] + board[6];

  if (rightCross === 3 || leftCross === 3) {
    return constants.CheckBoardResult.O_WIN
  }
  if (rightCross === -3 || leftCross === -3) {
    return constants.CheckBoardResult.X_WIN
  }

  // draw
  if (board.indexOf(0) === -1) {
    return constants.CheckBoardResult.DRAW
  } else {
    return constants.CheckBoardResult.KEEP_RUNNING
  }
}