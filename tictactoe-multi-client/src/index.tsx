import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TicTacToe from './components/TicTacToe';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import store from './store';

import { HashRouter } from 'react-router-dom';

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <TicTacToe />
    </HashRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
