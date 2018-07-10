import { connect, Dispatch } from 'react-redux';
import { IStoreState } from "../types";

import * as actions from "../actions";
import GameStatus from '../components/GameStatus';

export function mapStateToProps({ turn, judge }: IStoreState) {
  return {turn, judge};
};

export function mapDispatchToProps(dispatch: Dispatch<actions.RootAction>) {
  return {
    onRestartClick: () => {dispatch(actions.restart())}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameStatus);