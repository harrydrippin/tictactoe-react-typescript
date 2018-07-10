import { connect, Dispatch } from 'react-redux';
import * as actions from '../../actions';

import { IOutputCheckBoard, IStoreState, Message } from '../../constants';

import GameBoardMulti from '../../components/multi/GameBoardMulti';

export function mapStateToProps({ me, type, conn }: IStoreState) {
  return { id: conn.id, name: me.name, type};
};

export function mapDispatchToProps(dispatch: Dispatch<actions.RootAction>) {
  return {
    onBoardUpdate: (payload: IOutputCheckBoard) => {
      dispatch(actions.boardUpdate(payload));
    },
    onGameError: (m: Message) => {
      dispatch(actions.onGameError(m))
    },
    onGameEstablished: (m: Message) => {
      dispatch(actions.onGameEstablished(m))
    },
    onWaitingOpponent: (m: Message) => {
      dispatch(actions.onWaitingOpponent(m))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameBoardMulti);