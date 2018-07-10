import { connect, Dispatch } from 'react-redux';
import * as actions from '../../actions';

import { IStoreState } from '../../constants';

import GameStatus from '../../components/single/GameStatus';

export function mapStateToProps({ turn, judge }: IStoreState) {
  return {turn, judge};
};

export function mapDispatchToProps(dispatch: Dispatch<actions.RootAction>) {
  return {
    onRestartClick: () => {dispatch(actions.restart())}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameStatus);