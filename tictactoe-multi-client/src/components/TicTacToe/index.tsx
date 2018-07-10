import * as React from 'react';
import { Route } from 'react-router-dom';

import LobbyScreen from '../../containers/screen/LobbyScreen';

import MultiGameScreen from '../../containers/screen/MultiGameScreen';
import SingleGameScreen from '../../containers/screen/SingleGameScreen';

class TicTacToe extends React.Component {
  public render() {
    return (
        <div>
            <Route exact={true} path="/" component={LobbyScreen}/>
            <Route path="/single" component={SingleGameScreen}/>
            <Route path="/multi" component={MultiGameScreen}/>
        </div>
    );
  }
}

export default TicTacToe;