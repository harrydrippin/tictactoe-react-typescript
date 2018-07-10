export enum GameState {
  GAME_RUNNING,
  GAME_OVER
};

export enum JudgeResult {
  KEEP_RUNNING = 0,
  O_WIN = 1,
  X_WIN = 2,
  DRAW = 3
}

export enum TurnMark {
  TURN_O = 1,
  TURN_X = -1
}

export const CHECK_BOARD = 'CHECK_BOARD';
export type CHECK_BOARD = typeof CHECK_BOARD;

export const RESTART = 'RESTART'
export type RESTART = typeof RESTART;