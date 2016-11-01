import Immutable from 'immutable';
import {routerActions} from 'react-router-redux';
import firebase from 'utils/firebase';

const initialState = Immutable.fromJS({});

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export default function reducer(auth = initialState, action = {}) {
  switch (action.type) {
  case LOGIN:
    return auth
      .set('uid', action.uid)
      .set('isDM', action.uid === 'FIZvJUfXSbMJj0D0BLpxR4s7Ow13');
  case LOGOUT:
    return auth
      .set('isDM', false)
      .delete('uid');
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

export function logout() {
  return {
    type: LOGOUT
  };
}

export function startCreateAccount(email, password) {
  return (dispatch) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(() => {

    }).then(() => {
      dispatch(login(email));
      dispatch(routerActions.push('/'));
    });
  };
}

export function startLogin(email, password) {
  return (dispatch) => {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(() => {

    }).then(() => {
      dispatch(login(email));
      dispatch(routerActions.push('/'));
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
