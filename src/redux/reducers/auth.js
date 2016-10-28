import Immutable from 'immutable';
import {routerActions} from 'react-router-redux';

const initialState = Immutable.fromJS({
  username: '',
  password: '',
  rememberMe: false
});

export const CHECK_USERNAME = 'CHECK_USERNAME';
export const LOGIN = 'LOGIN';

export default function reducer(auth = initialState, action = {}) {
  switch (action.type) {
  case CHECK_USERNAME:
    return auth
      .set('username', action.username)
      .set('rememberMe', action.rememberMe);
  case LOGIN:
    return auth
      .set('password', action.password);
  default:
    return auth;
  }
}

export function checkUsername(username = '', rememberMe = false) {
  return (dispatch) => {
    dispatch({
      type: CHECK_USERNAME,
      username,
      rememberMe
    });
    dispatch(routerActions.push('/login/verify'));
  };
}

export function login(password = '') {
  return (dispatch) => {
    dispatch({
      type: LOGIN,
      password
    });
    dispatch(routerActions.push('/'));
  };
}
