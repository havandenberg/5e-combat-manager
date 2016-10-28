import Immutable from 'immutable';
import {routerActions} from 'react-router-redux';

const initialState = Immutable.fromJS({
  policyNumber: '',
  firstName: '',
  lastName: '',
  dateOfBirth: {day: '', month: '', year: ''},
  last4SSN: '',
  username: '',
  email: '',
  password: '',
  image: '',
  q1: '',
  a1: '',
  q2: '',
  a2: '',
  q3: '',
  a3: ''
});

export const ADD_POLICY_NUMBER = 'ADD_POLICY_NUMBER';
export const ADD_PERSONAL_INFO = 'ADD_PERSONAL_INFO';
export const ADD_ACCOUNT_INFO = 'ADD_ACCOUNT_INFO';
export const ADD_SECURITY_IMAGE = 'ADD_SECURITY_IMAGE';
export const ADD_SECURITY_QUESTIONS = 'ADD_SECURITY_QUESTIONS';
export const REGISTER = 'REGISTER';

export default function reducer(registerData = initialState, action = {}) {
  switch (action.type) {
  case ADD_POLICY_NUMBER:
    return registerData
      .set('policyNumber', action.policyNumber);
  case ADD_PERSONAL_INFO:
    return registerData
      .set('firstName', action.firstName)
      .set('lastName', action.lastName)
      .set('dateOfBirth', action.dateOfBirth)
      .set('last4SSN', action.last4SSN);
  case ADD_ACCOUNT_INFO:
    return registerData
      .set('username', action.username)
      .set('email', action.email)
      .set('password', action.password);
  case ADD_SECURITY_IMAGE:
    return registerData
      .set('image', action.image);
  case ADD_SECURITY_QUESTIONS:
    return registerData
      .set('q1', action.q1)
      .set('a1', action.a1)
      .set('q2', action.q2)
      .set('a2', action.a2)
      .set('q3', action.q3)
      .set('a3', action.a3);
  case REGISTER:
    return registerData;
  default:
    return registerData;
  }
}

export function handlePolicyNumber(fields) {
  return {
    type: ADD_POLICY_NUMBER,
    ...fields
  };
}

export function handlePersonalInfo(fields) {
  return {
    type: ADD_PERSONAL_INFO,
    ...fields
  };
}

export function handleAccountInfo(fields) {
  return {
    type: ADD_ACCOUNT_INFO,
    ...fields
  };
}

export function handleSecurityImage(fields) {
  return {
    type: ADD_SECURITY_IMAGE,
    ...fields
  };
}

export function handleSecurityQuestions(fields) {
  return {
    type: ADD_SECURITY_QUESTIONS,
    ...fields
  };
}

export function register() {
  return (dispatch) => {
    dispatch({
      type: REGISTER
    });
    dispatch(routerActions.push('/'));
  };
}
