import { createStore } from "redux";
import { rootReducer } from "../reducers";

import { RootAction } from "../actions";
import { CheckBoardResult, GameState, Turn } from "../constants";
import { IStoreState } from "../constants";

const store = createStore<IStoreState, RootAction, any, any>(rootReducer, {
  conn: {
    game: undefined,
    id: undefined
  },
  judge: CheckBoardResult.KEEP_RUNNING,
  me: {
    name: undefined,
    turn: undefined
  },
  model: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  state: GameState.GAME_RUNNING,
  turn: Turn.UNDEFINED,
});

export default store;