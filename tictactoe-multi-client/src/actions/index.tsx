import * as constants from '../constants';

export interface IInitializeMultiGame {
  type: constants.ActionType.INITIALIZE_MULTI_GAME,
  multi: constants.MultiGameType,
  name: string,
  uuid: string
}

export interface IMarkMode {
  type: constants.ActionType.MARK_MODE;
  mode: constants.GameMode;
}

export interface ICheckBoard {
  type: constants.ActionType.CHECK_BOARD;
  boxIndex: number;
}

export interface IRestart {
  type: constants.ActionType.RESTART;
}

export interface IBoardUpdate {
  type: constants.ActionType.BOARD_UPDATE;
  output: constants.IOutputCheckBoard;
}

export interface IOnWaitingOpponent {
  type: constants.ActionType.ON_WAITING_OPPONENT,
  message: constants.Message
}

export interface IOnGameEstablished {
  type: constants.ActionType.ON_GAME_ESTABLISHED,
  message: constants.Message
}

export interface IOnGameError {
  type: constants.ActionType.ON_GAME_ERROR,
  message: constants.Message
}

export type InitializeMultiGameAction = IInitializeMultiGame;
export type MarkModeAction = IMarkMode;
export type CheckBoardAction = ICheckBoard;
export type RestartAction = IRestart;
export type BoardUpdateAction = IBoardUpdate;
export type OnWaitingOpponentAction = IOnWaitingOpponent;
export type OnGameEstablishedAction = IOnGameEstablished;
export type OnGameErrorAction = IOnGameError;

export type RootAction = InitializeMultiGameAction | MarkModeAction | CheckBoardAction 
  | RestartAction | BoardUpdateAction| OnWaitingOpponentAction | OnGameEstablishedAction
  | OnGameErrorAction;

export function initializeMultiGame(multi: constants.MultiGameType, name: string, uuid: string): InitializeMultiGameAction {
 return {
    multi,
    name,
    type: constants.ActionType.INITIALIZE_MULTI_GAME,
    uuid
 }
}

export function markMode(mode: constants.GameMode): MarkModeAction {
  return {
    mode,
    type: constants.ActionType.MARK_MODE,
  }
}

export function checkBoard(index: number): CheckBoardAction {
  return {
    boxIndex: index,
    type: constants.ActionType.CHECK_BOARD
  };
}

export function restart(): RestartAction {
  return {
    type: constants.ActionType.RESTART
  };
}

export function boardUpdate(payload: constants.IOutputCheckBoard): BoardUpdateAction {
  return {
    output: payload,
    type: constants.ActionType.BOARD_UPDATE,
  }
}

export function onWaitingOpponent(m: constants.Message): OnWaitingOpponentAction {
  return {
    message: m,
    type: constants.ActionType.ON_WAITING_OPPONENT
  }
}

export function onGameEstablished(m: constants.Message): OnGameEstablishedAction {
  return {
    message: m,
    type: constants.ActionType.ON_GAME_ESTABLISHED
  }
}

export function onGameError(m: constants.Message): OnGameErrorAction {
  return {
    message: m,
    type: constants.ActionType.ON_GAME_ERROR
  }
}