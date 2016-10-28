import React from 'react';
import {render} from 'react-dom';
import thunk from 'redux-thunk';
import {browserHistory, Router} from 'react-router';
import {routerMiddleware, syncHistoryWithStore} from 'react-router-redux';
import {compose, createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

import routes from './routes';
import reducers from 'reducers/reducer';

import 'styles/main.styl';

const middleware = [thunk, routerMiddleware(browserHistory)];

const appRoot = document.getElementById('app');
const store = compose(
  applyMiddleware(...middleware),
  window.devToolsExtension ? window.devToolsExtension() : (f) => f
)(createStore)(reducers);
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history}>{routes}</Router>
  </Provider>
, appRoot);
