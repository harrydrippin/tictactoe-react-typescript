import * as constants from '../constants';

export interface ICheckBoard {
  type: constants.CHECK_BOARD;
  boxIndex: number;
}

export interface IRestart {
  type: constants.RESTART;
}

export type CheckBoardAction = ICheckBoard;
export type RestartAction = IRestart;

export type RootAction = CheckBoardAction | RestartAction;

export function checkBoard(index: number): CheckBoardAction {
  return {
    boxIndex: index,
    type: constants.CHECK_BOARD
  };
}

export function restart(): RestartAction {
  return {
    type: constants.RESTART
  };
}