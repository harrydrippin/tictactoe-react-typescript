import { connect, Dispatch } from 'react-redux';
import * as actions from '../../actions';

import { GameMode, IStoreState } from '../../constants';
import MultiGameScreen from '../../screens/MultiGameScreen';

export function mapStateToProps({}: IStoreState) {
  return {};
};

export function mapDispatchToProps(dispatch: Dispatch<actions.RootAction>) {
  return {
    markMulti: () => {
      dispatch(actions.markMode(GameMode.MULTI));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MultiGameScreen);