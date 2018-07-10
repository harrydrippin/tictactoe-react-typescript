import { RootAction } from "../actions";
import * as constants from "../constants";
import { IJudgeResult, IStoreState} from "../types";

export function rootReducer(state: IStoreState, action: RootAction): IStoreState {
  switch(action.type) {
    case constants.CHECK_BOARD:
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
      const result: IJudgeResult = judgeBoard(state.turn, nextModel);

      // If game ends
      if (result.judge !== constants.JudgeResult.KEEP_RUNNING) {
        return {...state, model: nextModel, state: constants.GameState.GAME_OVER, judge: result.judge};
      }

      // If game keeps going
      nextModel[action.boxIndex] = state.turn;
      return {...state, model: nextModel, turn: state.turn * -1};

    case constants.RESTART:
      return {
        ...state, 
        judge: constants.JudgeResult.KEEP_RUNNING,
        model: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        state: constants.GameState.GAME_RUNNING, 
        turn: constants.TurnMark.TURN_O
      };

    default:
      return state;
  }
}

// 이걸 여기에 넣는 게 올바른 패턴인지 확인이 필요함
function judgeBoard(turn: number, board: number[]): IJudgeResult {
  const newTurn = turn * -1;

  // horizontal
  for (let i = 0; i <= 6; i += 3) {
    const horizontalSum: number = board[i] + board[i + 1] + board[i + 2];
    
    if (horizontalSum === 3) {
      return {
        judge: constants.JudgeResult.O_WIN,
        turn: newTurn
      }
    }

    if (horizontalSum === -3) {
      return {
        judge: constants.JudgeResult.X_WIN,
        turn: newTurn
      }
    }
  }

  // vertical
  for (let j = 0; j <= 2; j += 1) {
    const verticalSum: number= board[j] + board[j + 3] + board[j + 6];
    if (verticalSum === 3) {
      return {
        judge: constants.JudgeResult.O_WIN,
        turn: newTurn
      }
    }

    if (verticalSum === -3) {
      return {
        judge: constants.JudgeResult.X_WIN,
        turn: newTurn
      }
    }
  }

  // cross
  const rightCross = board[0] + board[4] + board[8];
  const leftCross = board[2] + board[4] + board[6];

  if (rightCross === 3 || leftCross === 3) {
    return {
      judge: constants.JudgeResult.O_WIN,
      turn: newTurn
    }
  }
  if (rightCross === -3 || leftCross === -3) {
    return {
      judge: constants.JudgeResult.X_WIN,
      turn: newTurn
    }
  }

  // draw
  if (board.indexOf(0) === -1) {
    return {
      judge: constants.JudgeResult.DRAW,
      turn: newTurn
    }
  } else {
    return {
      judge: constants.JudgeResult.KEEP_RUNNING,
      turn: newTurn
    }
  }
}