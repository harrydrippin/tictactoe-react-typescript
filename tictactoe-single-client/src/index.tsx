import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TicTacToe from './components/TicTacToe';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <TicTacToe />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
