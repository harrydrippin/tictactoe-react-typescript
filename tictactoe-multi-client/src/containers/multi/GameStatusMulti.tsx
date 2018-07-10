import { connect, Dispatch } from 'react-redux';
import * as actions from '../../actions';

import { IStoreState } from '../../constants';

import GameStatusMulti from '../../components/multi/GameStatusMulti';

export function mapStateToProps({ turn, judge, conn, me }: IStoreState) {
  return { turn, judge, game: conn.game, name: me.name};
};

export function mapDispatchToProps(dispatch: Dispatch<actions.RootAction>) {
  return {
    onRestartClick: () => {dispatch(actions.restart())}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameStatusMulti);