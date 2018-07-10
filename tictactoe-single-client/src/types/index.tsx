import { GameState, JudgeResult } from "../constants";

export interface IStoreState {
  state: GameState;
  turn: number;
  model: number[];
  judge: JudgeResult;
};

export interface IJudgeResult {
  turn: number;
  judge: JudgeResult;
}