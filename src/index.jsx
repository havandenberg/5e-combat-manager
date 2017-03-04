import React from 'react';
import {render} from 'react-dom';
import thunk from 'redux-thunk';
import {browserHistory, Router} from 'react-router';
import {routerMiddleware, syncHistoryWithStore} from 'react-router-redux';
import {compose, createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import firebase from 'utils/firebase';

import routes from './routes';
import reducers from 'reducers/reducer';
import * as authActions from 'reducers/auth';
import * as characterActions from 'reducers/character';
import * as combatActions from 'reducers/combat';
import * as folderActions from 'reducers/folder';

import 'styles/main.styl';

const middleware = [thunk, routerMiddleware(browserHistory)];

const appRoot = document.getElementById('app');
const store = compose(
  applyMiddleware(...middleware),
  window.devToolsExtension ? window.devToolsExtension() : (f) => f
)(createStore)(reducers);
const history = syncHistoryWithStore(browserHistory, store);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(authActions.login(user.uid));
    store.dispatch(characterActions.listenForCharacterChanges());
    store.dispatch(combatActions.listenForCombatChanges());
    store.dispatch(folderActions.listenForFolderChanges());
    history.push('/dashboard');
  } else {
    store.dispatch(authActions.logout());
    store.dispatch(characterActions.clearCharacters());
    store.dispatch(combatActions.clearCombats());
    store.dispatch(folderActions.clearFolders());
    history.push('/');
  }
});

render(
  <Provider store={store}>
    <Router history={history}>{routes}</Router>
  </Provider>
, appRoot);
