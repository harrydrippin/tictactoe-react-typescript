import { connect, Dispatch } from 'react-redux';
import * as actions from '../../actions';

import { IStoreState, MultiGameType } from '../../constants';
import LobbyScreen from '../../screens/LobbyScreen';

export function mapStateToProps({}: IStoreState) {
  return {};
};

export function mapDispatchToProps(dispatch: Dispatch<actions.RootAction>) {
  return {
    initializeMultiGame: (type: MultiGameType, name: string, uuid: string) => {
      dispatch(actions.initializeMultiGame(type, name, uuid));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LobbyScreen);