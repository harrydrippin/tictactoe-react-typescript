import { connect, Dispatch } from 'react-redux';
import * as actions from '../../actions';

import { IStoreState } from '../../constants';

import BoardBox from '../../components/single/BoardBox';

export function mapStateToProps({ model }: IStoreState) {
  return {model};
};

export function mapDispatchToProps(dispatch: Dispatch<actions.RootAction>) {
  return {
    onBoardClick: (index: number) => {
      dispatch(actions.checkBoard(index));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardBox);