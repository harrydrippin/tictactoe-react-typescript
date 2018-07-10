import { connect, Dispatch } from 'react-redux';
import * as actions from '../../actions';

import { IStoreState  } from '../../constants';

import BoardBoxMulti from '../../components/multi/BoardBoxMulti';

export function mapStateToProps({ model, me, turn }: IStoreState) {
  return {model, isDisabled: me.turn !== turn};
};

export function mapDispatchToProps(dispatch: Dispatch<actions.RootAction>) {
  return {
    onBoardClick: (index: number) => {
      dispatch(actions.checkBoard(index));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardBoxMulti);