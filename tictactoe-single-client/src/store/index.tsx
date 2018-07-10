import { createStore } from "redux";
import { rootReducer } from "../reducers";

import { RootAction } from "../actions";
import { GameState, JudgeResult, TurnMark } from "../constants";
import { IStoreState } from "../types";

const store = createStore<IStoreState, RootAction, any, any>(rootReducer, {
  judge: JudgeResult.KEEP_RUNNING,
  model: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  state: GameState.GAME_RUNNING,
  turn: TurnMark.TURN_O
});

export default store;