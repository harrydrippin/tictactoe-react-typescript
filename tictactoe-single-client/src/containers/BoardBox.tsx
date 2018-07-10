import { connect, Dispatch } from 'react-redux';
import { IStoreState } from "../types";

import * as actions from "../actions";
import BoardBox from '../components/BoardBox';

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