import { connect, Dispatch } from 'react-redux';
import * as actions from '../../actions';

import { GameMode, IStoreState } from '../../constants';
import SingleGameScreen from '../../screens/SingleGameScreen';

export function mapStateToProps({}: IStoreState) {
  return {};
};

export function mapDispatchToProps(dispatch: Dispatch<actions.RootAction>) {
  return {
    markSingle: () => {
      dispatch(actions.markMode(GameMode.SINGLE));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleGameScreen);