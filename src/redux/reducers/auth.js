import Immutable from 'immutable';
import {routerActions} from 'react-router-redux';
import firebase from 'utils/firebase';

const initialState = Immutable.fromJS({
  errors: []
});

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export default function reducer(auth = initialState, action = {}) {
  switch (action.type) {
  case LOGIN:
    return auth
      .set('uid', action.uid)
      .set('isDM', action.uid === 'FIZvJUfXSbMJj0D0BLpxR4s7Ow13')
      .set('errors', []);
  case LOGOUT:
    return auth
      .set('isDM', false)
      .set('uid', '')
      .set('errors', []);
  case LOGIN_ERROR:
    return auth
      .set('errors', [action.error]);
  default:
    return auth;
  }
}

export function login(uid) {
  return {
    type: LOGIN,
    uid
  };
}

export function loginError(error) {
  return {
    type: LOGIN_ERROR,
    error
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}

export function startCreateAccount(email, password) {
  return (dispatch) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      dispatch(login(email));
      dispatch(routerActions.push('/'));
    }).catch((error) => {
      dispatch(loginError(error));
    });
  };
}

export function startLogin(email, password) {
  return (dispatch) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      dispatch(login(email));
      dispatch(routerActions.push('/'));
    }).catch((error) => {
      dispatch(loginError(error));
    });
  };
}

export function startLogout() {
  return (dispatch) => {
    firebase.auth().signOut().then(() => {
      dispatch(logout());
      dispatch(routerActions.push('/'));
    });
  };
}
